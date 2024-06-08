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
            })
        }),
        getCourseIntroductionVideos:builder.query({
            query:()=> ({
                url:`GetCourseIntroductionVideos`,
                method:"GET"
            })
        }),
        getAllCourses:builder.mutation({
            query:(model)=>   {
                return ({
                    url:`GetAllCourses?pageNumber=${model.pageNumber}&pageSize=${model.pageSize}&filterProperty=${model.filterProperty}&filterValue=${model.filterValue}`,
                    method:"POST"
                })
            }
        }),
        createCourseAsync:builder.mutation({
            query:(courseModel) => ({
                method:"POST",
                body:courseModel
            })
        })
    })
})


export const {useGetCourseDetailByIdQuery,useGetSectionsByCourseIdQuery,useGetCourseIntroductionVideosQuery,useGetAllCoursesMutation,useCreateCourseAsyncMutation} = courseApi