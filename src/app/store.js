import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from '../features/auth/authSlice'
import { authApi } from '../features/auth/authApi'

// Persist only the refresh token + user; the access token stays in memory.
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['refreshToken', 'user']
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  [authApi.reducerPath]: authApi.reducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(authApi.middleware)
})

export const persistor = persistStore(store)
