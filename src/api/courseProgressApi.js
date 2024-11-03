import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const courseProgressApi = createApi({
    reducerPath:"courseProgressApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"CourseProgress",
        prepareHeaders:(headers,{getState}) => {
            const state = getState();
            const country = state.locationStore; 

            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token)
          
            return headers;
        }
    }),
    endpoints:(builder) => ({
      getCourseProgresses:builder.mutation({
        query:(model) => {
            return ({
                url:'/GetCourseProgress',
                method:"POST",
                body:model
            })
        }
      }),
      CreateCourseProgress:builder.mutation({
        query:(model) => {
            return ({
                method:"POST",
                body:model
            })
        }
      }),
      UpdateCourseProgress:builder.mutation({
        query:(model) => {
            return({
                method:"PUT",
                body:model
            })
        }
      }),
      checkAppropriateCertificate:builder.mutation({
        query:(model)=>{
            return ({
                url:"/CheckCertificate",
                method:"POST",
                body:model
            })
        }
      }),
      checkAppropriateCertificate:builder.mutation({
        query:(model)=>{
            return ({
                url:"/CheckCertificate",
                method:"POST",
                body:model
            })
        }
      }),
      downloadCertificate:builder.mutation({
        query:(model)=>{
            return ({
                url:"/download-certificate",
                method:"POST",
                body:model
            })
        }
      })
    })
})

export const {useGetCourseProgressesMutation,useDownloadCertificateMutation,useCheckAppropriateCertificateMutation,useCreateCourseProgressMutation,useUpdateCourseProgressMutation} = courseProgressApi

