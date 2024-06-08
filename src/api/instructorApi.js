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
        getAllInstructorCourses:builder.query({
            query:()=>({
                method:"GET"
            }),
            providesTags:["instructor"]
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


export const {useGetAllInstructorCoursesQuery,useGetCourseDetailQuery} = instructorApi