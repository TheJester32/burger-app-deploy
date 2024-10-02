import ingredientsReducer, { 
    setViewedIngredient, 
    setBun, 
    addConstructorIngredient, 
    removeConstructorIngredient, 
    reorderConstructorIngredients, 
    resetOrderNumber, 
    clearConstructor 
  } from './ingredientsSlice';
  
  describe('ingredientsSlice reducer', () => {
    const initialState = {
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
  
    it('should return the initial state', () => {
      expect(ingredientsReducer(undefined, { type: undefined })).toEqual(initialState);
    });
  
    it('should set viewed ingredient', () => {
      const ingredient = { name: 'Test Ingredient', type: 'bun' };
      expect(ingredientsReducer(initialState, setViewedIngredient(ingredient)))
        .toEqual({
          ...initialState,
          viewedIngredient: ingredient
        });
    });
  
    it('should set a bun', () => {
      const bun = { name: 'Test Bun', type: 'bun', uuid: '123' };
      expect(ingredientsReducer(initialState, setBun(bun)))
        .toEqual({
          ...initialState,
          buns: [bun]
        });
    });
  
    it('sould add an ingredient to the constructor', () => {
      const ingredient = { name: 'Test Ingredient', type: 'sauce', uuid: '456' };
      expect(ingredientsReducer(initialState, addConstructorIngredient(ingredient)))
        .toEqual({
          ...initialState,
          constructorIngredients: [ingredient]
        });
    });
  
    it('should remove an ingredient from the constructor', () => {
      const state = {
        ...initialState,
        constructorIngredients: [{ name: 'Test Ingredient', type: 'sauce', uuid: '456' }]
      };
      expect(ingredientsReducer(state, removeConstructorIngredient('456')))
        .toEqual({
          ...initialState,
          constructorIngredients: []
        });
    });
  
    it('should change an order in the constructor', () => {
      const state = {
        ...initialState,
        constructorIngredients: [
          { name: 'Ingredient 1', type: 'sauce', uuid: '111' },
          { name: 'Ingredient 2', type: 'main', uuid: '222' }
        ]
      };
      const expectedState = {
        ...initialState,
        constructorIngredients: [
          { name: 'Ingredient 2', type: 'main', uuid: '222' },
          { name: 'Ingredient 1', type: 'sauce', uuid: '111' }
        ]
      };
      expect(ingredientsReducer(state, reorderConstructorIngredients({ fromIndex: 0, toIndex: 1 })))
        .toEqual(expectedState);
    });
  
    it('should clear number of an order', () => {
      const state = {
        ...initialState,
        orderNumber: 12345
      };
      expect(ingredientsReducer(state, resetOrderNumber())).toEqual(initialState);
    });
  
    it('should clear the constructor', () => {
      const state = {
        ...initialState,
        buns: [{ name: 'Test Bun', type: 'bun', uuid: '789' }],
        constructorIngredients: [{ name: 'Test Ingredient', type: 'sauce', uuid: '456' }]
      };
      expect(ingredientsReducer(state, clearConstructor())).toEqual(initialState);
    });
  });
  