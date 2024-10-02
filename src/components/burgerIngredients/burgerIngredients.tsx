import React, { useRef, useEffect, useState } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import {
  CurrencyIcon,
  Counter,
} from "@ya.praktikum/react-developer-burger-ui-components";
import burgerIngredientsStyles from "./burgerIngredients.module.css";
import { useAppSelector } from "../../services/store/hooks";
import { ingredientType } from "../../utils/tsTypes";

interface BurgerIngredientsProps {
  data: ingredientType[];
  handleIngredientDetailsOpen: (ingredient: ingredientType) => void;
}

interface IngredientProps {
  item: ingredientType;
  handleIngredientDetailsOpen: (ingredient: ingredientType) => void;
}

function BurgerIngredients({
  data,
  handleIngredientDetailsOpen,
}: BurgerIngredientsProps) {
  const constructorIngredients = useAppSelector(
    (state) => state.ingredients.constructorIngredients
  );
  const buns = useAppSelector((state) => state.ingredients.buns);

  const [activeTab, setActiveTab] = useState<"buns" | "sauces" | "mains">(
    "buns"
  );

  const bunsRef = useRef<HTMLLIElement>(null);
  const saucesRef = useRef<HTMLLIElement>(null);
  const mainsRef = useRef<HTMLLIElement>(null);
  const containerRef = useRef<HTMLUListElement>(null);

  const getIngredientCount = (id: string): number => {
    let count = 0;
    if (buns.some((bun) => bun._id === id)) {
      count += 2;
    }
    constructorIngredients.forEach((item) => {
      if (item._id === id) {
        count++;
      }
    });
    return count;
  };

  const Ingredient: React.FC<IngredientProps> = ({ item }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "ingredient",
      item: { id: item._id, type: item.type },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <li
        ref={drag}
        key={item._id}
        className={`p-3 ${burgerIngredientsStyles.constructor__element_wrap}`}
        onClick={() => handleIngredientDetailsOpen(item)}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        data-cy="constructor-ingredient"
      >
        <Counter
          count={getIngredientCount(item._id)}
          size="default"
          extraClass="m-1"
        />
        <img src={item.image} alt={item.name} />
        <div
          className={burgerIngredientsStyles.constructor__element_price_wrapper}
        >
          <p
            className={`text text_type_digits-default ${burgerIngredientsStyles.constructor__element_price}`}
          >
            {item.price}
          </p>
          <CurrencyIcon type={"primary"} />
        </div>
        <p className="text text_type_main-default p-1">{item.name}</p>
      </li>
    );
  };

  const handleScroll = () => {
    const bunsPosition = bunsRef.current?.getBoundingClientRect().top || 0;
    const saucesPosition = saucesRef.current?.getBoundingClientRect().top || 0;
    const mainsPosition = mainsRef.current?.getBoundingClientRect().top || 0;

    const containerPosition =
      containerRef.current?.getBoundingClientRect().top || 0;

    const bunsDiff = Math.abs(containerPosition - bunsPosition);
    const saucesDiff = Math.abs(containerPosition - saucesPosition);
    const mainsDiff = Math.abs(containerPosition - mainsPosition);

    if (bunsDiff < saucesDiff && bunsDiff < mainsDiff) {
      setActiveTab("buns");
    } else if (saucesDiff < bunsDiff && saucesDiff < mainsDiff) {
      setActiveTab("sauces");
    } else {
      setActiveTab("mains");
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const bunsData = data.filter((item) => item.type === "bun");
  const saucesData = data.filter((item) => item.type === "sauce");
  const mainsData = data.filter((item) => item.type === "main");

  return (
    <section>
      <h1 className="text text_type_main-large">Соберите бургер</h1>
      <div className={burgerIngredientsStyles.constructor__options}>
        <h3
          className={`text text_type_main-default p-4 ${activeTab === "buns"
              ? burgerIngredientsStyles.focused_option
              : burgerIngredientsStyles.unfocused_option
            }`}
        >
          Булки
        </h3>
        <h3
          className={`text text_type_main-default p-4 ${activeTab === "sauces"
              ? burgerIngredientsStyles.focused_option
              : burgerIngredientsStyles.unfocused_option
            }`}
        >
          Соусы
        </h3>
        <h3
          className={`text text_type_main-default p-4 ${activeTab === "mains"
              ? burgerIngredientsStyles.focused_option
              : burgerIngredientsStyles.unfocused_option
            }`}
        >
          Начинки
        </h3>
      </div>
      <ul
        ref={containerRef}
        className={`custom-scroll ${burgerIngredientsStyles.constructor__elements_container}`}
        data-cy="ingredients"
      >
        <li ref={bunsRef} className="text text_type_main-medium">
          Булки
        </li>
        <div className={burgerIngredientsStyles.constructor__elements_wrapper}>
          {bunsData.map((bun) => (
            <Ingredient
              key={bun._id}
              item={bun}
              handleIngredientDetailsOpen={handleIngredientDetailsOpen}
            />
          ))}
        </div>
        <li ref={saucesRef} className="text text_type_main-medium">
          Соусы
        </li>
        <div className={burgerIngredientsStyles.constructor__elements_wrapper}>
          {saucesData.map((sauce) => (
            <Ingredient
              key={sauce._id}
              item={sauce}
              handleIngredientDetailsOpen={handleIngredientDetailsOpen}
            />
          ))}
        </div>
        <li ref={mainsRef} className="text text_type_main-medium">
          Начинки
        </li>
        <div className={burgerIngredientsStyles.constructor__elements_wrapper}>
          {mainsData.map((main) => (
            <Ingredient
              key={main._id}
              item={main}
              handleIngredientDetailsOpen={handleIngredientDetailsOpen}
            />
          ))}
        </div>
      </ul>
    </section>
  );
}

export { BurgerIngredients };
