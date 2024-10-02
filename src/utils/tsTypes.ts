export interface ingredientType {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  uuid?: string;
}

export interface BurgerConstructorProps {
  data: ingredientType[];
  handleIngredientDetailsOpen: (ingredient: ingredientType) => void;
}

export interface BurgerIngredientsProps {
  data: ingredientType[];
  handleOrderDetailsOpen: () => void;
  handleIngredientDrop: (id: string) => void;
}