import { configureStore } from "@reduxjs/toolkit";
import { authenticationReducer } from "./reducers/authSlice";
import {accountApi} from "../api/accountApi"
import { categoryApi } from "../api/categoryApi";

const store = configureStore({
    reducer:{

        authStore:authenticationReducer,
       
        [accountApi.reducerPath]:accountApi.reducer,
        [categoryApi.reducerPath]:categoryApi.reducer,

    },middleware:(getDefaultMiddleware) => getDefaultMiddleware()
        .concat(
            accountApi.middleware,categoryApi.middleware
            )
})

export default store