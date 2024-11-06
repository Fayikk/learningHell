import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"




export const studentCourseApi = createApi({
    reducerPath:"studentCourseApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"StudentsCourse",
        prepareHeaders:(headers,{getState}) => {
            const state = getState();
            const country = state.locationStore; 

            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token)
          
            return headers;
        }
    }),
    tagTypes:["studentCourse"],
    endpoints:(builder) => ({
        isCourseHaveStudent:builder.mutation({
            query:(studentModel) => ({
                method:"POST",
                body:studentModel
            }),
            invalidatesTags:["studentCourse"]
        }),
        thisCourseEnrolledUser:builder.mutation({
            query:(model) => {
                return {
                    method:"POST", 
                    url:`IsEnrolledCourse`,
                    body:model
                }
            },
            invalidatesTags:["studentCourse"]
            
        }),
        getStudentCoursesBySearch:builder.mutation({
            query:(value)=>({
                method:"POST",
                url:`${value}`
            }),
            providesTags:["studentCourse"]

        }),
        giftCourse:builder.mutation({
            query:(giftCourseModel) => ({
                method:"POST",
                url:'/FreeCourse',
                body:giftCourseModel
            }),
            invalidatesTags:["studentCourse"]

        })
    })
})

export const {useIsCourseHaveStudentMutation,useGiftCourseMutation,useThisCourseEnrolledUserMutation,useGetStudentCoursesBySearchMutation} = studentCourseApi