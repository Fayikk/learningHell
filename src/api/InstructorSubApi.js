


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const instructorSubApi = createApi({
    reducerPath:"instructorSubApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"InstructorSub",
        prepareHeaders:(headers,{getState}) => {

            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token)
          
            return headers;
        }
    }),
// https://localhost:7042/api/InstructorSub/CreateInstructor

    endpoints:(builder) => ({
        addBankInfo:builder.mutation({
            query:(bankInfoModel)=>({
                url:`CreateInstructor`,
                method:"POST",
                body:bankInfoModel 
            })
        })
    })
})
export const {useAddBankInfoMutation} = instructorSubApi