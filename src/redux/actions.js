export const addOutput = (output) => ({
    type: 'ADD_OUTPUT',
    payload: output,
});

export const clearOutput = () => ({
    type: 'CLEAR_OUTPUT',
});

export const setModern = (isModern) => ({
    type: 'SET_MODERN',
    payload: isModern,
});