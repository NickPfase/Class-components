import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '../../test-utils/test-utils';
import ErrorBoundary from '../ErrorBoundary';
import PropTypes from 'prop-types';

interface ThrowErrorProps {
  shouldThrow?: boolean;
}

// Create a component that throws an error
const ThrowError: React.FC<ThrowErrorProps> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal content</div>;
};

ThrowError.propTypes = {
  shouldThrow: PropTypes.bool,
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error for cleaner test output
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when child throws error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(
      screen.getByText(
        'An error occurred in the application. Please try refreshing the page.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('logs error to console when error occurs', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('updates error state when error occurs', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(container.querySelector('.error-boundary')).toBeInTheDocument();
    spy.mockRestore();
  });
});
