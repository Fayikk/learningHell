import { createSlice } from "@reduxjs/toolkit";



export const InitialState = {
    locationCountry:""
}



export const locationSlice = createSlice({
    name:"location",
    initialState:InitialState,
    reducers:{
        
        setLocationCountry:(state,action)=>{
            state.locationCountry = action.payload
        }
        
       
    }
})

export const {setLocationCountry} = locationSlice.actions
export const locationReducer = locationSlice.reducer