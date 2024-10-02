import React, { useRef } from "react";
import { useDrop, useDrag, DropTargetMonitor } from "react-dnd";
import {
  CurrencyIcon,
  LockIcon,
  DragIcon,
  DeleteIcon,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import burgerConstructorStyles from "./burgerConstructor.module.css";
import { ingredientType } from "../../utils/tsTypes";
import { useAppSelector } from "../../services/store/hooks";
import { useNavigate } from "react-router-dom";

interface IngredientItemProps {
  item: ingredientType;
  index: number;
  moveIngredient: (fromIndex: number, toIndex: number) => void;
  handleRemove: (uuid: string) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  item,
  index,
  moveIngredient,
  handleRemove,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: "constructor-ingredient",
    hover(draggedItem: { index: number }) {
      if (draggedItem.index === index) return;
      moveIngredient(draggedItem.index, index);
      draggedItem.index = index;
    },
  });

  const [, drag] = useDrag({
    type: "constructor-ingredient",
    item: { index },
  });

  drag(drop(ref));

  return (
    <li ref={ref} className="p-2" key={item.uuid}>
      <DragIcon type={"primary"} />
      <div
        className={`${burgerConstructorStyles.ingredients__main_list_inner_wrapper} ${burgerConstructorStyles.ingredients__default_bun_inner}`}
      >
        <img src={item.image_mobile} alt={item.name} />
        <p
          className={`text text_type_main-default ${burgerConstructorStyles.ingredients__name}`}
        >
          {item.name}
        </p>
        <div
          className={
            burgerConstructorStyles.ingredients__main_list_inner__secondary_wrapper
          }
        >
          <div
            className={
              burgerConstructorStyles.ingredients__main_list_price_wrapper
            }
          >
            <p
              className={`text text_type_digits-default ${burgerConstructorStyles.ingredients__main_list_price}`}
            >
              {item.price}
            </p>
            <span className={burgerConstructorStyles.ingredients__currency}>
              <CurrencyIcon type="primary" />
            </span>
          </div>
          <DeleteIcon
            onClick={() => item.uuid && handleRemove(item.uuid)}
            type={"primary"}
          />
        </div>
      </div>
    </li>
  );
};

interface BurgerConstructorProps {
  data: ingredientType[];
  handleOrderDetailsOpen: () => void;
  handleIngredientDrop: (id: string, type: string) => void;
  handleReorder: (fromIndex: number, toIndex: number) => void;
  handleRemove: (uuid: string) => void;
  isAuthentficated: boolean;
}

