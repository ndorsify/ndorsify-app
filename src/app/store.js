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
import { campaignApi } from '../features/campaigns/campaignApi'
import { discoveryApi } from '../features/discovery/discoveryApi'
import { messagingApi } from '../features/messaging/messagingApi'
import { onboardingApi } from '../features/onboarding/onboardingApi'
import { profileApi } from '../features/profile/profileApi'

// Persist only the refresh token + user; the access token stays in memory.
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['refreshToken', 'user']
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  [authApi.reducerPath]: authApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [onboardingApi.reducerPath]: onboardingApi.reducer,
  [discoveryApi.reducerPath]: discoveryApi.reducer,
  [messagingApi.reducerPath]: messagingApi.reducer,
  [campaignApi.reducerPath]: campaignApi.reducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(
      authApi.middleware,
      profileApi.middleware,
      onboardingApi.middleware,
      discoveryApi.middleware,
      messagingApi.middleware,
      campaignApi.middleware
    )
})

export const persistor = persistStore(store)
