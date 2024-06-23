import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const categoryApi = createApi({
    reducerPath:"categoryApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Category"
    }),
    endpoints:(builder) => ({
        getAllCategoriesForSelected:builder.query({
           query:()=>`Categories`
        }),
        getAllCategories:builder.query({
            query:() => ({
                url:"Categories",
                method:"GET",

            })
        }),
        getCoursesByCategoryId:builder.query({
            query:(categoryId)=>({
                url:`GetCategoryById/${categoryId}`,
                method:"GET" 
            })
        })
    })
})
// getUsers: builder.query({
//     query: (user) => `users/${user}`
// }),

export const {useGetAllCategoriesQuery,useLazyGetAllCategoriesForSelectedQuery,useGetCoursesByCategoryIdQuery} = categoryApi