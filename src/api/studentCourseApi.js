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
    endpoints:(builder) => ({
        isCourseHaveStudent:builder.mutation({
            query:(studentModel) => ({
                method:"POST",
                body:studentModel
            })
        }),
        thisCourseEnrolledUser:builder.mutation({
            query:(model) => {
                return {
                    method:"POST", 
                    url:`IsEnrolledCourse`,
                    body:model
                }
            }
        })
    })
})

export const {useIsCourseHaveStudentMutation,useThisCourseEnrolledUserMutation} = studentCourseApi