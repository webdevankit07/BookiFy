import { configureStore } from '@reduxjs/toolkit';
import firebaseSlice from './firebaseSlice';

const store = configureStore({
    reducer: {
        firebaseApp: firebaseSlice,
    },
});

export default store;
