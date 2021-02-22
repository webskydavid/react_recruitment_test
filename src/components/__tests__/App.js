import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  cleanup,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App/App';

const mockData = [
  {
    pid: '8e5e1248-c799-4937-9acc-2b3ab0e034ff',
    name: 'Patelnia',
    price: '89.99',
    max: 10,
    min: 1,
  },
  {
    pid: '993c12b2-e662-4af7-b0bc-fef5c1d47720',
    name: 'Garnek mały',
    price: '29.99',
    max: 10,
    min: 1,
  },
];

const server = setupServer(
  rest.get('/api/cart', (req, res, ctx) => {
    return res(ctx.json(mockData));
  })
);

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());

test('render list with products', async () => {
  render(<App />);

  expect(screen.getByText(/lista produktów/i)).toBeInTheDocument();
  expect(screen.getByText(/pobieram listę/i)).toBeInTheDocument();
  expect(screen.getByText(/Suma zamówienia: 0 zł/i)).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.getByText(/pobieram listę/i));

  mockData.map((prod) => {
    expect(
      screen.getByText(`${prod.name}, cena: ${prod.price.replace('.', ',')} zł`)
    ).toBeInTheDocument();
  });

  const priceSum = `Suma zamówienia: ${
    Number.parseInt(mockData[0].price) + Number.parseInt(mockData[1].price)
  } zł`;

  await waitFor(() =>
    expect(screen.getByTestId('price_sum').textContent).toEqual(priceSum)
  );

  screen.debug();
});

test('change product amount', async () => {
  render(<App />);

  expect(screen.getByTestId('increment_1')).toBeInTheDocument();

  screen.debug();
});
