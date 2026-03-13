import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    domains: [],
    loading: false,
    error: null,
};

const domainSlice = createSlice({
    name: 'domain',
    initialState,
    reducers: {
        setDomains: (state, action) => {
            state.domains = action.payload;
        },
    },
});

export const { setDomains } = domainSlice.actions;
export default domainSlice.reducer;