const BurgerConstructor: React.FC<BurgerConstructorProps> = ({
  data,
  handleOrderDetailsOpen,
  handleIngredientDrop,
  handleReorder,
  handleRemove,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ingredient",
    drop: (item: { id: string; type: string }, monitor: DropTargetMonitor) => {
      if (monitor.didDrop()) return;
      handleIngredientDrop(item.id, item.type);
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const moveIngredient = (fromIndex: number, toIndex: number) => {
    handleReorder(fromIndex, toIndex);
  };

  const { isAuthentficated } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    if (!isAuthentficated) {
      navigate("/login");
    }
  };

  const bun = data.find((item) => item.type === "bun");
  const mains = data.filter((item) => item.type !== "bun");

  const totalPrice = data.reduce((acc, item) => acc + item.price, 0);
  const adjustedTotalPrice = bun ? totalPrice + bun.price : totalPrice;
  const isOrderDisabled = totalPrice === 0 || !bun;

  return (
    <section className={burgerConstructorStyles.ingredients} ref={drop}>
      <ul
        className={burgerConstructorStyles.ingredients__default_list}
        data-cy="bun-upper-drag-area"
      >
        {bun ? (
          <li
            key={bun.uuid}
            className={`p-2 ${burgerConstructorStyles.ingredients__upper_bun}`}
            data-cy="bun-upper"
          >
            <div
              className={`${burgerConstructorStyles.ingredients__main_list_inner_wrapper} ${burgerConstructorStyles.ingredients__upper_bun_inner}`}
            >
              <img src={bun.image_mobile} alt={bun.name} />
              <p
                className={`text text_type_main-default ${burgerConstructorStyles.ingredients__name}`}
              >{`${bun.name} (верх)`}</p>
              <div
                className={
                  burgerConstructorStyles.ingredients__main_list_inner__secondary_wrapper
                }
              >
                <div
                  className={
                    burgerConstructorStyles.ingredients__main_list_price_wrapper
                  }
                >
                  <p
                    className={`text text_type_digits-default ${burgerConstructorStyles.ingredients__main_list_price}`}
                  >
                    {bun.price}
                  </p>
                  <CurrencyIcon type={"primary"} />
                </div>
                <LockIcon type="secondary" />
              </div>
            </div>
          </li>
        ) : (
          <li
            className={`p-2 ${burgerConstructorStyles.ingredients__upper_bun}`}
            style={{ backgroundColor: isOver ? "#2ffdc8" : "transparent" }}
          >
            <div
              className={`${burgerConstructorStyles.ingredients__main_list_inner_wrapper} ${burgerConstructorStyles.empty_constructor_text}`}
            >
              <p className={`text text_type_main-medium`}>
                Здесь могла бы быть ваша булочка
              </p>
            </div>
          </li>
        )}
      </ul>
      <ul
        className={`custom-scroll ${burgerConstructorStyles.ingredients__main_list}`}
        data-cy="main-middle"
      >
        {mains.length ? (
          mains.map((main, index) => (
            <IngredientItem
              key={main.uuid}
              item={main}
              index={index}
              moveIngredient={moveIngredient}
              handleRemove={handleRemove}
            />
          ))
        ) : (
          <li
            className={`p-2 ${burgerConstructorStyles.ingredients__main_list}`}
          >
            <div
              className={`${burgerConstructorStyles.ingredients__main_list_inner_wrapper} ${burgerConstructorStyles.empty_constructor_text}`}
            >
              <p
                className={`text text_type_main-medium`}
                style={{ backgroundColor: isOver ? "#2ffdc8" : "transparent" }}
              >
                Перетащите ваши ингредиенты сюда
              </p>
            </div>
          </li>
        )}
      </ul>
      <ul
        className={burgerConstructorStyles.ingredients__default_list}
        data-cy="bun-lower-drag-area"
      >
        {bun ? (
          <li
            key={bun.uuid}
            className={`p-2 ${burgerConstructorStyles.ingredients__lower_bun}`}
          >
            <div
              className={`${burgerConstructorStyles.ingredients__main_list_inner_wrapper} ${burgerConstructorStyles.ingredients__lower_bun_inner}`}
            >
              <img src={bun.image_mobile} alt={bun.name} />
              <p
                className={`text text_type_main-default ${burgerConstructorStyles.ingredients__name}`}
              >{`${bun.name} (низ)`}</p>
              <div
                className={
                  burgerConstructorStyles.ingredients__main_list_inner__secondary_wrapper
                }
              >
                <div
                  className={
                    burgerConstructorStyles.ingredients__main_list_price_wrapper
                  }
                >
                  <p
                    className={`text text_type_digits-default ${burgerConstructorStyles.ingredients__main_list_price}`}
                  >
                    {bun.price}
                  </p>
                  <CurrencyIcon type={"primary"} />
                </div>
                <LockIcon type="secondary" />
              </div>
            </div>
          </li>
        ) : (
          <li
            className={`p-2 ${burgerConstructorStyles.ingredients__lower_bun}`}
            style={{ backgroundColor: isOver ? "#2ffdc8" : "transparent" }}
            data-cy="bun-lower"
          >
            <div
              className={`${burgerConstructorStyles.ingredients__main_list_inner_wrapper} ${burgerConstructorStyles.empty_constructor_text}`}
            >
              <p className={`text text_type_main-medium`}>
                Здесь могла бы быть ваша булочка
              </p>
            </div>
          </li>
        )}
      </ul>
      <div
        className={burgerConstructorStyles.ingredients__final_price_container}
      >
        <div
          className={burgerConstructorStyles.ingredients__final_price_wrapper}
        >
          <h2
            className={`text text_type_digits-medium ${burgerConstructorStyles.ingredients__final_price_digit}`}
          >
            {adjustedTotalPrice}
          </h2>
          <CurrencyIcon type={"primary"} />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={() => {
            isAuthentficated
              ? handleOrderDetailsOpen()
              : handleRedirectToLogin();
          }}
          disabled={isOrderDisabled}
          data-cy="place-order"
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export { BurgerConstructor };
