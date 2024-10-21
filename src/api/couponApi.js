import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

// https://localhost:7042/api/Coupon/GetCoupon/deneme



export const couponApi = createApi({
    reducerPath:"couponApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Coupon",
        prepareHeaders:(headers,{getState}) => {
          const state = getState();
          const country = state.locationStore; 

          const token = localStorage.getItem("token");
          token && headers.append("Authorization","Bearer "+token)
        
          return headers;
      }
    }),
    endpoints:(builder) => ({
        getCouponByCode:builder.mutation({
          query:(code)=>({
            url:`/GetCoupon/${code}`,
            method:"POST",

          })
        })
        
    })
})
// getUsers: builder.query({
//     query: (user) => `users/${user}`
// }),

export const {useGetCouponByCodeMutation} = couponApi