import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [cart, setCart] = useState([]);
  const [sum, setSum] = useState(0);

  const getCart = async () => {
    const response = await fetch('api/cart');
    const data = await response.json();
    const priceSum = data.reduce(
      (prev, curr) => prev + Number.parseInt(curr.price),
      sum
    );
    setCart(data);
    setSum(priceSum);
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className='container'>
      <h3>Lista produktów</h3>
      <ul>
        {cart.length
          ? cart.map((product) => (
              <li key={product.pid} data-testid='product' className='row'>
                <span>
                  {product.name}, cena: {product.price.replace('.', ',')} zł
                </span>
                <div>-</div>
                <div>+</div>
              </li>
            ))
          : 'Pobieram listę'}
      </ul>
      <span data-testid='price_sum'>Suma zamówienia: {sum} zł</span>
    </div>
  );
};

export default App;
