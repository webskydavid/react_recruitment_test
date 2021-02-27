import React, { memo, useEffect, useState } from 'react';
import { string, bool, number, func } from 'prop-types';
import './Quantity.css';

const useDebounce = (checkValue, time) => {
  const [debounce, setDebounce] = useState(checkValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(checkValue);
    }, time);
    return () => {
      clearTimeout(timer);
    };
  }, [checkValue]);

  return debounce;
};

const Quantity = ({ pid, quantity, setQuantity, min, max, isBlocked }) => {
  const [productQuantity, setProductQuantity] = useState(quantity);
  const debounce = useDebounce(productQuantity, 500);

  const checkProduct = async () => {
    const response = await fetch('api/product/check', {
      method: 'POST',
      body: JSON.stringify({ pid, quantity: productQuantity }),
    });
    const data = await response.json();

    if (data.success) {
      setQuantity(pid, productQuantity);
    } else {
      setQuantity(pid, min);
      setProductQuantity(min);
    }
  };

  useEffect(() => {
    if (debounce !== quantity) {
      checkProduct();
    }
  }, [debounce]);

  return (
    <div data-testid='quantity'>
      <button
        className='decrement'
        disabled={isBlocked ? true : false}
        data-testid='decrement'
        onClick={() => setProductQuantity((s) => s - 1)}
      >
        -
      </button>
      <button
        className='increment'
        disabled={isBlocked ? true : false}
        data-testid='increment'
        onClick={() => setProductQuantity((s) => s + 1)}
      >
        +
      </button>
      <span className='amount' data-testid='amount'>
        Obecnie masz {productQuantity} szt. produktu
      </span>
    </div>
  );
};

Quantity.propTypes = {
  pid: string.isRequired,
  quantity: number.isRequired,
  setQuantity: func.isRequired,
  isBlocked: bool,
  min: number,
  max: number,
};

export default memo(Quantity, (prev, next) => {
  return prev.quantity === next.quantity;
});
