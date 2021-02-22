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
                <span data-testid='name'>
                  {product.name}, cena: {product.price.replace('.', ',')} zł
                </span>
                <div data-testid='quantity'>
                  <button data-testid='decrement'>-</button>
                  <button data-testid='increment'>+</button>
                  <span data-testid='amount'>Obecnie masz 1 szt. produktu</span>
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
