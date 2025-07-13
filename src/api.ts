import { PokemonResponse, PokemonDetails } from './types';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  async searchPokemon(searchTerm: string = '', limit: number = 20): Promise<PokemonResponse> {
    const url = `${API_BASE_URL}/pokemon?limit=${limit}`;

    if (searchTerm) {
      // For search, we'll get all Pokemon and filter by name
      // Note: Pokemon API doesn't support search directly, so we'll use a workaround
      const allPokemonResponse = await fetch(`${API_BASE_URL}/pokemon?limit=1000`);

      if (!allPokemonResponse.ok) {
        throw new Error(`HTTP error! status: ${allPokemonResponse.status}`);
      }

      const allData: PokemonResponse = await allPokemonResponse.json();
      const filteredResults = allData.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        count: filteredResults.length,
        next: null,
        previous: null,
        results: filteredResults.slice(0, limit),
      };
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getPokemonDetails(url: string): Promise<PokemonDetails> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export const localStorageService = {
  getSearchTerm(): string {
    return localStorage.getItem('searchTerm') || '';
  },

  setSearchTerm(term: string): void {
    localStorage.setItem('searchTerm', term);
  },
};
