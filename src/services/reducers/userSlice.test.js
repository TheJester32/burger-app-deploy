import reducer, { resetError } from './userSlice';
import {
  registerUser,
  loginUser,
  fetchUserProfile,
  logoutUser,
  updateUserProfile
} from './userSlice';

const initialState = {
  user: {
    email: null,
    name: null,
    success: false,
  },
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isAuthentficated: false,
  error: null,
  updateStatus: 'idle',
};

describe('userSlice reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle resetError', () => {
    const previousState = { ...initialState, error: 'Some error' };
    expect(reducer(previousState, resetError())).toEqual(initialState);
  });

  it('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const expectedState = { ...initialState, isLoading: true, error: null };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: {
        user: { email: 'test@test.com', name: 'Test', success: true },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    };
    const expectedState = {
      ...initialState,
      isLoading: false,
      user: { email: 'test@test.com', name: 'Test', success: true },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      isAuthentficated: true,
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle registerUser.rejected', () => {
    const action = {
      type: registerUser.rejected.type,
      payload: 'Registration failed',
    };
    const expectedState = { ...initialState, isLoading: false, error: 'Registration failed' };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const expectedState = { ...initialState, isLoading: true, error: null };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: {
        user: { email: 'test@test.com', name: 'Test', success: true },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    };
    const expectedState = {
      ...initialState,
      isLoading: false,
      user: { email: 'test@test.com', name: 'Test', success: true },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      isAuthentficated: true,
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      payload: 'Login failed',
    };
    const expectedState = { ...initialState, isLoading: false, error: 'Login failed' };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle fetchUserProfile.pending', () => {
    const action = { type: fetchUserProfile.pending.type };
    const expectedState = { ...initialState, isLoading: true, error: null };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle fetchUserProfile.fulfilled', () => {
    const action = {
      type: fetchUserProfile.fulfilled.type,
      payload: { email: 'test@test.com', name: 'Test', success: true },
    };
    const expectedState = {
      ...initialState,
      isLoading: false,
      user: { email: 'test@test.com', name: 'Test', success: true },
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle fetchUserProfile.rejected', () => {
    const action = {
      type: fetchUserProfile.rejected.type,
      payload: 'Profile fetch failed',
    };
    const expectedState = { ...initialState, isLoading: false, error: 'Profile fetch failed' };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle logoutUser.fulfilled', () => {
    const action = {
      type: logoutUser.fulfilled.type,
      payload: { success: true, message: 'Logout successful' },
    };
    const previousState = {
      ...initialState,
      user: { email: 'test@test.com', name: 'Test', success: true },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      isAuthentficated: true,
    };
    const expectedState = initialState;
    expect(reducer(previousState, action)).toEqual(expectedState);
  });

  it('should handle updateUserProfile.pending', () => {
    const action = { type: updateUserProfile.pending.type };
    const expectedState = { ...initialState, updateStatus: 'loading', error: null };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle updateUserProfile.fulfilled', () => {
    const action = {
      type: updateUserProfile.fulfilled.type,
      payload: { email: 'updated@test.com', name: 'Updated', success: true },
    };
    const expectedState = {
      ...initialState,
      updateStatus: 'succeeded',
      user: { email: 'updated@test.com', name: 'Updated', success: true },
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle updateUserProfile.rejected', () => {
    const action = {
      type: updateUserProfile.rejected.type,
      payload: 'Update failed',
    };
    const expectedState = { ...initialState, updateStatus: 'failed', error: 'Update failed' };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
