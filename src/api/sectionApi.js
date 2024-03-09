import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";


export const sectionApi = createApi({
    reducerPath:"sectionApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Section"
    }),
    endpoints:(builder) => ({
        getSectionSubDetails:builder.query({
            query:(sectionId)=>({
                url:`${sectionId}`,
                method:"GET"
            })
        })
    })
})


export const {useGetSectionSubDetailsQuery} = sectionApi