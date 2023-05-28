import {getApiReqOptions} from "../utils/getApiReqOptions"
import {apiBase, URL_LEARN_DATA} from "./apiBase"
import {apiHandleErrorResponse} from "../utils/apiHandleErrorResponse";

const apiConfigueModel = apiBase.injectEndpoints({
    endpoints: (build => ({
        getLearnFields: build.query<any, void>({
            query: () => ({
                url: `${URL_LEARN_DATA}/learning_fields`,
                ...getApiReqOptions(),
            }),
            transformErrorResponse: apiHandleErrorResponse,
        }),
        uploadModel: build.mutation<any, any>({
            query: (data) => ({
                url: `${URL_LEARN_DATA}/upload`,
                body: data,
                ...getApiReqOptions(),
                method: 'POST',

            }),
            transformErrorResponse: apiHandleErrorResponse,
        }),
        learnModel: build.mutation<any, any>({
            query: ({fields, name}) => ({
                url: `${URL_LEARN_DATA}/learning_fields?fields=${fields}&model_name=${name}`,
                method: 'POST',
                ...getApiReqOptions(),
            }),
            transformErrorResponse: apiHandleErrorResponse,
        }),
    })),
    overrideExisting: false
})

export const {
    useUploadModelMutation,
    useGetLearnFieldsQuery,
    useLearnModelMutation
} = apiConfigueModel
