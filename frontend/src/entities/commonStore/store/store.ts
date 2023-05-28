import {configureStore} from "@reduxjs/toolkit";
import {apiBase} from "../api/apiBase";
import {lastObjectsReducer} from "../lastObjectsStore/slice";

export const store = configureStore({
    reducer: {
        [apiBase.reducerPath]: apiBase.reducer,
        lastObjects: lastObjectsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiBase.middleware),
    devTools: process.env.NODE_ENV !== 'production'
})