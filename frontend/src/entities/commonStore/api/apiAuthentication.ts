import {apiHandleErrorResponse} from "../utils/apiHandleErrorResponse"
import {apiBase, URL_AUTH} from "./apiBase"

const apiAuthentication = apiBase.injectEndpoints({
    endpoints: (build => ({
        login: build.mutation<any, any>({
            query: (data) => ({
                url: `${URL_AUTH}/sign-in?token=true`,
                method: 'POST',
                credentials: "include",
                headers: {
                    'Authorization': `Basic ${data}`
                }
            }),
            transformResponse: (response: any) => response.token,
            transformErrorResponse: apiHandleErrorResponse
        }),
        registration: build.mutation<any, any>({
            query: (data) => ({
                url: `${URL_AUTH}/sign-up`,
                method: 'POST',
                body: JSON.stringify(data),
                credentials: "include",
                headers: {
                    'content-type': "application/json",
                    "accept": "application/json"
                }
            }),
            transformErrorResponse: apiHandleErrorResponse
        }),
    }))
})

export const {
    useLoginMutation,
    useRegistrationMutation
} = apiAuthentication
