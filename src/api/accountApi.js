import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {baseUrl} from './Base/baseApiModel'

export const accountApi = createApi({
    reducerPath:"accountApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"User"
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
        })
    })
})


export const {useSignInMutation,useSignInWithGoogleMutation,useSignUpMutation,useGetUserDetailsQuery} = accountApi