import React, { createContext, useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    const response = await fetch('api/cart');
    const data = await response.json();
    setCart(data);
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
                  {product.name}, cena: {product.price}
                </span>
                <div>+</div>
                <div>-</div>
              </li>
            ))
          : 'Pobieram listę'}
      </ul>
    </div>
  );
};

export default App;
