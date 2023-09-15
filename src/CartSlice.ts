// CartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id: number;
  product: string;
  quantity: number;
  price: number;
  groundSize: string;
  bagSize: string;
}

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
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    getAllItems: (state, action: PayloadAction<OrderItem[]>) => {
      state.items = action.payload;
    },
    updateItem: (state, action: PayloadAction<{ id: number; updatedOrder: OrderItem }>) => {
      const { id, updatedOrder } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = updatedOrder;
      }
    },
  },
});

export const { addItem, removeItem, clearCart, getAllItems, updateItem } = cartSlice.actions;
export default cartSlice.reducer;
