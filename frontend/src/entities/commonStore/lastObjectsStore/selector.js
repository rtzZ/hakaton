export const lastObjectSelector = (state) => state.lastObjects;

export const objectsSelector = (state) => lastObjectSelector(state).objects

export const fileIdSelector = (state) => lastObjectSelector(state).file_id

export const resultViewSelector = (state) => lastObjectSelector(state).resultView