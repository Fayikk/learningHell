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
        })
    })
})


export const {useGetSectionSubDetailsQuery,useRemoveSectionAsyncMutation} = sectionApi