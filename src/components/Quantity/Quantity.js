import React from 'react';
import { string, bool, number, func } from 'prop-types';

const Quantity = ({ pid, min, max, isBlocked, quantity, setQuantity }) => {
  return (
    <div data-testid='quantity'>
      <button
        disabled={isBlocked ? true : false}
        data-testid='decrement'
        onClick={() => setQuantity('decrement', pid)}
      >
        -
      </button>
      <button
        disabled={isBlocked ? true : false}
        data-testid='increment'
        onClick={() => setQuantity('increment', pid)}
      >
        +
      </button>
      <span data-testid='amount'>Obecnie masz {quantity} szt. produktu</span>
    </div>
  );
};

Quantity.propTypes = {
  pid: string.isRequired,
  min: number.isRequired,
  max: number.isRequired,
  quantity: number.isRequired,
  setQuantity: func.isRequired,
  isBlocked: bool,
};

export default Quantity;
