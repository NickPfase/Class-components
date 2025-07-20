import {
  render as rtlRender,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';

function render(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui),
  };
}

export { render, screen, fireEvent, waitFor, act };
