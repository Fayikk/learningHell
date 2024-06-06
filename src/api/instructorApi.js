import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";


export const instructorApi = createApi({
    reducerPath:"instructorApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"InstructorControlller",
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
    }),
    endpoints:(builder) => ({
        getAllInstructorCourses:builder.mutation({
            query:()=>({
                method:"POST"
            })
        }),
        getCourseDetail:builder.query({
            query:(courseId)=>({
                method:"GET",
                url:`${courseId}`
            })
        })
    })
})


export const {useGetAllInstructorCoursesMutation,useGetCourseDetailQuery} = instructorApi