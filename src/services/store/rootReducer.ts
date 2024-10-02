import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../reducers/ingredientsSlice';
import userReducer from '../reducers/userSlice';
import ordersReducer from '../reducers/feedOrdersSlice';
import profileOrdersReducer from '../reducers/profileOrdersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  orders: ordersReducer,
  profileOrders: profileOrdersReducer,
});

export default rootReducer;
