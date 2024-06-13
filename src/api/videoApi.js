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

        // const updateVideoModel = {
        //     videoId:videoId,
        //     videoModel:rowNumber
        //   }
      

      
        updateVideoAsync:builder.mutation({
            query:(updateVideoModel) =>   (
                {
                    url:`UpdateVideo/${updateVideoModel.videoId}`,
                    method:"PUT",
                     body:updateVideoModel.updateVideoModel
                }
            )         }),
        changeVideoAsnc:builder.mutation({
            query:(fileModel) => (
                
{
    url:`${fileModel.fileName}`,
    method:"PUT",
    body:fileModel.formData
}
            )
        }),
        addVideoAsync:builder.mutation({
            query:(videoModel) => ({
                url:"UploadVideo",
                method:"POST",
                body:videoModel
            })
        })
    })
})

// fileName,formData


export const {useGetWatchVideoUrlMutation,useRemoveVideoAsyncMutation,useChangeVideoAsncMutation,useAddVideoAsyncMutation,useUpdateVideoAsyncMutation} = videoApi;