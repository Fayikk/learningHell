import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const bootcampScheduleApi = createApi({
    reducerPath:"bootcampScheduleApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"BootcampSchedule"
    }),
    endpoints:(builder) => ({
        createNewBootcampSchedule:builder.mutation({
            query:(bootcampScheduleModel) => ({
                url:"CreateBootcampSchedule",
                method:"POST",
                body:bootcampScheduleModel
            })
        }),
        updateBootcampSchedule:builder.mutation({
            query:(bootcampScheduleModel) => ({
                url:"UpdateBootcampSchedule",
                method:"PUT",
                body:bootcampScheduleModel
            })
        }),
        deleteBootcampSchedule:builder.mutation({
            query:(scheduleId) => ({
                url:`DeleteBootcampSchedule?scheduleId=${scheduleId}`,
                method:"DELETE",
            })
        }),
    })
})


export const {useCreateNewBootcampScheduleMutation,useUpdateBootcampScheduleMutation,useDeleteBootcampScheduleMutation} = bootcampScheduleApi