import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import feedStyles from "./feed.module.css";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { Order } from "../../services/reducers/feedOrdersSlice";
import Modal from "../../components/modals/modal";
import { FeedOrderDetails } from "../modals/feedOrderModal/feedOrderDetails";
import { useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";

function Feed() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const ingredientData = useAppSelector((state) => state.ingredients.allIngredients);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleOrderClick = (order: Order): void => {
    setSelectedOrder(order);
    window.history.pushState({ modal: true }, "", `/feed/${order.number}`);
    location.pathname = `feed/${order.number}`;
  };

  const calculateTotalPrice = (ingredientIds: string[]): number => {
    return ingredientIds.reduce((total, id) => {
      const ingredient = ingredientData.find((item) => item._id === id);
      return ingredient ? total + ingredient.price : total;
    }, 0);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    navigate("/feed");
    location.pathname = '/feed';
  };

  if (loading)
    return (
      <p className={`${feedStyles.feed_loading}`}>
        Загрузка заказов
      </p>
    );

  return (
    <section className="feed">
      <h1 className="text text_type_main-large">Лента заказов</h1>
      <ul className={`custom-scroll ${feedStyles.feed__list}`}>
        {orders.map((order) => (
          <li
            key={order._id}
            onClick={() => handleOrderClick(order)}
            style={{ cursor: "pointer" }}
          >
            <div className={feedStyles.feed__list_inner_wrapper}>
              <p
                className={`text text_type_digits-default ${feedStyles.feed__list_number}`}
              >
                {`#${order.number}`}
              </p>
              <p
                className={`text text_type_main-default text_color_inactive ${feedStyles.feed__list_time}`}
              >
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <h4
              className={`text text_type_main-medium ${feedStyles.feed__list_name}`}
            >
              {order.name}
            </h4>
            <div className={feedStyles.feed__list_inner_wrapper}>
              <div className={feedStyles.feed__list_ingredients}>
                {order.ingredients.slice(0, 5).map((ingredientId, idx) => {
                  const ingredient = ingredientData.find((item) => item._id === ingredientId); // Исправлено
                  return (
                    <div
                      className={feedStyles.feed__list_ingredient_img_wrapper}
                      key={idx}
                    >
                      {ingredient && (
                        <img
                          className={feedStyles.feed__list_ingredient_img}
                          src={ingredient.image}
                          alt={ingredient.name}
                        />
                      )}
                    </div>
                  );
                })}
                {order.ingredients.length > 5 && (
                  <div
                    className={
                      feedStyles.feed__list_ingredient_img_more_wrapper
                    }
                  >
                    <img
                      className={feedStyles.feed__list_ingredient_img}
                      src={
                        ingredientData.find(
                          (item) => item._id === order.ingredients[5]
                        )?.image
                      }
                      alt="Ингредиент."
                    />
                    <span
                      className={`text text_type_digits-default ${feedStyles.feed__list_ingredient_img_more}`}
                    >
                      +{order.ingredients.length - 5}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p
                  className={`text text_type_digits-default ${feedStyles.feed__list_price}`}
                >
                  {calculateTotalPrice(order.ingredients)}
                </p>
                <CurrencyIcon type={"primary"} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {selectedOrder && (
        <Modal isOpen={Boolean(selectedOrder)} handleClose={closeModal}>
          <FeedOrderDetails
            order={selectedOrder}
            ingredientData={ingredientData}
          />
        </Modal>
      )}
    </section>
  );
}

export { Feed };
