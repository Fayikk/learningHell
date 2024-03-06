import { createSlice } from "@reduxjs/toolkit";


export const InitialState  = {
    name:"",
    userName:"",
    nameIdentifier:"",
    role:"",
    email:"",
}

export const authSlice = createSlice({
    name:"authentication",
    initialState:InitialState,
    reducers:{
        setLoggedInUser:(state,action) => {
            state.email = action.payload.email;
            state.name=action.payload.name;
            state.nameIdentifier = action.payload.nameIdentifier;
            state.role=action.payload.role;
            state.userName=action.payload.userName
        }
    }
})



export const {setLoggedInUser} = authSlice.actions
export const authenticationReducer = authSlice.reducer