import { render, screen } from '@testing-library/react';
import App from './App';

test('renders initial status message for Player X', () => {
  render(<App />);
  const status = screen.getByText(/Player X's turn/i);
  expect(status).toBeInTheDocument();
});
