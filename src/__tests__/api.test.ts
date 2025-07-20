import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pokemonApi, localStorageService } from '../api';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  store: {} as { [key: string]: string },
  getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  clear: vi.fn(() => {
    mockLocalStorage.store = {};
  }),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchPokemon', () => {
    const mockResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' },
        { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26' },
      ],
    };

    it('fetches Pokemon without search term', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await pokemonApi.searchPokemon('');
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=20'
      );
    });

    it('fetches and filters Pokemon with search term', async () => {
      const allPokemon = {
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' },
          { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26' },
          { name: 'sandshrew', url: 'https://pokeapi.co/api/v2/pokemon/27' },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(allPokemon),
      });

      const result = await pokemonApi.searchPokemon('chu');
      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe('pikachu');
      expect(result.results[1].name).toBe('raichu');
    });

    it('handles HTTP error in search', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(pokemonApi.searchPokemon('')).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });
  });

  describe('getPokemonDetails', () => {
    const mockDetails = {
      id: 25,
      name: 'pikachu',
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }],
      height: 4,
      weight: 60,
    };

    it('fetches Pokemon details successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetails),
      });

      const result = await pokemonApi.getPokemonDetails(
        'https://pokeapi.co/api/v2/pokemon/25'
      );
      expect(result).toEqual(mockDetails);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/25'
      );
    });

    it('handles HTTP error in details fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(
        pokemonApi.getPokemonDetails('https://pokeapi.co/api/v2/pokemon/9999')
      ).rejects.toThrow('HTTP error! status: 404');
    });
  });
});

describe('localStorageService', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('gets search term from localStorage', () => {
    mockLocalStorage.setItem('searchTerm', 'pikachu');
    expect(localStorageService.getSearchTerm()).toBe('pikachu');
  });

  it('returns empty string when no search term is stored', () => {
    expect(localStorageService.getSearchTerm()).toBe('');
  });

  it('sets search term in localStorage', () => {
    localStorageService.setSearchTerm('pikachu');
    expect(mockLocalStorage.getItem('searchTerm')).toBe('pikachu');
  });
});
