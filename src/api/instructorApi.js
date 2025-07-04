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
    tagTypes:["instructor"],
    endpoints:(builder) => ({
        getAllInstructorCourses:builder.mutation({
            query:(filterModel)=>({
                method:"POST",
                body:filterModel
            }),
            invalidatesTags:["instructor"]
        }),
        getCourseDetail:builder.query({
            query:(courseId)=>{return (
                courseId == "NewCourse" ? null : {
                    method:"GET",
                    url:`${courseId}`
                }
            )},
            providesTags:["instructor"]
        })
    })
})


export const {useGetAllInstructorCoursesMutation,useGetCourseDetailQuery} = instructorApi