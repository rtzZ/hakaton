import {apiHandleErrorResponse} from "../utils/apiHandleErrorResponse"
import {getApiReqOptions} from "../utils/getApiReqOptions"
import {apiBase, URL_LOAD_DATA} from "./apiBase"

const getQuery = (queries: { [x: string]: any }) => {
    const queriesStr = Object.entries(queries)
        .filter(([filter, value]) => {
            if (filter === 'stage_count' && typeof value !== 'string') {
                return true
            }

            return value
        })
        .map(([filter, value]) => `${filter}=${value}&`)

    return queriesStr.join('').slice(0, -1)
}

const apiRecommendation = apiBase.injectEndpoints({
    endpoints: (build => ({
        getObjectInfo: build.query<any, any>({
            query: (id) => ({
                url: `${URL_LOAD_DATA}/buildings?build_id=${id}`,
                ...getApiReqOptions(),
            }),
            transformResponse: (response: any) => response.buildings[0].build,
            transformErrorResponse: apiHandleErrorResponse,
        }),
        getObjectRecommendations: build.query<any, any>({
            query: (id: string) => ({
                url: `${URL_LOAD_DATA}/recommendation?building_ids=${id}`,
                ...getApiReqOptions(),
            }),
            transformErrorResponse: apiHandleErrorResponse,
        }),
        getAddress: build.query<any, void>({
            query: () => ({
                url: `${URL_LOAD_DATA}/adresses`,
                ...getApiReqOptions(),
            }),
            transformResponse: (response: any) => response,
            transformErrorResponse: apiHandleErrorResponse,
        }),
        getAllObjects: build.query<any, any>({
            query: (queries) => ({
                url: `${URL_LOAD_DATA}/buildings?${getQuery(queries)}`,
                ...getApiReqOptions(),
            }),
            transformResponse: (response: any) => response,
            transformErrorResponse: apiHandleErrorResponse,
        }),
        getLearningModels: build.query<any, void>({
            query: () => ({
                url: `${URL_LOAD_DATA}/learning_models`,
                ...getApiReqOptions(),
            }),
            transformErrorResponse: apiHandleErrorResponse,
        }),
        setLearningModels: build.mutation<any, string>({
            query: (id) => ({
                url: `${URL_LOAD_DATA}/learning_models?id=${id}`,
                method: 'POST',
                ...getApiReqOptions(),
            }),
            transformErrorResponse: apiHandleErrorResponse,
        }),
    })),
    overrideExisting: false
})

export const {
    useGetObjectInfoQuery,
    useGetAddressQuery,
    useGetAllObjectsQuery,
    useGetObjectRecommendationsQuery,
    useGetLearningModelsQuery,
    useSetLearningModelsMutation,
} = apiRecommendation
