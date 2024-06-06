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
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useGenerateJwtTokenForExpiredMutation } from "../api/accountApi";
import axios from "axios";
import { instructorApi } from "../api/instructorApi";
const errorLoggerMiddleware = (store) => (next) => (action) => {
    if (action && action.payload && action.payload.status) {
        console.error("API error:", action.payload);
        if (action.payload.status === 401) {
            const token = localStorage.getItem("token");
            if (token) {
                const refreshToken = localStorage.getItem("refreshToken");
                const useGenerateJwtToken = async () => {
                    try {
                        // Dispatch the action to refresh the token

                        const response = await axios.post("https://localhost:7042/api/User/Refresh-Token",{refreshToken})
                        if (!response.data.isSuccess) {
                            localStorage.removeItem("refreshToken");
                            localStorage.removeItem("token");
                            // Redirect to login page
                           
                        }
                        else {
                            localStorage.setItem("token",response.data.result.accessToken)
                        }
                    } catch (error) {
                        console.error("Error refreshing token:", error);
                        // Handle error
                    }
                };
                useGenerateJwtToken();
            }
            else {
                window.location.href = "/login";
            }
        }
    }
    return next(action);
};

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
        [instructorApi.reducerPath]:instructorApi.reducer,

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
            ,instructorApi.middleware
            ,errorLoggerMiddleware
            )
})

export default store