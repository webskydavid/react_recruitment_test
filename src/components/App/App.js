import React, { useEffect, useState } from 'react';
import Quantity from '../Quantity/Quantity';
import './App.css';

const priceSum = (data, sum) =>
  data
    .map((prod) => Number.parseFloat(prod.price) * prod.quantity)
    .reduce((prev, curr) => prev + curr, sum);

const App = () => {
  const [change, setChange] = useState(false);
  const [cart, setCart] = useState([]);
  const [sum, setSum] = useState(0);

  const getCart = async () => {
    const response = await fetch('api/cart');
    const data = await response.json();
    const result = data.map((product) => ({ ...product, quantity: 1 }));
    setCart(result);
    setSum((s) => priceSum([...result], s));
  };

  const setQuantity = (type, pid) => {
    setChange(true);
    setCart((s) => [
      ...s.map((prod) => {
        if (prod.pid === pid) {
          const quantity =
            type === 'increment' ? prod.quantity + 1 : prod.quantity - 1;
          return { ...prod, quantity };
        }
        return prod;
      }),
    ]);
  };

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (cart.length > 0 && change) {
      setSum(() => priceSum(cart, 0));
    }
  }, [cart, change]);

  return (
    <div className='container'>
      <h3>Lista produktów</h3>
      <ul>
        {cart.length
          ? cart.map(({ pid, min, max, name, isBlocked, price, quantity }) => (
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
            ))
          : 'Pobieram listę'}
      </ul>
      <span data-testid='price_sum'>Suma zamówienia: {sum} zł</span>
    </div>
  );
};

export default App;
