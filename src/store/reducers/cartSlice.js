import { createSlice } from "@reduxjs/toolkit";



export const InitialState = {
    cartCounter:0
}



export const cartSlice = createSlice({
    name:"cart",
    initialState:InitialState,
    reducers:{
        cartStateUpdate:(state,action) => {
            state.cartCounter = action.payload

            // if (action.payload.items.length !== 0) {
            //     state.cart = [...action.payload.items];
            // }
        }
        
       
    }
})

export const {cartStateUpdate} = cartSlice.actions
export const cartReducer = cartSlice.reducer