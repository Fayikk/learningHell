import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"

export const tagsApi = createApi({
    reducerPath: "tagsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl + "tag",
        prepareHeaders: (headers, api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization", "Bearer " + token);
            return headers;
        }
    }),
    tagTypes: ["tags"],
    endpoints: (builder) => ({
        getAllTags: builder.query({
            query: () => ({
                url: "",
                method: "GET"
            }),
            providesTags: ["tags"]
        }),
        
        getTagById: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: "tags", id }]
        }),
        
        getTagByName: builder.query({
            query: (name) => ({
                url: `/name/${name}`,
                method: "GET"
            }),
            providesTags: (result, error, name) => [{ type: "tags", id: name }]
        }),
        
        getTagsByNewsId: builder.query({
            query: (newsId) => ({
                url: `/news/${newsId}`,
                method: "GET"
            }),
            providesTags: (result, error, newsId) => [{ type: "tags", id: `news-${newsId}` }]
        }),
        
        getPopularTags: builder.query({
            query: (count = 10) => ({
                url: `/popular?count=${count}`,
                method: "GET"
            }),
            providesTags: ["tags"]
        }),
        
        createTag: builder.mutation({
            query: (tagData) => ({
                url: "",
                method: "POST",
                body: tagData
            }),
            invalidatesTags: ["tags"]
        }),
        
        updateTag: builder.mutation({
            query: ({ id, ...tagData }) => ({
                url: `/${id}`,
                method: "PUT",
                body: tagData
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "tags", id }, "tags"]
        }),
        
        deleteTag: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: (result, error, id) => [{ type: "tags", id }, "tags"]
        }),
        
        addTagToNews: builder.mutation({
            query: ({ tagId, newsId }) => ({
                url: `/${tagId}/news/${newsId}`,
                method: "POST"
            }),
            invalidatesTags: (result, error, { tagId, newsId }) => [
                { type: "tags", id: tagId },
                { type: "tags", id: `news-${newsId}` },
                "tags"
            ]
        }),
        
        removeTagFromNews: builder.mutation({
            query: ({ tagId, newsId }) => ({
                url: `/${tagId}/news/${newsId}`,
                method: "DELETE"
            }),
            invalidatesTags: (result, error, { tagId, newsId }) => [
                { type: "tags", id: tagId },
                { type: "tags", id: `news-${newsId}` },
                "tags"
            ]
        })
    })
})

export const {
    useGetAllTagsQuery,
    useGetTagByIdQuery,
    useGetTagByNameQuery,
    useGetTagsByNewsIdQuery,
    useGetPopularTagsQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
    useAddTagToNewsMutation,
    useRemoveTagFromNewsMutation
} = tagsApi