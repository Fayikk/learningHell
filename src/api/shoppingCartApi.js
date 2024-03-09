import { fetchBaseQuery,createApi } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"




export const shoppingCartApi = createApi({
    reducerPath:"shoppingCartApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"ShoppingCart",
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
            console.log(token)
            console.log("prepare headers")
        }
    }),
    tagTypes:["shoppingCart"],
    endpoints:(builder) => ({
        getShoppingCart:builder.query({
            query:(userId) => ({
                url:`GetShoppingCart?userId=${userId}`,
                method:"GET"
            }),
            providesTags:["shoppingCart"]
        }),
        addShoppingCartItem:builder.mutation({
            query:(shoppingCartModel) => ({
                method:"POST",
                body:shoppingCartModel
            }),
            invalidatesTags:["shoppingCart"]
        }),
        removeShoppingCartItem:builder.mutation({
            query:(shoppingCartId) => {
                console.log(shoppingCartId)
                return {
                    method:"POST",
                    url:`RemoveCartItem/${shoppingCartId}`
                }


            },
            invalidatesTags:["shoppingCart"]

        })
    })
})




export const {useGetShoppingCartQuery,useAddShoppingCartItemMutation,useRemoveShoppingCartItemMutation} = shoppingCartApi