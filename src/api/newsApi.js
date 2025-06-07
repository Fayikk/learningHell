import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"

export const newsApi = createApi({
    reducerPath: "newsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl + "news",
        prepareHeaders: (headers, api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization", "Bearer " + token);
            return headers;
        }
    }),
    tagTypes: ["news"],
    endpoints: (builder) => ({
        getAllNews: builder.query({
            query: () => ({
                url: "",
                method: "GET"
            }),
            providesTags: ["news"]
        }),
        
        getNewsById: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: "news", id }]
        }),
        
        getNewsBySlug: builder.query({
            query: (slug) => ({
                url: `/slug/${slug}`,
                method: "GET"
            }),
            providesTags: (result, error, slug) => [{ type: "news", id: `slug-${slug}` }]
        }),
        
        getNewsByCategory: builder.query({
            query: (category) => ({
                url: `/category/${category}`,
                method: "GET"
            }),
            providesTags: (result, error, category) => [{ type: "news", id: `category-${category}` }]
        }),
        
        getNewsByTag: builder.query({
            query: (tagName) => ({
                url: `/tag/${tagName}`,
                method: "GET"
            }),
            providesTags: (result, error, tagName) => [{ type: "news", id: `tag-${tagName}` }]
        }),
        
        getTrendingNews: builder.query({
            query: (count = 5) => ({
                url: `/trending?count=${count}`,
                method: "GET"
            }),
            providesTags: (result, error, count) => [{ type: "news", id: `trending-${count}` }]
        }),
        
        getLatestNews: builder.query({
            query: (count = 10) => ({
                url: `/latest?count=${count}`,
                method: "GET"
            }),
            providesTags: (result, error, count) => [{ type: "news", id: `latest-${count}` }]
        }),
        
        searchNews: builder.query({
            query: (searchTerm) => ({
                url: `/search?searchTerm=${encodeURIComponent(searchTerm)}`,
                method: "GET"
            }),
            providesTags: (result, error, searchTerm) => [{ type: "news", id: `search-${searchTerm}` }]
        }),
        
        createNews: builder.mutation({
            query: (newsData) => ({
                url: "",
                method: "POST",
                body: newsData
            }),
            invalidatesTags: ["news"]
        }),
        
        updateNews: builder.mutation({
            query: ({ id, ...newsData }) => ({
                url: `/${id}`,
                method: "PUT",
                body: newsData
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "news", id }, "news"]
        }),
        
        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: (result, error, id) => [{ type: "news", id }, "news"]
        }),
        
        incrementViewCount: builder.mutation({
            query: (id) => ({
                url: `/${id}/view`,
                method: "POST"
            }),
            invalidatesTags: (result, error, id) => [{ type: "news", id }]
        })
    })
})

export const {
    useGetAllNewsQuery,
    useGetNewsByIdQuery,
    useGetNewsBySlugQuery,
    useGetNewsByCategoryQuery,
    useGetNewsByTagQuery,
    useGetTrendingNewsQuery,
    useGetLatestNewsQuery,
    useSearchNewsQuery,
    useCreateNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
    useIncrementViewCountMutation
} = newsApi