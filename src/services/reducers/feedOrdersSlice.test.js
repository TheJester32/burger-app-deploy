import reducer, {
    setOrders,
    setLoading,
    setError,
    wsMessageAction,
  } from './feedOrdersSlice';
  
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null,
    ingredients: {},
    ingredientsLoading: false,
  };
  
  describe('feedOrdersSlice reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  
    it('should handle setOrders', () => {
      const action = {
        type: setOrders.type,
        payload: {
          orders: [{ _id: '1', number: 101, createdAt: '2024-01-01', name: 'Order 1', ingredients: ['ingredient1'], status: 'done' }],
          total: 10,
          totalToday: 2,
        },
      };
      const expectedState = {
        ...initialState,
        orders: [{ _id: '1', number: 101, createdAt: '2024-01-01', name: 'Order 1', ingredients: ['ingredient1'], status: 'done' }],
        total: 10,
        totalToday: 2,
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  
    it('should handle setLoading', () => {
      const action = { type: setLoading.type, payload: true };
      const expectedState = { ...initialState, loading: true };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  
    it('should handle setError', () => {
      const action = { type: setError.type, payload: 'Error occurred' };
      const expectedState = { ...initialState, error: 'Error occurred' };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  
    it('should handle wsMessageAction', () => {
      const action = {
        type: wsMessageAction.type,
        payload: {
          orders: [
            { _id: '1', number: 101, createdAt: '2024-01-01', name: 'Order 1', ingredients: ['ingredient1'], status: 'done' },
            { _id: '2', number: 102, createdAt: '2024-01-02', name: 'Order 2', ingredients: ['ingredient2'], status: 'pending' }
          ],
          total: 100,
          totalToday: 20,
        },
      };
      const expectedState = {
        ...initialState,
        orders: [
          { _id: '1', number: 101, createdAt: '2024-01-01', name: 'Order 1', ingredients: ['ingredient1'], status: 'done' },
          { _id: '2', number: 102, createdAt: '2024-01-02', name: 'Order 2', ingredients: ['ingredient2'], status: 'pending' }
        ],
        total: 100,
        totalToday: 20,
        loading: false,
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });
  