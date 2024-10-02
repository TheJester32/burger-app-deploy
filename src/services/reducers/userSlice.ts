import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { BASE_URL, checkResponse } from '../../utils/api';

interface User {
  email: string | null;
  name: string | null;
  success: boolean
}

interface UserState {
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthentficated: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: {
    email: null, name: null,
    success: false
  },
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isAuthentficated: false,
  error: null,
  updateStatus: 'idle'
};

export const registerUser = createAsyncThunk<UserState, { email: string; password: string; name: string }, { rejectValue: string }>(
  'user/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await checkResponse(response);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const loginUser = createAsyncThunk<UserState, { email: string; password: string }, { rejectValue: string }>(
  'user/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await checkResponse(response);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const refreshToken = createAsyncThunk<UserState, string, { rejectValue: string }>(
  'user/refreshToken',
  async (refreshToken, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });
      const data = await checkResponse(response);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const logoutUser = createAsyncThunk<{ success: boolean; message: string }, string, { rejectValue: string }>(
  'user/logoutUser',
  async (refreshToken, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });
      const result = await checkResponse(response);
      if (result.success) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const fetchUserProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  'user/fetchUserProfile',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const accessToken = state.user.accessToken;
      if (!accessToken) {
        throw new Error('Токен доступа отсутствует');
      }
      const response = await fetch(`${BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await checkResponse(response);
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const updateUserProfile = createAsyncThunk<User, { name: string; email: string; password?: string }, { rejectValue: string }>(
  'user/updateUserProfile',
  async (userData, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const accessToken = state.user.accessToken;

      if (!accessToken) {
        throw new Error('Токен доступа отсутствует');
      }
      const bodyData: { name: string; email: string; password?: string } = {
        name: userData.name,
        email: userData.email
      };

      if (userData.password) {
        bodyData.password = userData.password;
      }

      const response = await fetch(`${BASE_URL}/auth/user`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });
      const data = await checkResponse(response);
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Неизвестная ошибка');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthentficated = true;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthentficated = true;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      })
      .addCase(logoutUser.fulfilled, (state, action: PayloadAction<{ success: boolean; message: string }>) => {
        if (action.payload.success) {
          state.user = { email: null, name: null, success: false };
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthentficated = false;
        }
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.updateStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.updateStatus = 'failed';
        state.error = action.payload || 'Неизвестная ошибка';
      });
  },
});

export const { resetError } = userSlice.actions;

export default userSlice.reducer;
