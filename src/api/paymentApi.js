import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"




export const paymentApi = createApi({
    reducerPath:"paymentApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Payment",
        credentials:'include',
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
    }),
    // https://localhost:7042/api/Payment/PayCallBack
    endpoints:(builder) => ({
        paymentCheckout:builder.mutation({
            query:(sendData) => {
                return {
                    method:"POST",
                    body:sendData.paymentModel,
                    url:`?isActive3dSecure=${sendData.isActive3dSecure}`
                }
            }

        }),
        paymentBootcampCheckout:builder.mutation({
            query:(sendData) => {
                return {
                    method:"POST",
                    body:sendData.paymentModel,
                    url:`PayBootcamp?isActive3dSecure=${sendData.isActive3dSecure}`
                }
            }

        }),
        payCallBack:builder.mutation({
            query:()=>{
                return {
                    method:"POST",
                    url:'/PayCallBack'
                }
            }
        })
    })
})



export const {usePaymentCheckoutMutation,usePaymentBootcampCheckoutMutation} = paymentApi