export const lastObjectSelector = (state) => state.lastObjects;

export const objectsSelector = (state) => lastObjectSelector(state).objects