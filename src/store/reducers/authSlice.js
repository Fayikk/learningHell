import { createSlice } from "@reduxjs/toolkit";


export const InitialState  = {
    name:"",
    userName:"",
    nameIdentifier:"",
    role:"",
    email:"",
    InstructorSubId:"",
}


export const authSlice = createSlice({
    name:"authentication",
    initialState:InitialState,
    reducers:{
        setLoggedInUser:(state,action) => {
            console.log("trigger action payload",action)
            state.email = action.payload.email;
            state.name=action.payload.name;
            state.nameIdentifier = action.payload.nameIdentifier;
            state.role=action.payload.role;
            state.userName=action.payload.userName
            state.InstructorSubId=action.payload.InstructorSubId
        }
    }
})



export const {setLoggedInUser} = authSlice.actions
export const authenticationReducer = authSlice.reducer