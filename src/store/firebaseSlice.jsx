import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDg1WYrraqfqpPPgW1uf8mcXeEfpY99kng',
    authDomain: 'bookify-83013.firebaseapp.com',
    projectId: 'bookify-83013',
    storageBucket: 'bookify-83013.appspot.com',
    messagingSenderId: '977868520869',
    appId: '1:977868520869:web:f5ca7026e03ad0e50e3c4c',
};

//! instance...
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

//! Get Image Url..
export const getImageUrl = createAsyncThunk('getImageUrl', async (path, { rejectWithValue }) => {
    try {
        const url = await getDownloadURL(ref(storage, path));
        return url;
    } catch (e) {
        return rejectWithValue(e);
    }
});
//

const fireBaseSLice = createSlice({
    name: 'firebaseSLice',
    initialState: {
        login: false,
        loading: false,
        error: null,
        userName: 'BookiFy',
        userEmail: null,
        userId: null,
        userPhotoURL: null,
        booksIDs: null,
        allOrders: [],
        searchItem: '',
        pageLocation: '',
    },

    reducers: {
        isLoggedIn: (state, { payload }) => {
            state.login = payload;
        },
        userData: (state, { payload }) => {
            state.userName = payload.name;
            state.userEmail = payload.email;
            state.userId = payload.userId;
            state.userPhotoURL = payload.photoURL;
        },
        booksIDs_collections: (state, { payload }) => {
            state.booksIDs = payload;
        },
        cleanOrders: (state) => {
            state.allOrders = [];
        },
        setOrders: (state, { payload }) => {
            state.allOrders.push(payload);
        },
        signUpUserWithEmailPassword: (state, { payload }) => {
            createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
        },
        signInUserWithEmailPassword: (state, { payload }) => {
            signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
        },
        signInWithGoogle: () => {
            signInWithPopup(firebaseAuth, googleProvider);
        },
        setSearchItem: (state, { payload }) => {
            state.searchItem = payload;
        },
        cleanSearchText: (state) => {
            state.searchItem = '';
        },
        setPageLocation: (state, { payload }) => {
            state.pageLocation = payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getImageUrl.pending, (state) => {
                state.loading = true;
            })
            .addCase(getImageUrl.fulfilled, (state, { payload }) => {
                state.imageUrl = payload;
                state.loading = false;
            })
            .addCase(getImageUrl.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export default fireBaseSLice.reducer;
export const {
    isLoggedIn,
    userData,
    booksIDs_collections,
    setOrders,
    cleanOrders,
    signUpUserWithEmailPassword,
    signInUserWithEmailPassword,
    signInWithGoogle,
    setSearchItem,
    cleanSearchText,
    setPageLocation,
} = fireBaseSLice.actions;
export { firebaseApp, firebaseAuth, googleProvider, firestore, storage };
