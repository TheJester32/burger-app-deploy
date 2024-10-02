import React from 'react';
import orderDetailsStyles from './orderDetails.module.css';
import doneImage from '../../../images/done.png';

interface OrderDetailsProps {
  orderNumber: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderNumber }) => {
  return (
    <div className={orderDetailsStyles.ingredients__modal_wrapper}>
      <div className={orderDetailsStyles.ingredients__modal_inner}>
        <h3 className="text text_type_digits-large p-10" data-cy="order-number">{orderNumber}</h3>
        <p className='text text_type_main-medium p-4'>идентификатор заказа</p>
        <img
          className={orderDetailsStyles.ingredients__modal_inner_done}
          src={doneImage}
          alt="Иконка готово."
        />
        <p className="text text_type_main-small p-2">Ваш заказ начали готовить</p>
        <p className="text text_type_main-small text_color_inactive p-2">Дождитесь готовности на орбитальной станции</p>
      </div>
    </div>
  );
};

export default OrderDetails;