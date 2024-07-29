import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import storage from 'redux-persist/lib/storage'
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

const persistConfig = {
    timeout: 1000,
    key: 'root',
    version: 1,
    storage,
}

// const reducer = combineReducers({
//     user: userSlice.reducer,
// })

const persistedUserReducer = persistReducer(persistConfig, userSlice.reducer)

export const store = configureStore({
    reducer: { userReducer: persistedUserReducer },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})
