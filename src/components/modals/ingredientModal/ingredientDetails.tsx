import React from 'react';
import ingredientDetailsStyles from './ingredientDetails.module.css';
import { ingredientType } from '../../../utils/tsTypes';

interface IngredientDetailsProps {
  ingredient: ingredientType;
}

function IngredientDetails({ ingredient }: IngredientDetailsProps) {
  if (!ingredient) {
    return <p>Ингредиент не найден</p>;
  }

  return (
    <div className={`${ingredientDetailsStyles.constructor__modal_wrapper}`}>
      <h3 className='text text_type_main-large'>Детали ингредиента</h3>
      <div className={ingredientDetailsStyles.constructor__modal_inner}>
        <img src={ingredient.image_large} alt={ingredient.name} />
        <p className='text text_type_main-medium'>{ingredient.name}</p>
        <div className={ingredientDetailsStyles.constructor__modal_inner_description_wrapper}>
          <div>
            <p className="text text_type_main-default text_color_inactive">Калории,ккал</p>
            <p className="text text_type_digits-default text_color_inactive p-4">{ingredient.calories}</p>
          </div>
          <div>
            <p className="text text_type_main-default text_color_inactive">Белки, г</p>
            <p className="text text_type_digits-default text_color_inactive  p-4">{ingredient.proteins}</p>
          </div>
          <div>
            <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
            <p className="text text_type_digits-default text_color_inactive  p-4">{ingredient.fat}</p>
          </div>
          <div>
            <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
            <p className="text text_type_digits-default text_color_inactive  p-4">{ingredient.carbohydrates}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngredientDetails;