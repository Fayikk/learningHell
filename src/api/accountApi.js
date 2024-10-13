import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {baseUrl} from './Base/baseApiModel'
import ForgotPassword from "../main-component/ForgotPassword";

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
        }),
        verifyEmail:builder.mutation({
            query:(verificationModel) => ({
                url:`${verificationModel.verificationCode.slug}?emailAddress=${verificationModel.emailAddress}`,
                method:"POST"
            })
        }),
        reSendVerifyEmail:builder.mutation({
            query:(emailAddress) => ({
                url:`ReSendVerifyEmail?emailAddress=${emailAddress}`,
                method:"POST"
            })
        }),
        ForgotPassword:builder.mutation({
            query:(emailAddress) => ({
                url:`ForgotPassword?email=${emailAddress}`,
                method:"POST"
            })
        }),
        checkVerificationDigitCode:builder.mutation({
            query:(digitBody)=>({
                method:"POST",
                url:`CheckVerificationMailCode?email=${digitBody.email}&digitCode=${digitBody.digitCode}`
            })
        }),
        changePassword:builder.mutation({
            query:(changePasswordModel) => ({
                method:"POST",
                url:"ChangePassword",
                body:changePasswordModel
            })
        }),
        chechBankInformation:builder.mutation({
            query:(userId) => {
                return(

                   {
                        method:"POST",
                        url:`CheckInfo/${userId}`,
                    }
                )
            }
        })

    })
})

export const {
        useSignInMutation,
        useGenerateJwtTokenForExpiredMutation,
        useSignInWithGoogleMutation,
        useSignUpMutation,
        useGetUserDetailsQuery,
        useMakeInstructiveUserMutation,
        useVerifyEmailMutation,
        useReSendVerifyEmailMutation,
        useForgotPasswordMutation,
        useCheckVerificationDigitCodeMutation,
        useChechBankInformationMutation,
        useChangePasswordMutation} = accountApi