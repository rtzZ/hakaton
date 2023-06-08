import {createSlice} from "@reduxjs/toolkit";

const NAME = 'lastObjects'

const initialState = {
    objects: [],
    file_id: null,
    resultView: 'table',
}

const setObjects = (state, action) => {
    state.objects = action.payload;
}

const setFileId = (state, action) => {
    state.file_id = action.payload
}

const setResultView = (state, action) => {
    state.resultView = action.payload
}

export const {reducer: lastObjectsReducer, actions: lastObjectsActions} = createSlice(
    {
        name: NAME,
        initialState: initialState,
        reducers: {
            setObjects,
            setFileId,
            setResultView
        }
    }
)