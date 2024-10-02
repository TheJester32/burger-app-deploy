import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";
import { useParams } from "react-router-dom";
import { ProfileOrderDetails } from "../../components/modals/profileOrderModal/profileOrderDetails";
import feedStyles from "../../components/feed/feed.module.css";

function ProfileOrderPage() {
  const dispatch = useAppDispatch();
  const { number } = useParams();
  const { orders, loading } = useAppSelector((state) => state.profileOrders);

  const ingredientData = useAppSelector(
    (state) => state.ingredients.allIngredients
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")?.split(" ")[1];

    dispatch({
      type: "socket/connect",
      payload: {
        url: "wss://norma.nomoreparties.space/orders",
        token: accessToken,
        actions: {
          onOpen: (): any => ({ type: "feedOrders/wsOpen" }),
          onClose: (): any => ({ type: "feedOrders/wsClose" }),
          onMessage: (data: any): any => ({
            type: "feedOrders/wsMessage",
            payload: data,
          }),
        },
      },
    });

    return () => {
      dispatch({
        type: "socket/disconnect",
      });
    };
  }, [dispatch]);

  if (loading) {
    return <p>Загрузка заказа...</p>;
  }

  const order = orders.find((order) => order.number === Number(number));

  if (!order) {
    return <p>Заказ не найден</p>;
  }

  return (
    <div className={feedStyles.order_container}>
      <div className={feedStyles.order_container_inner}>
        <ProfileOrderDetails order={order} ingredientData={ingredientData} />
      </div>
    </div>
  );
}

export { ProfileOrderPage };
