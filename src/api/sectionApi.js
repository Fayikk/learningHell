import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";


export const sectionApi = createApi({
    reducerPath:"sectionApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Section"
    }),
    tagTypes:["section"],
    endpoints:(builder) => ({
        getSectionSubDetails:builder.query({
            query:(sectionId)=>({
                url:`${sectionId}`,
                method:"GET"
            }),
            providesTags:["section"]
        }),
        removeSectionAsync:builder.mutation({
            query:(sectionId) => ({
                method:"DELETE",
                url:`?sectionId=${sectionId}`
            }),
            invalidatesTags:["section"]
        }),
        addSectionAsync:builder.mutation({
            query:(sectionModel) => ({
                method:"POST",
                body:sectionModel
            }),
            invalidatesTags:["section"]

        }),
        updateSectionRows:builder.mutation({
            query:(sectionList) => (
                {
                    method:"PUT",
                    body:sectionList,
                    url:"SectionRows"
                }
            )
        }),
        updateSectionAsync:builder.mutation({
            query:(updateModel) => (
                        {
            method:"PUT",
            body:updateModel.sectionUpdateModel,
            url:`?sectionId=${updateModel.sectionId}`
        }
            )
        })
    })
})





export const {
        useGetSectionSubDetailsQuery,
        useRemoveSectionAsyncMutation,
        useAddSectionAsyncMutation,
        useUpdateSectionRowsMutation,
        useUpdateSectionAsyncMutation} = sectionApi