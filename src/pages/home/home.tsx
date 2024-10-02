import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";
import { BurgerIngredients } from "../../components/burgerIngredients/burgerIngredients";
import { BurgerConstructor } from "../../components/burgerConstructor/burgerConstructor";
import Modal from "../../components/modals/modal";
import appStyles from "../../components/app/app.module.css";
import IngredientDetails from "../../components/modals/ingredientModal/ingredientDetails";
import OrderDetails from "../../components/modals/orderModal/orderDetails";
import {
  setViewedIngredient,
  createOrder,
  setBun,
  addConstructorIngredient,
  removeConstructorIngredient,
  reorderConstructorIngredients,
  resetOrderNumber,
  clearConstructor,
} from "../../services/reducers/ingredientsSlice";
import { ingredientType } from "../../utils/tsTypes";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const {
    allIngredients,
    buns,
    constructorIngredients,
    viewedIngredient,
    orderNumber,
    loading,
    error,
  } = useAppSelector((state) => state.ingredients);

  const navigate = useNavigate();
  const location = useLocation();

  const handleIngredientDetailsOpen = (ingredient: ingredientType | null) => {
    if (ingredient) {
      const ingredientPath = `/ingredients/${ingredient._id}`;

      localStorage.setItem("viewedIngredient", JSON.stringify(ingredient));

      if (location.pathname === ingredientPath) {
        dispatch(setViewedIngredient(ingredient));
      } else {
        dispatch(setViewedIngredient(ingredient));
        navigate(ingredientPath, { state: { modal: true } });
      }
    } else {
      console.error("Ingredient is undefined");
    }
  };

  useEffect(() => {
    const savedIngredient = localStorage.getItem("viewedIngredient");

    if (savedIngredient) {
      const ingredient = JSON.parse(savedIngredient) as ingredientType;
      dispatch(setViewedIngredient(ingredient));
      navigate(`/ingredients/${ingredient._id}`, { state: { modal: true } });
    }
  }, [dispatch, navigate]);

  const handleIngredientDetailsClose = () => {
    dispatch(setViewedIngredient(null));
    localStorage.removeItem("viewedIngredient");
    navigate("/");
  };

  const handleOrderDetailsOpen = () => {
    let ingredients = [...buns, ...constructorIngredients];
    if (buns.length > 0) {
      ingredients = [...ingredients, buns[0]];
    }
    dispatch(createOrder(ingredients)).then((action) => {
      if (createOrder.fulfilled.match(action)) {
        dispatch(clearConstructor());
      }
    });
  };

  const handleIngredientDrop = (id: string) => {
    const ingredient = allIngredients.find((ing) => ing._id === id);
    if (ingredient) {
      const ingredientWithUUID = { ...ingredient, uuid: uuidv4() };
      if (ingredient.type === "bun") {
        dispatch(setBun(ingredientWithUUID));
      } else {
        dispatch(addConstructorIngredient(ingredientWithUUID));
      }
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeConstructorIngredient(id));
  };

  const handleReorder = (fromIndex: any, toIndex: any) => {
    dispatch(reorderConstructorIngredients({ fromIndex, toIndex }));
  };

  const { isAuthentficated } = useAppSelector((state) => state.user);

  return (
    <>
      {loading && (
        <div className={appStyles.loading_window}>
          <div className={appStyles.spinner}></div>
        </div>
      )}
      {error && <div>Ошибка: {error}</div>}
      {allIngredients.length > 0 && (
        <>
          <main className={appStyles.main}>
            <div className={appStyles.main__inner_content}>
              <BurgerIngredients
                data={allIngredients}
                handleIngredientDetailsOpen={handleIngredientDetailsOpen}
              />
              <BurgerConstructor
                data={[...buns, ...constructorIngredients]}
                handleOrderDetailsOpen={handleOrderDetailsOpen}
                handleIngredientDrop={handleIngredientDrop}
                handleRemove={handleRemove}
                handleReorder={handleReorder}
                isAuthentficated={isAuthentficated}
              />
              {viewedIngredient && (
                <Modal
                  isOpen={Boolean(viewedIngredient)}
                  handleClose={handleIngredientDetailsClose}
                >
                  <IngredientDetails ingredient={viewedIngredient} />
                </Modal>
              )}
              {orderNumber && (
                <Modal
                  isOpen={Boolean(orderNumber)}
                  handleClose={() => dispatch(resetOrderNumber())}
                >
                  <OrderDetails orderNumber={orderNumber} />
                </Modal>
              )}
            </div>
          </main>
        </>
      )}
    </>
  );
};
