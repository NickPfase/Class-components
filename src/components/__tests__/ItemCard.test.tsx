import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '../../test-utils/test-utils';
import ItemCard from '../ItemCard';
import { pokemonApi } from '../../api';
import { PokemonDetails } from '../../types';

// Mock the API module
vi.mock('../../api', () => ({
  pokemonApi: {
    getPokemonDetails: vi.fn(),
  },
}));

describe('ItemCard Component', () => {
  const mockItem = {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/25',
  };

  const mockPokemonDetails: PokemonDetails = {
    id: 25,
    name: 'pikachu',
    types: [{ type: { name: 'electric' } }],
    abilities: [
      { ability: { name: 'static' } },
      { ability: { name: 'lightning-rod' } },
    ],
    height: 40,
    weight: 60,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders item name with proper capitalization', async () => {
    await act(async () => {
      render(<ItemCard item={mockItem} />);
    });
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('shows loading state while fetching details', async () => {
    vi.mocked(pokemonApi.getPokemonDetails).mockImplementation(
      () => new Promise(() => {})
    );
    await act(async () => {
      render(<ItemCard item={mockItem} />);
    });
    expect(screen.getByText('Loading details...')).toBeInTheDocument();
  });

  it('displays pokemon details after successful API call', async () => {
    vi.mocked(pokemonApi.getPokemonDetails).mockResolvedValue(
      mockPokemonDetails
    );
    await act(async () => {
      render(<ItemCard item={mockItem} />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Type: electric/)).toBeInTheDocument();
      expect(
        screen.getByText(/Abilities: static, lightning-rod/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Height: 4m/)).toBeInTheDocument();
      expect(screen.getByText(/Weight: 6kg/)).toBeInTheDocument();
    });
  });

  it('shows error message when API call fails', async () => {
    vi.mocked(pokemonApi.getPokemonDetails).mockRejectedValue(
      new Error('API Error')
    );
    await act(async () => {
      render(<ItemCard item={mockItem} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Unable to load details')).toBeInTheDocument();
    });
  });

  it('calls API with correct URL on mount', async () => {
    await act(async () => {
      render(<ItemCard item={mockItem} />);
    });
    expect(pokemonApi.getPokemonDetails).toHaveBeenCalledWith(mockItem.url);
  });
});
