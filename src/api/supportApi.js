import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {baseUrl} from './Base/baseApiModel'


export const supportApi = createApi({
    reducerPath:"supportApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Support"
    }),

    endpoints:(builder) => ({
       createSupportTicket:builder.mutation(({
            query:(ticketModel) => ({
                method:"POST",
                body:ticketModel,
                
            })
       }))
    })
})


export const {useCreateSupportTicketMutation} = supportApi