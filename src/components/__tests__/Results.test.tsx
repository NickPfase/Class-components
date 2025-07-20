import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test-utils/test-utils';
import Results from '../Results';

describe('Results Component', () => {
  const mockItems = [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' },
    { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26' },
  ];

  it('renders loading state', () => {
    render(<Results items={[]} loading={true} error={null} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to fetch Pokemon';
    render(<Results items={[]} loading={false} error={errorMessage} />);

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders empty state when no items are found', () => {
    render(<Results items={[]} loading={false} error={null} />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(
      screen.getByText('Try searching for a different Pokemon name.')
    ).toBeInTheDocument();
  });

  it('renders list of items when data is available', () => {
    render(<Results items={mockItems} loading={false} error={null} />);

    expect(screen.getByText('Search Results (2 found)')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Raichu')).toBeInTheDocument();
  });

  it('renders correct number of ItemCard components', () => {
    render(<Results items={mockItems} loading={false} error={null} />);

    const itemCards = screen.getAllByTestId('item-card');
    expect(itemCards).toHaveLength(2);
  });
});
