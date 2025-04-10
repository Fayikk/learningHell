import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./Base/baseApiModel";

export const bootcampTopicApi = createApi({
    reducerPath:"bootcampTopicApi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseUrl+"BootcampTopic"
    }),
    endpoints:(builder) => ({
       createNewBootcampTopic:builder.mutation({
            query:(bootcampTopicModel) => ({
                url:"CreateBootcampTopic",
                method:"POST",
                body:bootcampTopicModel
            })
        }),
        updateBootcampTopic:builder.mutation({
            query:(bootcampTopicModel) => ({
                url:"UpdateBootcampTopic",
                method:"PUT",
                body:bootcampTopicModel
            })
        }),
        deleteBootcampTopic:builder.mutation({
            query:(topicId) => ({
                url:`DeleteBootcampTopic?topicId=${topicId}`,
                method:"DELETE",
            })
        }),
        getAllBootcampTopics:builder.mutation({
            query:(bootcampTopicModel) => ({
                url:`GetAllBootcampTopics`,
                method:"POST",
                body:bootcampTopicModel
            })
        }),
    })
})


export const {useCreateNewBootcampTopicMutation,useUpdateBootcampTopicMutation,useDeleteBootcampTopicMutation,useGetAllBootcampTopicsMutation} = bootcampTopicApi