import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"




export const studentCourseApi = createApi({
    reducerPath:"studentCourseApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"StudentsCourse"
    }),
    endpoints:(builder) => ({
        isCourseHaveStudent:builder.mutation({
            query:(studentId) => ({
                url:`?userId=${studentId}`,
                method:"POST"
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