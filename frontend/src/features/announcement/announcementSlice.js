import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    announcements: [],
    loading: false,
    error: null,
};

const announcementSlice = createSlice({
    name: 'announcement',
    initialState,
    reducers: {
        setAnnouncements: (state, action) => {
            state.announcements = action.payload;
        },
    },
});

export const { setAnnouncements } = announcementSlice.actions;
export default announcementSlice.reducer;
