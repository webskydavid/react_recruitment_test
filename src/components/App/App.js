import React, { useEffect, useReducer } from 'react';
import Quantity from '../Quantity/Quantity';
import './App.css';

const priceSum = (data) =>
  data
    .map((prod) => Number.parseFloat(prod.price) * prod.quantity)
    .reduce((prev, curr) => prev + curr, 0);

const initialState = {
  cart: [],
  loading: false,
  sum: 0,
  isChanged: false,
};

const reducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case 'GET':
      return { ...state, cart: payload, isChanged: true };
    case 'LOADING':
      return { ...state, loading: payload };
    case 'SET_QUANTITY':
      return {
        ...state,
        cart: [...state.cart].map((prod) =>
          prod.pid === payload.pid
            ? { ...prod, quantity: payload.quantity }
            : prod
        ),
        isChanged: true,
      };
    case 'CHANGE_SUM':
      return {
        ...state,
        sum: Number.parseFloat(priceSum(state.cart))
          .toFixed(2)
          .replace('.', ','),
        isChanged: false,
      };
    default:
      break;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getCart = async () => {
    dispatch({ type: 'LOADING', payload: true });
    const response = await fetch('api/cart');
    const data = await response.json();
    const result = data.map((product) => ({ ...product, quantity: 1 }));
    dispatch({ type: 'GET', payload: result });
    dispatch({ type: 'LOADING', payload: false });
  };

  const setQuantity = (pid, quantity) => {
    dispatch({ type: 'SET_QUANTITY', payload: { pid, quantity } });
  };

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    dispatch({ type: 'CHANGE_SUM' });
  }, [state.isChanged]);

  return (
    <div className='container'>
      <h3>Lista produktów</h3>
      <ul>
        {!state.loading
          ? state.cart.map(
              ({ pid, min, max, name, isBlocked, price, quantity }) => (
                <li key={pid} data-testid='product' className='row'>
                  <span data-testid='name'>
                    {name}, cena: {price.replace('.', ',')} zł
                  </span>
                  <Quantity
                    pid={pid}
                    min={min}
                    max={max}
                    isBlocked={isBlocked}
                    quantity={quantity}
                    setQuantity={setQuantity}
                  />
                </li>
              )
            )
          : 'Pobieram listę'}
      </ul>
      <span data-testid='price_sum'>Suma zamówienia: {state.sum} zł</span>
    </div>
  );
};

export default App;
