import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './CartSlice';
import { persistStore, persistReducer } from 'redux-persist';
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

// Create the Redux store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  // Add middleware or enhancers here if needed
});

// Create a persistor object
const persistor = persistStore(store);

export { store, persistor };
