import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";
import feedStyles from './feed.module.css';

function FeedStats() {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch({
      type: 'socket/connect',
      payload: {
        url: 'wss://norma.nomoreparties.space/orders/all',
        actions: {
          onOpen: (): any => ({ type: 'feedOrders/wsOpen' }),
          onClose: (): any => ({ type: 'feedOrders/wsClose' }),
          onMessage: (data: any): any => ({ type: 'feedOrders/wsMessage', payload: data }),
        },
      },
    });
    return () => {
      dispatch({
        type: 'socket/disconnect',
      });
    };
  }, [dispatch]);
  

  const readyOrders = orders.filter(order => order.status === 'done');
  const inWorkOrders = orders.filter(order => order.status !== 'done');

  const groupOrders = (orders: any[], groupSize: number) => {
    let groupedOrders: any[][] = [];
    for (let i = 0; i < orders.length; i += groupSize) {
      groupedOrders.push(orders.slice(i, i + groupSize));
    }
    return groupedOrders;
  };

  const groupedReadyOrders = groupOrders(readyOrders, 10);
  const groupedInWorkOrders = groupOrders(inWorkOrders, 10);

  return (
    <section className={feedStyles.feedStats}>
      <div className={feedStyles.feedStats__lists}>
        <div>
          <p className="text text_type_main-medium">Готовы:</p>
          <div className={feedStyles.feedStats__grid}>
            {groupedReadyOrders.map((group, groupIndex) => (
              <ul key={groupIndex} className="custom-scroll">
                {group.map((order, index) => (
                  <li key={index} className={`text text_type_digits-default ${feedStyles.feedStats__lists_ready}`}>
                    {order.number}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div>
          <p className="text text_type_main-medium">В работе:</p>
          <div className={feedStyles.feedStats__grid}>
            {groupedInWorkOrders.map((group, groupIndex) => (
              <ul key={groupIndex} className="custom-scroll">
                {group.map((order, index) => (
                  <li key={index} className={`text text_type_digits-default ${feedStyles.feedStats__lists_work}`}>
                    {order.number}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div className={feedStyles.feedStats__total_wrapper}>
        <p className="text text_type_main-medium">Выполнено за все время:</p>
        <p className="text text_type_digits-large">{total}</p>
      </div>
      <div className={feedStyles.feedStats__total_wrapper}>
        <p className="text text_type_main-medium">Выполнено за сегодня:</p>
        <p className="text text_type_digits-large">{totalToday}</p>
      </div>
    </section>
  );
}

export { FeedStats };
