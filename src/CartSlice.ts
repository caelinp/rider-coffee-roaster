// CartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from './OrderItem'
import CoffeeBagOrderItem from './OrderItem'

interface CartState {
  items: OrderItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<OrderItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    getAllItems: (state, action: PayloadAction<OrderItem[]>) => {
      state.items = action.payload;
    },
    updateItem: (state, action: PayloadAction<{ id: string; updatedOrder: OrderItem }>) => {
      const { id, updatedOrder } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = updatedOrder;
      }
    },
    addCoffeeBagItem: (state, action: PayloadAction<CoffeeBagOrderItem>) => {
      state.items.push(action.payload);
    },

    removeCoffeeBagItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => !(item instanceof CoffeeBagOrderItem && item.id === action.payload)
      );
    },

    updateCoffeeBagItem: (
      state,
      action: PayloadAction<{ id: string; updatedOrder: CoffeeBagOrderItem }>
    ) => {
      const { id, updatedOrder } = action.payload;
      const index = state.items.findIndex(
        (item) => item instanceof CoffeeBagOrderItem && item.id === id
      );
      if (index !== -1) {
        state.items[index] = updatedOrder;
      }
    },
  },
});

export const { addItem, removeItem, clearCart, getAllItems, updateItem, addCoffeeBagItem, removeCoffeeBagItem, updateCoffeeBagItem } = cartSlice.actions;
export default cartSlice.reducer;
