import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from './Base/baseApiModel'
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const videoApi = createApi({
    reducerPath:"videoApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Video"
    }),
    endpoints:(builder) => ({
        getWatchVideoUrl:builder.mutation({
            query:(publicId) => ({
                url:`WatchVideo?publicId=${publicId}`,
                method:"POST",
            })
        })
    })
})


export const {useGetWatchVideoUrlMutation} = videoApi;