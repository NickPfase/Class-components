import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils/test-utils';
import Search from '../Search';

describe('Search Component', () => {
  const defaultProps = {
    searchTerm: '',
    loading: false,
    onSearch: vi.fn(),
  };

  it('renders search input and button', () => {
    render(<Search {...defaultProps} />);

    expect(
      screen.getByPlaceholderText('Search Pokemon...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    render(<Search {...defaultProps} loading={true} />);

    expect(
      screen.getByRole('button', { name: 'Searching...' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('updates input value when user types', () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search Pokemon...');

    fireEvent.change(input, { target: { value: 'pikachu' } });

    expect(input).toHaveValue('pikachu');
  });

  it('calls onSearch with trimmed value when form is submitted', () => {
    const onSearch = vi.fn();
    render(<Search {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search Pokemon...');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: '  pikachu  ' } });
    if (form) {
      fireEvent.submit(form);
    } else {
      throw new Error('Form element not found');
    }

    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('calls onSearch with trimmed value when search button is clicked', () => {
    const onSearch = vi.fn();
    render(<Search {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search Pokemon...');
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(input, { target: { value: '  pikachu  ' } });
    fireEvent.click(button);

    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('updates input value when searchTerm prop changes', () => {
    const { rerender } = render(
      <Search {...defaultProps} searchTerm="pikachu" />
    );
    expect(screen.getByPlaceholderText('Search Pokemon...')).toHaveValue(
      'pikachu'
    );

    rerender(<Search {...defaultProps} searchTerm="charizard" />);
    expect(screen.getByPlaceholderText('Search Pokemon...')).toHaveValue(
      'charizard'
    );
  });

  it('prevents default form submission', () => {
    const onSearch = vi.fn();
    render(<Search {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search Pokemon...');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'pikachu' } });

    // Create a submit event with a preventDefault spy
    const submitEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

    // Dispatch the event
    form?.dispatchEvent(submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });
});
