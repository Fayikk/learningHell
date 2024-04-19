import { configureStore } from "@reduxjs/toolkit";
import { authenticationReducer } from "./reducers/authSlice";
import {accountApi} from "../api/accountApi"
import { categoryApi } from "../api/categoryApi";
import { courseApi } from "../api/courseApi";
import { sectionApi } from "../api/sectionApi";
import { studentCourseApi } from "../api/studentCourseApi";
import { cartReducer } from "./reducers/cartSlice";
import { shoppingCartApi } from "../api/shoppingCartApi";
import { paymentApi } from "../api/paymentApi";
import { videoApi } from "../api/videoApi";

const store = configureStore({
    reducer:{

        authStore:authenticationReducer,
        cartStore:cartReducer,
       
        [accountApi.reducerPath]:accountApi.reducer,
        [categoryApi.reducerPath]:categoryApi.reducer,
        [courseApi.reducerPath]:courseApi.reducer,
        [sectionApi.reducerPath]:sectionApi.reducer,
        [studentCourseApi.reducerPath]:studentCourseApi.reducer,
        [shoppingCartApi.reducerPath]:shoppingCartApi.reducer,
        [paymentApi.reducerPath]:paymentApi.reducer,
        [videoApi.reducerPath]:videoApi.reducer,

    },middleware:(getDefaultMiddleware) => getDefaultMiddleware()
        .concat(
            accountApi.middleware
            ,categoryApi.middleware
            ,courseApi.middleware
            ,sectionApi.middleware
            ,studentCourseApi.middleware
            ,shoppingCartApi.middleware
            ,paymentApi.middleware
            ,videoApi.middleware
            )
})

export default store