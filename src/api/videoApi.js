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
        }),
        removeVideoAsync:builder.mutation({
            query:(publicVideoId) => ({
                url:`?fileName=${publicVideoId}`,
                method:"DELETE",
            })
        }),
        changeVideoAsnc:builder.mutation({
            query:(fileModel) => (
                
{
    url:`${fileModel.fileName}`,
    method:"PUT",
    body:fileModel.formData
}
            )
        })
    })
})

// fileName,formData


export const {useGetWatchVideoUrlMutation,useRemoveVideoAsyncMutation,useChangeVideoAsncMutation} = videoApi;