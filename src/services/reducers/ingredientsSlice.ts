import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ingredientType } from '../../utils/tsTypes';
import { BASE_URL, checkResponse } from '../../utils/api';

interface IngredientsState {
  items: any;
  allIngredients: ingredientType[];
  buns: ingredientType[];
  constructorIngredients: ingredientType[];
  viewedIngredient: ingredientType | null;
  createdOrder: any;
  orderNumber: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  allIngredients: [],
  buns: [],
  constructorIngredients: [],
  viewedIngredient: null,
  createdOrder: null,
  orderNumber: null,
  loading: false,
  error: null,
  items: []
};

export const fetchIngredients = createAsyncThunk('ingredients/fetchIngredients', async () => {
  const response = await fetch(`${BASE_URL}/ingredients`);
  const data = await checkResponse(response);
  return data.data;
});

export const createOrder = createAsyncThunk<number, ingredientType[]>(
  'ingredients/createOrder',
  async (ingredients, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        return thunkAPI.rejectWithValue('Токен не найден');
      }

      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`,
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = await checkResponse(response);
      return data.order.number;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Неизвестная ошибка');
    }
  }
);


const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setViewedIngredient(state, action: PayloadAction<ingredientType | null>) {
      state.viewedIngredient = action.payload;
    },
    setBun(state, action: PayloadAction<ingredientType & { uuid: string }>) {
      state.buns = [action.payload];
    },
    addConstructorIngredient(state, action: PayloadAction<ingredientType & { uuid: string }>) {
      state.constructorIngredients.push(action.payload);
    },
    removeConstructorIngredient(state, action: PayloadAction<string>) {
      const index = state.constructorIngredients.findIndex(ingredient => ingredient.uuid === action.payload);
      if (index !== -1) {
        state.constructorIngredients.splice(index, 1);
      }
    },
    reorderConstructorIngredients(state, action: PayloadAction<{ fromIndex: number, toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload;
      const [movedIngredient] = state.constructorIngredients.splice(fromIndex, 1);
      state.constructorIngredients.splice(toIndex, 0, movedIngredient);
    },
    resetOrderNumber(state) {
      state.orderNumber = null;
    },
    clearConstructor(state) {
      state.buns = [];
      state.constructorIngredients = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<ingredientType[]>) => {
        state.loading = false;
        state.allIngredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при получении ингредиентов';
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.orderNumber = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
        ingredientsSlice.caseReducers.resetOrderNumber(state);
        ingredientsSlice.caseReducers.clearConstructor(state);
      });
  },
});

export const { 
  setViewedIngredient, 
  setBun, 
  addConstructorIngredient, 
  removeConstructorIngredient, 
  reorderConstructorIngredients, 
  resetOrderNumber,
  clearConstructor
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;