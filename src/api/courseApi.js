import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { baseUrl } from './Base/baseApiModel'
import { create } from '@mui/material/styles/createTransitions'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie';
export const courseApi = createApi({
    reducerPath:"courseApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Course",
        credentials:'include',
        mode:"cors",
        prepareHeaders:(headers,{getState}) => {
            const state = getState();
            const country = state.locationStore; 

            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token)
          
            return headers;
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
                url:`CourseSections/${courseId}`,
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
                url:"EvaluateCourse"
            })
        }),
        getEvaluateCourses:builder.query({
            query:() => ({
                method:"GET",
                url:"GetEvaluationCourses",
            })
        }),
        getMostPopularCourses:builder.query({
            query:()=>({
                method:"GET",
                url:"MostPopularCourses",
            })
        }),
        // https://localhost:7042/api/Course/dene
        getCoursesBySearch:builder.mutation({
            query:(value)=>({
                method:"POST",
                url:`${value}`
            })
        }),
        // /GetById?courseId=e98d40a4-19d7-4552-ac5d-0b1be7f970c4
        getCourseById:builder.mutation({
            query:(value)=>({
                method:"POST",
                url:`GetById?courseId=${value}`
            })
        }),
        updateCourse:builder.mutation({
            query:(updateCourseModel) => ({
                method:"PUT",
                url:`UpdateCourse/${updateCourseModel.courseId}`,
                body:updateCourseModel.formData
            }),
            invalidatesTags:["course"]
            
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
            useGetMostPopularCoursesQuery,
            useGetCoursesBySearchMutation,
            useGetCourseByIdMutation,
            useUpdateCourseMutation
            } = courseApi