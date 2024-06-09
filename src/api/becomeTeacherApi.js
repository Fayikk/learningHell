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
        })
    })
})


export const {useApplyCvMutation} = becomeTeacherApi