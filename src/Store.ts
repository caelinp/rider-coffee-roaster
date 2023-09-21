import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './CartSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage';

// Import other reducers if you have them
// import otherReducer from './otherReducer';

// Combine your reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  // Add other reducers here if needed
  // other: otherReducer,
});

// Configure Redux Persist
const persistConfig = {
  key: 'root', // Key for the stored data (change as needed)
  storage, // Use localStorage as the storage engine
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Create a persistor object
const persistor = persistStore(store);

export { store, persistor };
