import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const bootcampInstructorDetailApi = createApi({
    reducerPath:"bootcampInstructorDetailApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"BootcampInstructorDetail",
        prepareHeaders:(headers,{getState}) => {
            const state = getState();
            const country = state.locationStore; 

            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token)
          
            return headers;
        }
    }),
    endpoints:(builder) => ({
        addBootcampInstructorDetail:builder.mutation({
           query:(data) => ({
                url:"AddBootcampInstructorDetail",
                method:"POST",
                body:data
           })
        }),
        getBootcampInstructorDetail:builder.query({
            query:(bootcampId) => ({
                url:`GetBootcampInstructorDetail/${bootcampId}`,
                method:"GET" 
            })
        }),
    })
})
// getUsers: builder.query({
//     query: (user) => `users/${user}`
// }),

export const {useAddBootcampInstructorDetailMutation,useGetBootcampInstructorDetailQuery} = bootcampInstructorDetailApi