import { createSlice } from "@reduxjs/toolkit";



export const InitialState = {
    cart:[]
}



export const cartSlice = createSlice({
    name:"cart",
    initialState:InitialState,
    reducers:{
        cartStateUpdate:(state,action) => {
            if (action.payload.items.length !== 0) {
                state.cart = [...action.payload.items];
                
            }
        }
        
       
    }
})

export const {cartStateUpdate} = cartSlice.actions
export const cartReducer = cartSlice.reducer