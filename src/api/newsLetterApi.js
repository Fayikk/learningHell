import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {baseUrl} from './Base/baseApiModel'


export const newsLetterApi = createApi({
    reducerPath:"newsLetterApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"NewsLetter"
    }),

    endpoints:(builder) => ({
        registerNewsLetter:builder.mutation({
            query:(newsLetter) => ({
                method:"POST",
                body:newsLetter
            })
        })
    })
})


export const {useRegisterNewsLetterMutation} = newsLetterApi