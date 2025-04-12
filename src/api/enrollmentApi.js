// https://localhost:7042/api/Enrollment/GetBootcampsByUser

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const enrollmentApi = createApi({
    reducerPath:"enrollmentApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Enrollment",
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
    }),
    endpoints:(builder) => ({
        getEnrollmentsBootcampsByUser:builder.query({
            query:() => ({
                url:`GetBootcampsByUser`,
                method:"GET"
            })
        }),
    })
})

export const {useGetEnrollmentsBootcampsByUserQuery} = enrollmentApi