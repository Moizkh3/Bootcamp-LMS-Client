import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authServiceApi';
import announcementReducer from '../features/announcement/announcementSlice';
import assignmentReducer from '../features/assignment/assignmentSlice';
import bootcampReducer from '../features/bootcamp/bootcampSlice';
import domainReducer from '../features/domain/domainSlice';
import { adminApi } from '../features/admin/adminApi';
import { domainApi } from '../features/domain/domainApi';
import { bootcampApi } from '../features/bootcamp/bootcampApi';
import { userApi } from '../features/user/userApi';
import { submissionApi } from '../features/submission/submissionApi';
import { progressApi } from '../features/progress/progressApi';
import { teacherApi } from '../features/teacher/teacherApi';
import { studentApi } from '../features/student/studentApi';
import { notificationApi } from '../features/notifications/notificationApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [domainApi.reducerPath]: domainApi.reducer,
        [bootcampApi.reducerPath]: bootcampApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [submissionApi.reducerPath]: submissionApi.reducer,
        [progressApi.reducerPath]: progressApi.reducer,
        [teacherApi.reducerPath]: teacherApi.reducer,
        [studentApi.reducerPath]: studentApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        announcement: announcementReducer,
        assignment: assignmentReducer,
        bootcamp: bootcampReducer,
        domain: domainReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            adminApi.middleware,
            domainApi.middleware,
            bootcampApi.middleware,
            userApi.middleware,
            submissionApi.middleware,
            progressApi.middleware,
            teacherApi.middleware,
            studentApi.middleware,
            notificationApi.middleware
        ),
});

