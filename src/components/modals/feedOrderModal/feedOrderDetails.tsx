import { Order } from "../../../services/reducers/feedOrdersSlice";
import orderDetailsStyles from "./feedOrderDetails.module.css";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { ingredientType } from "../../../utils/tsTypes";

interface OrderProps {
  order: Order;
  ingredientData: ingredientType[];
}

function FeedOrderDetails({ order, ingredientData }: OrderProps) {
  if (!order) {
    return <p>Заказ не найден</p>;
  }

  const ingredientCounts = order.ingredients.reduce<Record<string, number>>(
    (acc, id) => {
      if (acc[id]) {
        acc[id] += 1;
      } else {
        acc[id] = 1;
      }
      return acc;
    },
    {}
  );

  const calculateTotalPrice = () => {
    return Object.entries(ingredientCounts).reduce((total, [id, count]) => {
      const ingredient = ingredientData.find((ingredient) => ingredient._id === id);
      return ingredient ? total + ingredient.price * count : total;
    }, 0);
  };

  return (
    <>
      <p
        className={`text text_type_digits-default ${orderDetailsStyles.orderDetails_number}`}
      >
        #{order.number}
      </p>
      <div className={`${orderDetailsStyles.orderDetails_inner_wrapper}`}>
        <p
          className={`text text_type_main-medium ${orderDetailsStyles.orderDetails_name}`}
        >
          {order.name}
        </p>
        <p
          style={{
            color:
              order.status === "done"
                ? "#fff"
                : order.status === "pending"
                ? "#5AC9CA"
                : "#D43E2B",
            marginTop: "1rem",
            marginBottom: "3rem",
          }}
          className="text text_type_main-default"
        >
          {order.status === "done"
            ? "Выполнен"
            : order.status === "pending"
            ? "Готовится"
            : "Не выполнен"}
        </p>
        <h4 className="text text_type_main-medium">Состав:</h4>
        <ul className={`${orderDetailsStyles.orderDetails_list} custom-scroll`}>
          {Object.entries(ingredientCounts).map(([ingredientId, count]) => {
            const ingredient = ingredientData.find(
              (ingredient) => ingredient._id === ingredientId
            );

            if (!ingredient) return null;

            return (
              <li key={ingredientId}>
                <div className={orderDetailsStyles.orderDetails_img_wrapper}>
                  <img src={ingredient.image} alt="Ингредиент" />
                </div>
                <h4
                  className={`text text_type_main-medium ${orderDetailsStyles.orderDetails_img_name}`}
                >
                  {ingredient.name}
                </h4>
                <p className="text text_type_digits-default">x{count}</p>
                <div className={orderDetailsStyles.orderDetails_count_wrapper}>
                  <p className="text text_type_digits-default">
                    {ingredient.price * count}
                  </p>
                  <CurrencyIcon type="primary" />
                </div>
              </li>
            );
          })}
        </ul>
        <div className={orderDetailsStyles.orderDetails_lower_wrapper}>
          <p className="text text_type_digits-default text_color_inactive">
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <div className={`${orderDetailsStyles.orderDetails_price_wrapper}`}>
            <p
              className="text text_type_digits-default"
            >
              {calculateTotalPrice()}
            </p>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </div>
    </>
  );
}

export { FeedOrderDetails };
