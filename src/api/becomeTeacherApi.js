import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const becomeTeacherApi = createApi({
    reducerPath:"becomeTeacherApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"BecomeTeacher"
    }),
    endpoints:(builder) => ({
        applyCv:builder.mutation({
            query:(becomeTeacherModel) => ({
                method:"POST",
                body:becomeTeacherModel.formData
            })
        }),
        getInstructiveApplicants:builder.mutation({
            query:(instructiveModel) => ({
                method:"POST",
                body:instructiveModel,
                url:`GetInstructiveApplicants?pageNumber=${instructiveModel.filter.pageNumber}&pageSize=${instructiveModel.filter.pageSize}&filterProperty=${instructiveModel.filter.filterProperty}&filterValue=${instructiveModel.filter.filterValue}`
            })
        })
    })
})


export const {useApplyCvMutation,useGetInstructiveApplicantsMutation} = becomeTeacherApi