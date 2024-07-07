import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"


export const commentApi = createApi({
    reducerPath:"commentApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"Comment",
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
    }),
    tagTypes:["comment"],
    endpoints:(builder) => ({
        doComment : builder.mutation({
            query:(commentModel)=>({
                method:"POST",
                body:commentModel
            }),
            invalidatesTags:["comment"]
        }),
        getComment:builder.mutation({
            query:(getCommentModel) => ({
                method:"POST",
                body:getCommentModel,
                url:"GetComments"
            }),
            providesTags:["comment"]
        })
    })
})



export const {useDoCommentMutation,useGetCommentMutation} = commentApi
