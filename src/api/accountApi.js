import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {baseUrl} from './Base/baseApiModel'

export const accountApi = createApi({
    reducerPath:"accountApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"User",
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
    }),

    endpoints:(builder) => ({
        signUp:builder.mutation({
            query:(registerModel) => ({
                url:"Register",
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:registerModel
            })
        }),
        signInWithGoogle:builder.mutation({
            query:(credentialModel) => ({
                url:"Google-Auth",
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:credentialModel
            })
        }),
        generateJwtTokenForExpired:builder.mutation({
            query:(refreshToken) => ({
                url:"Refresh-Token",
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:refreshToken
            })
        }),
        signIn:builder.mutation({
            query:(loginModel) => ({
                url:"Login",
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:loginModel
            })
        }),
        getUserDetails:builder.query({
            query:(userId) => ({
                
                url:`GetUserDetail?userId=${userId}`
            })
        }),
        makeInstructiveUser:builder.mutation({
            query:(decisionModel) => ({
                url:`DecisionInstructor/${decisionModel.userId}`,
                method:"POST",
                body:decisionModel.decisionModel
            })
        })
        // https://localhost:7042/api/User/DecisionInstructor/5092d7bf-910b-48c5-ab20-6454765fc37e

    })
})


export const {
        useSignInMutation,
        useGenerateJwtTokenForExpiredMutation,
        useSignInWithGoogleMutation,
        useSignUpMutation,
        useGetUserDetailsQuery,
        useMakeInstructiveUserMutation} = accountApi