import reducer, {
    setOrders,
    setLoading,
    setError,
    clearOrders,
    updateOrders,
  } from './profileOrdersSlice';
  
  const initialState = {
    orders: [],
    loading: false,
    error: null,
    ingredientData: {},
  };
  
  describe('profileOrdersSlice reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  
    it('should handle setOrders', () => {
      const orders = [
        { _id: '1', number: 101, createdAt: '2024-01-01', name: 'Order 1', ingredients: ['ingredient1'], status: 'done' },
      ];
      const action = { type: setOrders.type, payload: orders };
      const expectedState = { ...initialState, orders };
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
  
    it('should handle clearOrders', () => {
      const stateWithOrders = {
        ...initialState,
        orders: [{ _id: '1', number: 101, createdAt: '2024-01-01', name: 'Order 1', ingredients: ['ingredient1'], status: 'done' }],
      };
      const action = { type: clearOrders.type };
      const expectedState = { ...initialState, orders: [] };
      expect(reducer(stateWithOrders, action)).toEqual(expectedState);
    });
  
    it('should handle updateOrders', () => {
      const newOrders = [
        { _id: '2', number: 102, createdAt: '2024-01-02', name: 'Order 2', ingredients: ['ingredient2'], status: 'pending' },
      ];
      const action = { type: updateOrders.type, payload: newOrders };
      const expectedState = { ...initialState, orders: newOrders };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });
  