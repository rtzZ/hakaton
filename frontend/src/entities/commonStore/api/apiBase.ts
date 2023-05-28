import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


export const URL_LOAD_DATA = process.env.REACT_APP_URL_LOAD_DATA
export const URL_AUTH = process.env.REACT_APP_URL_AUTH
export const URL_LEARN_DATA = process.env.REACT_APP_URL_LEARN_DATA
export const URL_UPLOAD_DATA = process.env.REACT_APP_URL_UPLOAD_DATA

export const apiBase = createApi({
    baseQuery: fetchBaseQuery({baseUrl: ''}),
    endpoints: () =>   ({}),
    refetchOnMountOrArgChange: true,
})
