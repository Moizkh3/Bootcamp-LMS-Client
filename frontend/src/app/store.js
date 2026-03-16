import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authServiceApi';
import announcementReducer from '../features/announcement/announcementSlice';
import assignmentReducer from '../features/assignment/assignmentSlice';
import bootcampReducer from '../features/bootcamp/bootcampSlice';
import domainReducer from '../features/domain/domainSlice';
import { notificationApi } from '../features/notifications/notificationApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        announcement: announcementReducer,
        assignment: assignmentReducer,
        bootcamp: bootcampReducer,
        domain: domainReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware
        ),
});

