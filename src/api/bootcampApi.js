import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const bootcampApi = createApi({
    reducerPath:"bootcampApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Bootcamp"
    }),
    endpoints:(builder) => ({
        createNewBootcamp:builder.mutation({
            query:(bootcampModel) => ({
                url:"CreateBootcamp",
                method:"POST",
                body:bootcampModel
            })
        }),
        updateBootcamp:builder.mutation({
            query:(bootcampModel) => ({
                url:"UpdateBootcamp",
                method:"PUT",
                body:bootcampModel
            })
        }),
        getAllBootcamps:builder.mutation({
            query:(bootcampModel) => ({
                url:`GetAllBootcamps`,
                method:"POST",
                body:bootcampModel
            })
        }),
    })
})


export const {useCreateNewBootcampMutation,useUpdateBootcampMutation,useGetAllBootcampsMutation} = bootcampApi