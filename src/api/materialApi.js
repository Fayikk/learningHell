import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"


// https://localhost:7042/api/Material/DownloadFile

export const materialApi = createApi({
    reducerPath:"materialApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Material",
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

        })
    })
})



export const {useDownloadMaterialFileMutation} = materialApi
