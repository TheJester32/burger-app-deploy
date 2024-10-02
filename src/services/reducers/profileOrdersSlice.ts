import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
    _id: string;
    number: number;
    createdAt: string;
    name: string;
    ingredients: string[];
    status: string;
}

interface ProfileOrdersState {
    orders: Order[];
    loading: boolean;
    error: string | null;
    ingredientData: { [key: string]: { image: string; price: number; name: string } };
}

const initialState: ProfileOrdersState = {
    orders: [],
    loading: false,
    error: null,
    ingredientData: {},
};

const profileOrdersSlice = createSlice({
    name: 'profileOrders',
    initialState,
    reducers: {
        setOrders(state, action: PayloadAction<Order[]>) {
            state.orders = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearOrders(state) {
            state.orders = [];
        },
        updateOrders(state, action: PayloadAction<Order[]>) {
            state.orders = action.payload;
        }
    },

});

export const { setOrders, setLoading, setError, clearOrders, updateOrders } = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
