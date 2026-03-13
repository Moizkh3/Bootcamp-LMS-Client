import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bootcamps: [],
    loading: false,
    error: null,
};

const bootcampSlice = createSlice({
    name: 'bootcamp',
    initialState,
    reducers: {
        setBootcamps: (state, action) => {
            state.bootcamps = action.payload;
        },
    },
});

export const { setBootcamps } = bootcampSlice.actions;
export default bootcampSlice.reducer;
