import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const categoryApi = createApi({
    reducerPath:"categoryApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Category"
    }),
    endpoints:(builder) => ({
        getAllCategories:builder.query({
            query:() => ({
                url:"Categories",
                method:"GET",

            })
        }),
    })
})


export const {useGetAllCategoriesQuery} = categoryApi