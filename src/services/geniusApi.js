import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setLoadingMoreResults } from "../store/filtersSlice";

const UI_RESULTS_PER_PAGE = 20;
const TARGET_UI_PAGES = 6;
const TARGET_RESULTS = UI_RESULTS_PER_PAGE * TARGET_UI_PAGES;
const MAX_BACKEND_PAGES = 12;

export const geniusApi = createApi({
  reducerPath: "geniusApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/genius" }),
  endpoints: (builder) => ({

    searchSongs: builder.query({
      async queryFn({ q, tag }, api, extraOptions, fetchWithBQ) {
        try {
          api.dispatch(setLoadingMoreResults(false));

          const searchText = [q, tag]
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          if (!searchText) return { data: [] };

          const buildSearchPath = (page) => {
            const params = new URLSearchParams();
            params.set("q", searchText);
            params.set("page", String(page));
            params.set("per_page", "20");
            return `/search?${params.toString()}`;
          };

          const extractSongs = (res) => {
            const hits = res?.data?.response?.hits;
            return Array.isArray(hits) ? hits.map((h) => h.result) : [];
          };

          // First request is returned immediately for progressive rendering.
          const firstPage = await fetchWithBQ(buildSearchPath(1));
          if (firstPage.error) return { error: firstPage.error };

          const firstSongs = extractSongs(firstPage);
          if (firstSongs.length === 0) return { data: [] };
          const seen = new Set();
          const uniqueFirstSongs = firstSongs.filter((song) => {
            if (!song?.id || seen.has(song.id)) return false;
            seen.add(song.id);
            return true;
          });

          const queryArg = { q, tag };
          const observedPerPage = Math.max(uniqueFirstSongs.length, 1);
          const totalPagesNeeded = Math.ceil(TARGET_RESULTS / observedPerPage);
          const pagesToFetch = Math.min(Math.max(totalPagesNeeded, 1), MAX_BACKEND_PAGES);

          if (pagesToFetch > 1) {
            api.dispatch(setLoadingMoreResults(true));
            (async () => {
              try {
                for (let page = 2; page <= pagesToFetch; page += 1) {
                  if (api.signal.aborted) return;

                  const response = await fetchWithBQ(buildSearchPath(page));
                  if (response.error) return;

                  const nextSongs = extractSongs(response)
                    .filter((song) => song?.id)
                    .filter((song) => !seen.has(song.id));

                  if (nextSongs.length === 0) return;

                  nextSongs.forEach((song) => seen.add(song.id));

                  api.dispatch(
                    geniusApi.util.updateQueryData("searchSongs", queryArg, (draft) => {
                      const draftIds = new Set(draft.map((song) => song?.id));
                      nextSongs.forEach((song) => {
                        if (!draftIds.has(song.id) && draft.length < TARGET_RESULTS) {
                          draft.push(song);
                          draftIds.add(song.id);
                        }
                      });
                    })
                  );

                  const current = api.getState()?.[geniusApi.reducerPath]?.queries;
                  if (!current) return;
                }
              } finally {
                api.dispatch(setLoadingMoreResults(false));
              }
            })();
          } else {
            api.dispatch(setLoadingMoreResults(false));
          }

          return { data: uniqueFirstSongs.slice(0, TARGET_RESULTS) };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),

    getSongById: builder.query({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        if (!id) {
          return {
            error: { status: "CUSTOM_ERROR", error: "Missing song id." },
          };
        }

        // Try the catch-all API route first, then fallback to the query-param route.
        // This prevents production breakage if /api/genius/[...geniusPath] is unavailable.
        let response = await fetchWithBQ(`/songs/${id}`);
        if (response.error?.status === 404) {
          response = await fetchWithBQ(`?id=${encodeURIComponent(id)}`);
        }

        if (response.error) {
          return { error: response.error };
        }

        const song = response?.data?.response?.song;
        if (!song) {
          return {
            error: { status: 404, data: { message: "Song not found." } },
          };
        }

        let videoEmbed = song?.media?.find((m) => m.type === "video");
        if (videoEmbed?.url) {
          const watchUrlMatch = videoEmbed.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
          if (watchUrlMatch && watchUrlMatch[1]) {
            videoEmbed = {
              ...videoEmbed,
              url: `https://www.youtube.com/embed/${watchUrlMatch[1]}`,
            };
          }
        }

        return {
          data: {
            ...song,
            videoEmbed: videoEmbed || null,
          },
        };
      },
    }),

    getSongReferents: builder.query({
      query: (songId) => `/referents?song_id=${songId}&per_page=50`,
      transformResponse: (res) => {
        const referents = res?.response?.referents;
        return Array.isArray(referents) ? referents : [];
      },
    }),

    getLyrics: builder.query({
      query: ({ artist, title }) => {
        const encodedArtist = encodeURIComponent(artist);
        const encodedTitle = encodeURIComponent(title);
        return `https://api.lyrics.ovh/v1/${encodedArtist}/${encodedTitle}`;
      },
      transformResponse: (res) => res.lyrics || null,
    }),

    getArtistById: builder.query({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        if (!id) {
          return {
            error: { status: "CUSTOM_ERROR", error: "Missing artist id." },
          };
        }

        let response = await fetchWithBQ(`/artists/${id}`);
        if (response.error?.status === 404) {
          response = await fetchWithBQ(`?path=${encodeURIComponent(`/artists/${id}`)}`);
        }

        if (response.error) {
          return { error: response.error };
        }

        const artist = response?.data?.response?.artist;
        if (!artist) {
          return {
            error: { status: 404, data: { message: "Artist not found." } },
          };
        }

        return { data: artist };
      },
    }),

    getArtistSongs: builder.query({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        if (!id) {
          return {
            error: { status: "CUSTOM_ERROR", error: "Missing artist id." },
          };
        }

        let response = await fetchWithBQ(`/artists/${id}/songs?per_page=50&sort=popularity`);
        if (response.error?.status === 404) {
          response = await fetchWithBQ(`?path=${encodeURIComponent(`/artists/${id}/songs?per_page=50&sort=popularity`)}`);
        }

        if (response.error) {
          return { error: response.error };
        }

        const songs = response?.data?.response?.songs;
        return { data: Array.isArray(songs) ? songs : [] };
      },
    }),

  }),
});

export const { 
  useSearchSongsQuery, 
  useGetSongByIdQuery, 
  useGetSongReferentsQuery, 
  useGetLyricsQuery,
  useGetArtistByIdQuery,
  useGetArtistSongsQuery
} = geniusApi;