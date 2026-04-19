import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const geniusApi = createApi({
  reducerPath: "geniusApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/genius" }),
  endpoints: (builder) => ({

    searchSongs: builder.query({
      query: ({ q, tag, sort }) => {
        const params = new URLSearchParams();
        const searchText = [q, tag].filter(Boolean).join(" ");
        if (searchText) params.set("q", searchText);
        return `/search?${params.toString()}`;
      },
      transformResponse: (res) => {
        const hits = res?.response?.hits;
        if (!Array.isArray(hits)) {
          return [];
        }
        return hits.map((h) => h.result);
      },
    }),

    getSongById: builder.query({
      query: (id) => `/songs/${id}`,
      transformResponse: (res) => res.response.song,
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
      query: (id) => `/artists/${id}`,
      transformResponse: (res) => res.response.artist,
    }),

    getArtistSongs: builder.query({
      query: (id) => `/artists/${id}/songs?per_page=50&sort=popularity`,
      transformResponse: (res) => {
        const songs = res?.response?.songs;
        return Array.isArray(songs) ? songs : [];
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