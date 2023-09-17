// CartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect'; // Import createSelector
import CoffeeBagOrderItem from './OrderItem';

export interface CartState {
  items: string; // stores all OrderItems in a JSON string
}

const initialState: CartState = {
  items: JSON.stringify([]),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      // Implement addItem logic here
    },
    
    // Removes an item from the cart based on OrderItem id, which is passed as a string
    removeItem: (state, action: PayloadAction<string>) => {
      let itemsObj = JSON.parse(state.items);
      itemsObj = itemsObj.filter((item: { id: string }) => item.id !== action.payload);
      state.items = JSON.stringify(itemsObj);
    },

    clearCart: (state) => {
      state.items = JSON.stringify([]);
    },

    updateItem: (state, action: PayloadAction<{ id: string; updatedOrder: string }>) => {
      // Implement updateItem logic here
    },

    // Adds a CoffeeBagItem, where payload is a JSON string of the coffeeBagItem to add.
    addCoffeeBagItem: (state, action: PayloadAction<string>) => {
      const coffeeBagItem = CoffeeBagOrderItem.fromJSON(action.payload);
      let itemsObj = JSON.parse(state.items);
      itemsObj.push(coffeeBagItem);
      state.items = JSON.stringify(itemsObj);
      console.log(state.items);
    },

    // Removes an item from the cart based on OrderItem id, which is passed as a string
    removeCoffeeBagItem: (state, action: PayloadAction<string>) => {
      let itemsObj = JSON.parse(state.items);
      itemsObj = itemsObj.filter(
        (item: { id: string }) => !(item instanceof CoffeeBagOrderItem && item.id === action.payload)
      );
      state.items = JSON.stringify(itemsObj);
    },
    
    updateCoffeeBagItem: (state, action: PayloadAction<string>) => {
      const updatedOrderItem = action.payload;
      const updatedCoffeeBagOrderItem = CoffeeBagOrderItem.fromJSON(updatedOrderItem);
      const id = updatedCoffeeBagOrderItem.id;

      let itemsObj = JSON.parse(state.items);
      const index = itemsObj.findIndex(
        (item : { id: string }) => item instanceof CoffeeBagOrderItem && item.id === id
      );
      if (index !== -1) {
        itemsObj[index] = updatedCoffeeBagOrderItem;
      }
      state.items = JSON.stringify(itemsObj);
    },
  },
});

export const { addItem, removeItem, clearCart, updateItem, addCoffeeBagItem, removeCoffeeBagItem, updateCoffeeBagItem } = cartSlice.actions;

export default cartSlice.reducer;
