import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { baseUrl } from './Base/baseApiModel'
import { create } from '@mui/material/styles/createTransitions'


export const courseApi = createApi({
    reducerPath:"courseApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Course",
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
        
    }),
    tagTypes:["course"],
    endpoints:(builder) => ({
        getCourseDetailById:builder.query({
            query:(courseId) => ({
                url:`GetCourse/${courseId}`,
                method:"GET"
            })
        }),
        getSectionsByCourseId:builder.query({
            query:(courseId)=> ({
                url:`s/${courseId}`,
                method:"GET"
            }),
            providesTags:["course"]
        }),
        getCourseIntroductionVideos:builder.query({
            query:()=> ({
                url:`GetCourseIntroductionVideos`,
                method:"GET"
            }),
            providesTags:["course"]

        }),
        getAllCourses:builder.mutation({
            query:(model)=>   {
                return ({
                    url:`GetAllCourses`,
                    method:"POST",
                    body:model
                })
            },
            providesTags:["course"]

        }),
        createCourseAsync:builder.mutation({
            query:(courseModel) => ({
                method:"POST",
                body:courseModel
            }),
            invalidatesTags:["course"]
        }),
        // https://localhost:7042/api/Course/06d1b9de-d22e-4dea-a82b-119897a8243f
        removeCourseAsync:builder.mutation({
            query:(courseId) =>({
                method:"DELETE",
                url:`${courseId}`
            }),
            invalidatesTags:["course"]

        }),
        evaluateUpdateCourse:builder.mutation({
            query:(evaluateModel) => ({
                method:"PUT",
                body:evaluateModel,
                url:"EvaluateCourse",
            })
        }),
        getEvaluateCourses:builder.query({
            query:() => ({
                method:"GET",
                url:"GetEvaluationCourses"
            })
        }),
        getMostPopularCourses:builder.query({
            query:()=>({
                method:"GET",
                url:"MostPopularCourses"
            })
        })
       

        // https://localhost:7042/api/User/CheckVerificationMailCode?email=deneme%40gmail.com&digitCode=123456
    })
})


export const {useGetCourseDetailByIdQuery,
            useGetSectionsByCourseIdQuery,
            useGetCourseIntroductionVideosQuery,
            useGetAllCoursesMutation,
            useCreateCourseAsyncMutation,
            useRemoveCourseAsyncMutation,
            useEvaluateUpdateCourseMutation,
            useGetEvaluateCoursesQuery,
            useGetMostPopularCoursesQuery
            } = courseApi