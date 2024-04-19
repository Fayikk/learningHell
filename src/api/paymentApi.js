import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"




export const paymentApi = createApi({
    reducerPath:"paymentApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Payment",
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
    }),
    endpoints:(builder) => ({
        paymentCheckout:builder.mutation({
            query:(paymentModel) => {
                return {
                    method:"POST",
                    body:paymentModel
                }
            }

        })
    })
})



export const {usePaymentCheckoutMutation} = paymentApi
