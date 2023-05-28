import {getApiReqOptions} from "../utils/getApiReqOptions"
import {apiBase, URL_UPLOAD_DATA} from "./apiBase"
import {apiHandleErrorResponse} from "../utils/apiHandleErrorResponse";

const apiUploadData = apiBase.injectEndpoints({
    endpoints: (build => ({
        uploadData: build.mutation<any, any>({
            query: (data) => ({
                url: `${URL_UPLOAD_DATA}/upload`,
                body: data,
                ...getApiReqOptions(),
                method: 'POST',

            }),
            transformErrorResponse: apiHandleErrorResponse,
        }),
        getStatusUpload: build.query<any, any>({
            query: () => ({
                url: `${URL_UPLOAD_DATA}/upload_log`,
                ...getApiReqOptions(),
            }),
            transformErrorResponse: apiHandleErrorResponse,
        }),
    })),
    overrideExisting: false
})

export const {
    useUploadDataMutation,
    useGetStatusUploadQuery,
} = apiUploadData
