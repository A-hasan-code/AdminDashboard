// store.js
import { configureStore } from '@reduxjs/toolkit';
import materialTailwindReducer from '@/Redux/slices/materialTailwindSlice';
import userReducer from '@/Redux/slices/User.Slice'
import authReducer from '@/Redux/slices/authslices'
const store = configureStore({
    reducer: {
        materialTailwind: materialTailwindReducer,
        user: userReducer,
        auth: authReducer
    },
});

export default store;
