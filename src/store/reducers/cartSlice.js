import { createSlice } from "@reduxjs/toolkit";



export const InitialState = {
    cartCounter:0
}



export const cartSlice = createSlice({
    name:"cart",
    initialState:InitialState,
    reducers:{
        cartStateUpdate:(state,action) => {
            console.log(action)
            state.cartCounter = action.payload
            console.log("trigger - infinity")

            console.log(state.cartCounter)
            // if (action.payload.items.length !== 0) {
            //     state.cart = [...action.payload.items];
            //     console.log("trigger cartSlice")
            //     console.log(state)
            // }
        }
        
       
    }
})

export const {cartStateUpdate} = cartSlice.actions
export const cartReducer = cartSlice.reducer