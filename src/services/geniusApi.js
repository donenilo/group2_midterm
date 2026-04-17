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

  }),
});

export const { useSearchSongsQuery, useGetSongByIdQuery, useGetSongReferentsQuery } = geniusApi;