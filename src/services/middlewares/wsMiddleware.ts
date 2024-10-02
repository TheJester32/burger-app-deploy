import { Middleware, MiddlewareAPI, Dispatch } from '@reduxjs/toolkit';
import { checkWsResponse } from '../../utils/api'; 
import { updateOrders } from '../reducers/profileOrdersSlice';


const socketMiddleware: Middleware<{}, any, Dispatch<any>> = (store: MiddlewareAPI) => {
  let socket: WebSocket | null = null;

  return (next) => (action: any) => {
    const { dispatch } = store;

    if (action.type === 'socket/connect') {
      const { url, token, actions } = action.payload;

      if (typeof actions.onOpen !== 'function' || 
          typeof actions.onMessage !== 'function' || 
          typeof actions.onClose !== 'function') {
        console.error('Некорректные экшены для WebSocket');
        return;
      }

      if (socket !== null) {
        socket.close();
      }
      
      const fullUrl = token ? `${url}?token=${token}` : url;
      socket = new WebSocket(fullUrl);

      socket.onopen = () => {
        dispatch(actions.onOpen());
        console.log("WebSocket соединение открыто");
      };

      socket.onmessage = (event) => {
        try {
          const data = checkWsResponse(event.data);
          
          if (data && data.orders) {
            dispatch(updateOrders(data.orders));
          }
      
          dispatch(actions.onMessage(data));
        } catch (error) {
          console.error("Ошибка:", error);
        }
      };
      
      socket.onerror = (error) => {
        console.error("Ошибка WebSocket:", error);
      };

      socket.onclose = () => {
        dispatch(actions.onClose());
        console.log("WebSocket соединение закрыто");
      };
    }

    if (action.type === 'socket/disconnect') {
      if (socket !== null) {
        socket.close();
        socket = null;
        console.log("WebSocket соединение закрыто через action");
      }
    }

    return next(action);
  };
};

export default socketMiddleware;
