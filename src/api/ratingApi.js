import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"


export const ratingApi = createApi({
    reducerPath:"ratingApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"rating",
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
    }),
    tagTypes:["rating"],
    endpoints:(builder) => ({
      applyRate:builder.mutation({
        query:(rateModel)=>({
            url:"ApplyRate",
            body:rateModel,
            method:"POST"
        }),
        invalidatesTags:["rating"]
      }),
      checkRating:builder.query({
        query:(courseId)=>({
          url:`/CheckRating/${courseId}`,
          method:"GET",
        }),
        providesTags:["rating"]
      })
    })
})


export const {useApplyRateMutation,useCheckRatingQuery} = ratingApi
