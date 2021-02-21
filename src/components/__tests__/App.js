import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App/App';

afterEach(() => cleanup);

test('should render list with products', () => {
  const app = render(<App />);

  expect(app.getByText(/lista produktów/i)).toBeInTheDocument();
  expect(
    app.getAllByTestId('product').map((prod) => prod.textContent)
  ).toEqual(['Patelnia, cena: 89,99zł']);
});
