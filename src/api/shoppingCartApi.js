import { fetchBaseQuery,createApi } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./Base/baseApiModel"




export const shoppingCartApi = createApi({
    reducerPath:"shoppingCartApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"ShoppingCart",
        credentials:'include',
        prepareHeaders:(headers,api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization","Bearer "+token);
        }
    }),
    tagTypes:["shoppingCart"],
    endpoints:(builder) => ({
        getShoppingCart:builder.query({
            query:() => ({
                url:`GetShoppingCart`,
                method:"GET"
            }),
            providesTags:["shoppingCart"]
        }),
        addShoppingCartItem:builder.mutation({
            query:(shoppingCartModel) => 
            {
                return {
                    method:"POST",
                body:shoppingCartModel
                }
            },
            invalidatesTags:["shoppingCart"]
        }),
        removeShoppingCartItem:builder.mutation({
            query:(shoppingCartId) => {
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