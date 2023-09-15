// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './CartSlice'; // Import your custom cart reducer
// Import other reducers if you have them

const rootReducer = combineReducers({
  cart: cartReducer, // Use your custom cart reducer here
  // Add other reducers here if needed
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;