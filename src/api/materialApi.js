import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"


// https://localhost:7042/api/Material/DownloadFile

export const materialApi = createApi({
    reducerPath:"materialApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Material",
        prepareHeaders:(headers,{getState}) => {
            const state = getState();
            const country = state.locationStore; 

            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token)
          
            return headers;
        }
    }),
    endpoints:(builder) => ({
        downloadMaterialFile:builder.mutation({
            query:(materialModel) => {
                return {
                    method:"POST",
                    body:materialModel,
                    url:"DownloadFile"
                }
            }

        }),
        uploadMaterialFile:builder.mutation({
            query:(formData) => {
                return {
                    method:"POST",
                    body:formData,
                    url:"UploadFile"
                }
            }
        }),
        removeMaterialAsync:builder.mutation({
            query:(fileName) => {
                return {
                    method:"DELETE",
                    url:`${fileName}`,

                }
            }
        })
    })
})



export const {useDownloadMaterialFileMutation,useUploadMaterialFileMutation,useRemoveMaterialAsyncMutation} = materialApi
