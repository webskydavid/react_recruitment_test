import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  cleanup,
  fireEvent,
  getByTestId,
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
    max: 4,
    min: 1,
  },
  {
    pid: '993c12b2-e662-4af7-b0bc-fef5c1d47720',
    name: 'Garnek mały',
    price: '29.99',
    max: 1,
    min: 1,
    isBlocked: true,
  },
];

const response = (isError, success, message, errorType) => ({
  isError,
  success,
  message,
  errorType,
});

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
  expect(screen.getByText(/Suma zamówienia: 0,00 zł/i)).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.getByText(/pobieram listę/i));

  expect(screen.getAllByTestId('name').map((elem) => elem.textContent)).toEqual(
    mockData.map(
      (data) => `${data.name}, cena: ${data.price.replace('.', ',')} zł`
    )
  );

  const priceSum = `Suma zamówienia: ${(
    Number.parseFloat(mockData[0].price) + Number.parseFloat(mockData[1].price)
  )
    .toFixed(2)
    .replace('.', ',')} zł`;

  await waitFor(() =>
    expect(screen.getByTestId('price_sum').textContent).toEqual(priceSum)
  );
});

test('change increment and decrement "disabled" status', async () => {
  render(<App />);
  const quantity = await waitFor(() => screen.getAllByTestId('quantity'));

  expect(getByTestId(quantity[0], 'decrement')).not.toHaveAttribute('disabled');
  expect(getByTestId(quantity[0], 'increment')).not.toHaveAttribute('disabled');
  expect(getByTestId(quantity[0], 'amount').textContent).toEqual(
    'Obecnie masz 1 szt. produktu'
  );

  expect(getByTestId(quantity[1], 'decrement')).toHaveAttribute('disabled');
  expect(getByTestId(quantity[1], 'increment')).toHaveAttribute('disabled');
  expect(getByTestId(quantity[1], 'amount').textContent).toEqual(
    'Obecnie masz 1 szt. produktu'
  );
});

describe('invalid api response', () => {
  beforeEach(() => {
    server.use(
      rest.post('/api/product/check', (req, res, ctx) => {
        return res(ctx.json(response(true, false, 'INVALID', 'ERROR')));
      })
    );
  });

  test('change quantity above "max" value', async () => {
    render(<App />);
    const quantity = await waitFor(() => screen.getAllByTestId('quantity'));

    expect(getByTestId(quantity[0], 'amount').textContent).toEqual(
      'Obecnie masz 1 szt. produktu'
    );

    fireEvent.click(getByTestId(quantity[0], 'increment'));

    await waitFor(() =>
      expect(getByTestId(quantity[0], 'amount').textContent).toEqual(
        `Obecnie masz ${mockData[0].min} szt. produktu`
      )
    );
  });
});

describe('valid api response', () => {
  beforeEach(() => {
    server.use(
      rest.post('/api/product/check', (req, res, ctx) => {
        return res(ctx.json(response(false, true, 'VALID', '')));
      })
    );
  });

  test('change quantity of first product', async () => {
    render(<App />);
    const quantity = await waitFor(() => screen.getAllByTestId('quantity'));

    expect(getByTestId(quantity[0], 'decrement')).toBeInTheDocument();
    expect(getByTestId(quantity[0], 'increment')).toBeInTheDocument();
    expect(getByTestId(quantity[0], 'amount').textContent).toEqual(
      'Obecnie masz 1 szt. produktu'
    );

    fireEvent.click(getByTestId(quantity[0], 'increment'));

    await waitFor(() =>
      expect(getByTestId(quantity[0], 'amount').textContent).toEqual(
        'Obecnie masz 2 szt. produktu'
      )
    );

    fireEvent.click(getByTestId(quantity[0], 'increment'));
    fireEvent.click(getByTestId(quantity[0], 'increment'));
    fireEvent.click(getByTestId(quantity[0], 'decrement'));

    await waitFor(() =>
      expect(getByTestId(quantity[0], 'amount').textContent).toEqual(
        'Obecnie masz 3 szt. produktu'
      )
    );

    const priceSum =
      Number.parseFloat(mockData[0].price) * 3 +
      Number.parseFloat(mockData[1].price);

    await waitFor(() =>
      expect(screen.getByTestId('price_sum').textContent).toEqual(
        `Suma zamówienia: ${priceSum.toFixed(2).replace('.', ',')} zł`
      )
    );
  });
});
