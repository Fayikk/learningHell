import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const freeContentApi = createApi({
    reducerPath: "freeContentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl + "FreeContent",
        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            const country = state.locationStore;

            const token = localStorage.getItem("token");
            token && headers.append("Authorization", "Bearer " + token)
            
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getAllFreeContent: builder.query({
            query: () => ({
                url: "",
                method: "GET"
            })
        }),
        getFreeContentById: builder.query({
            query: (id) => ({
                url: `${id}`,
                method: "GET"
            })
        }),
        getFreeContentByType: builder.query({
            query: (contentType) => ({
                url: `type/${contentType}`,
                method: "GET"
            })
        }),
        createFreeContent: builder.mutation({
            query: (contentData) => ({
                url: "",
                method: "POST",
                body: contentData,
                formData: true,
            })
        }),
        updateFreeContent: builder.mutation({
            query: ({ id, contentData }) => ({
                url: `${id}`,
                method: "PUT",
                body: contentData,
                formData: true,
            })
        }),
        deleteFreeContent: builder.mutation({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE"
            })
        }),
        submitContactForm: builder.mutation({
            query: (contactData) => ({
                url: "contact",
                method: "POST",
                body: contactData,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }),
        submitWebinarRegister: builder.mutation({
            query: (registerData) => ({
                url: "WebinarRegister",
                method: "POST",
                body: registerData,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        })
    })
})

export const {
    useGetAllFreeContentQuery,
    useGetFreeContentByIdQuery,
    useGetFreeContentByTypeQuery,
    useCreateFreeContentMutation,
    useUpdateFreeContentMutation,
    useDeleteFreeContentMutation,
    useSubmitContactFormMutation,
    useSubmitWebinarRegisterMutation
} = freeContentApi
