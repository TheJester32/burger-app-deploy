import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

export interface Order {
  _id: string;
  number: number;
  createdAt: string;
  name: string;
  ingredients: string[];
  status: string;
}

interface OrdersState {
  orders: Order[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  ingredients: { [key: string]: { image: string; price: number } };
  ingredientsLoading: boolean;
}

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  ingredients: {},
  ingredientsLoading: false,
};

interface SetOrdersPayload {
  orders: Order[];
  total: number;
  totalToday: number;
}

interface WsMessagePayload {
  orders: Order[];
  total: number;
  totalToday: number;
}
export const wsMessageAction = createAction<WsMessagePayload>('feedOrders/wsMessage');

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<SetOrdersPayload>) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(wsMessageAction, (state, action) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
      state.loading = false;
    })
  },
});

export const {
  setOrders,
  setLoading,
  setError,
} = ordersSlice.actions;
export default ordersSlice.reducer;
