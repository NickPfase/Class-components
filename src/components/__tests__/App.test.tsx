import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '../../test-utils/test-utils';
import App from '../../App';
import { pokemonApi, localStorageService } from '../../api';
import { PokemonResponse } from '../../types';

// Mock the API and localStorage service
vi.mock('../../api', () => ({
  pokemonApi: {
    searchPokemon: vi.fn(),
    getPokemonDetails: vi.fn(),
  },
  localStorageService: {
    getSearchTerm: vi.fn(),
    setSearchTerm: vi.fn(),
  },
}));

describe('App Component', () => {
  const mockPokemonResponse = {
    count: 2,
    next: null,
    previous: null,
    results: [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' },
      { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(localStorageService.getSearchTerm).mockReturnValue('');
    vi.mocked(pokemonApi.searchPokemon).mockResolvedValue(mockPokemonResponse);
    vi.mocked(pokemonApi.getPokemonDetails).mockResolvedValue({
      id: 25,
      name: 'pikachu',
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }],
      height: 4,
      weight: 60,
    });
  });

  it('renders initial state correctly', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Pokemon Search')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search Pokemon...')
    ).toBeInTheDocument();
    expect(screen.getByText('Test Error Boundary')).toBeInTheDocument();
  });

  it('loads saved search term from localStorage on mount', async () => {
    vi.mocked(localStorageService.getSearchTerm).mockReturnValue('pikachu');

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByPlaceholderText('Search Pokemon...')).toHaveValue(
      'pikachu'
    );
    expect(pokemonApi.searchPokemon).toHaveBeenCalledWith('pikachu');
  });

  it('performs search and updates state', async () => {
    await act(async () => {
      render(<App />);
    });

    const searchInput = screen.getByPlaceholderText('Search Pokemon...');
    const searchButton = screen.getByRole('button', { name: 'Search' });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'pikachu' } });
      fireEvent.click(searchButton);
    });

    expect(localStorageService.setSearchTerm).toHaveBeenCalledWith('pikachu');
    expect(pokemonApi.searchPokemon).toHaveBeenCalledWith('pikachu');

    await waitFor(() => {
      expect(screen.getByText('Search Results (2 found)')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    vi.mocked(pokemonApi.searchPokemon).mockRejectedValue(
      new Error('API Error')
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('shows loading state during search', async () => {
    let resolvePromise: (value: PokemonResponse) => void;
    const searchPromise = new Promise<PokemonResponse>((resolve) => {
      resolvePromise = resolve;
    });

    // First render with initial data
    await act(async () => {
      render(<App />);
    });

    // Wait for initial render to complete
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Search' })
      ).toBeInTheDocument();
    });

    // Mock the next search to be pending
    vi.mocked(pokemonApi.searchPokemon).mockImplementation(() => searchPromise);

    const searchInput = screen.getByPlaceholderText('Search Pokemon...');
    const searchButton = screen.getByRole('button', { name: 'Search' });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    });

    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Searching...' })
    ).toBeInTheDocument();

    // Resolve the promise to clean up
    await act(async () => {
      resolvePromise(mockPokemonResponse);
    });
  });
});
