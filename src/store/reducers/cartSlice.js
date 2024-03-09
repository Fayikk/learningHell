import { createSlice } from "@reduxjs/toolkit";



export const InitialState = {
    cartItem : {
        courseId:"",
        courseName:"",
        coursePrice:"",
    },
    cart:[]
}



export const cartSlice = createSlice({
    name:"cart",
    initialState:InitialState,
    reducer:{
        incrementCart:(state,action) => {

            console.log("trigger increment cart")

            state.cartItem.courseId = action.payload.courseId;
            state.cartItem.courseName = action.payload.courseName;
            state.cartItem.coursePrice = action.payload.coursePrice;
            
           const result = state.cart.find(x=>x.cartItem.courseId === action.payload.courseId)
            if (result.Length <= 0) {
                    state.cart.push(state.cartItem)            
            }

        },
        decrement_cart:(state,action) =>  {

        },
        remove_from_cart:(state,action) => {
            
        }
    }
})

export const {incrementCart,decrement_cart,remove_from_cart} = cartSlice.actions
export const cartReducer = cartSlice.reducer