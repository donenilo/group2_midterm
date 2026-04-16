import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const geniusApi = createApi({
  reducerPath: "geniusApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/genius" }),
  endpoints: (builder) => ({

    searchSongs: builder.query({
      query: ({ q, tag, sort }) => {
        const params = new URLSearchParams();
        if (q)    params.set("q", q);
        if (tag)  params.set("q", `${q} ${tag}`);
        if (sort) params.set("sort", sort);
        return `?${params.toString()}`;
      },
      transformResponse: (res) =>
        res.response.hits.map((h) => h.result),
    }),

    getSongById: builder.query({
      query: (id) => `?id=${id}`,
      transformResponse: (res) => res.response.song,
    }),

  }),
});

export const { useSearchSongsQuery, useGetSongByIdQuery } = geniusApi;