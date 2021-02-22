import React, { useEffect, useState } from 'react';
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
          ? cart.map((product) => (
              <li key={product.pid} data-testid='product' className='row'>
                <span data-testid='name'>
                  {product.name}, cena: {product.price.replace('.', ',')} zł
                </span>
                <div data-testid='quantity'>
                  <button
                    data-testid='decrement'
                    onClick={() => setQuantity('decrement', product.pid)}
                  >
                    -
                  </button>
                  <button
                    data-testid='increment'
                    onClick={() => setQuantity('increment', product.pid)}
                  >
                    +
                  </button>
                  <span data-testid='amount'>
                    Obecnie masz {product.quantity} szt. produktu
                  </span>
                </div>
              </li>
            ))
          : 'Pobieram listę'}
      </ul>
      <span data-testid='price_sum'>Suma zamówienia: {sum} zł</span>
    </div>
  );
};

export default App;
