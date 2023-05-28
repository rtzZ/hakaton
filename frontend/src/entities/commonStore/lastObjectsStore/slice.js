import {createSlice} from "@reduxjs/toolkit";

const NAME = 'lastObjects'

const initialState = {
    objects: []
}

const setObjects = (state, action) => {
    state.objects = action.payload;
}

export const {reducer: lastObjectsReducer, actions: lastObjectsActions} = createSlice(
    {
        name: NAME,
        initialState: initialState,
        reducers: {
            setObjects
        }
    }
)