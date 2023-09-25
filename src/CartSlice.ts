// CartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import CoffeeBagOrderItem from './OrderItem';

export interface CartState {
  items: string; // stores all OrderItems in a JSON string
}

const initialState: CartState = {
  items: JSON.stringify([]),
};

// Helper function to generate a new id for an item
// Helper function to generate a new id for an item
const generateNewItemId = (items: any[]): string => {
  let maxId = -1;

  // Iterate through items to find the highest id
  items.forEach((item: { id: string }) => {
    const itemId = parseInt(item.id);
    if (!isNaN(itemId) && itemId > maxId) {
      maxId = itemId;
    }
  });

  // Generate a new id by incrementing the highest id found
  const newId = (maxId + 1).toString();
  return newId;
}


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Removes an item from the cart based on OrderItem id, which is passed as a string
    removeItem: (state, action: PayloadAction<string>) => {
      let itemsObj = JSON.parse(state.items);
      itemsObj = itemsObj.filter((item: { id: string }) => item.id !== action.payload);
      state.items = JSON.stringify(itemsObj);
    },

    clearCart: (state) => {
      state.items = JSON.stringify([]);
    },

    // Adds a CoffeeBagItem, where payload is a JSON string of the coffeeBagItem to add.
    addCoffeeBagItem: (state, action: PayloadAction<string>) => {
      const coffeeBagItem = CoffeeBagOrderItem.fromJSON(action.payload);
      
      let itemsObj = JSON.parse(state.items);
      const newId = generateNewItemId(itemsObj);
      coffeeBagItem.id = newId;
    
      // Check if a similar item already exists in the cart
      const existingItemIndex = itemsObj.findIndex((item: CoffeeBagOrderItem) =>
        coffeeBagItem.isEqualTo(item)
      );
    
      if (existingItemIndex !== -1) {
        // If a similar item exists, cast it to CoffeeBagOrderItem and add the quantity to it
        const existingItem = CoffeeBagOrderItem.fromObject(itemsObj[existingItemIndex]);
        existingItem.addToQuantity(coffeeBagItem);
        itemsObj[existingItemIndex] = existingItem;
      } else {
        // If not, push the new item to the cart
        itemsObj.push(coffeeBagItem);
      }
    
      state.items = JSON.stringify(itemsObj);
    },
    

    // Removes an item from the cart based on OrderItem id, which is passed as a string
    removeCoffeeBagItem: (state, action: PayloadAction<string>) => {
      let itemsObj = JSON.parse(state.items);
      itemsObj = itemsObj.filter(
        (item: { id: string }) => !(item.id === action.payload)
      );
      state.items = JSON.stringify(itemsObj);
    },
    
    updateCoffeeBagItem: (state, action: PayloadAction<string>) => {
      const updatedOrderItem = CoffeeBagOrderItem.fromJSON(action.payload);
      const id = updatedOrderItem.id;
      let itemsObj = JSON.parse(state.items);
    
      // Get current index of item to be updated
      const updatedItemIndex = itemsObj.findIndex(
        (item: { id: string }) => item.id === id
      );
    
      if (updatedItemIndex !== -1) {    
        // Temporarily remove the item to be updated from the list for comparison
        itemsObj.splice(updatedItemIndex, 1);
    
        // Check for equality with other items (excluding the updated item)
        const existingItemIndex = itemsObj.findIndex(
          (item: { id: string }) =>
            CoffeeBagOrderItem.fromObject(item).isEqualTo(updatedOrderItem)
        );
    
        if (existingItemIndex !== -1) {
          // If the updated item is equal to another item, add its quantity to the existing item
          const equalItem = CoffeeBagOrderItem.fromObject(itemsObj[existingItemIndex]);
          equalItem.addToQuantity(updatedOrderItem);
          itemsObj[existingItemIndex] = equalItem;
        } else {
          // Put the updated order item back in the list, at its original index
          itemsObj.splice(updatedItemIndex, 0, updatedOrderItem);
        }        
      }
      state.items = JSON.stringify(itemsObj);
    },
  },
});

const selectCartItemsRaw = (state: { cart: CartState }) => state.cart.items;

export const selectCartItems = createSelector(
  [selectCartItemsRaw],
  (items) => JSON.parse(items)
);


export const { removeItem, clearCart, addCoffeeBagItem, removeCoffeeBagItem, updateCoffeeBagItem } = cartSlice.actions;

export default cartSlice.reducer;
