import { describe, it, expect } from 'vitest';
import type {
  AppState,
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ItemCardProps,
  PokemonDetails,
  PokemonResponse,
  ResultsProps,
  SearchProps,
} from '../types';

describe('Types', () => {
  it('AppState type has correct properties', () => {
    const state: AppState = {
      searchTerm: 'pikachu',
      items: [],
      loading: false,
      error: null,
    };
    expect(state).toHaveProperty('searchTerm');
    expect(state).toHaveProperty('items');
    expect(state).toHaveProperty('loading');
    expect(state).toHaveProperty('error');
  });

  it('ErrorBoundaryProps type has correct properties', () => {
    const props: ErrorBoundaryProps = {
      children: null,
    };
    expect(props).toHaveProperty('children');
  });

  it('ErrorBoundaryState type has correct properties', () => {
    const state: ErrorBoundaryState = {
      hasError: false,
      error: null,
    };
    expect(state).toHaveProperty('hasError');
    expect(state).toHaveProperty('error');
  });

  it('ItemCardProps type has correct properties', () => {
    const props: ItemCardProps = {
      item: {
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25',
      },
    };
    expect(props).toHaveProperty('item');
    expect(props.item).toHaveProperty('name');
    expect(props.item).toHaveProperty('url');
  });

  it('PokemonDetails type has correct properties', () => {
    const details: PokemonDetails = {
      id: 25,
      name: 'pikachu',
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }],
      height: 4,
      weight: 60,
    };
    expect(details).toHaveProperty('id');
    expect(details).toHaveProperty('name');
    expect(details).toHaveProperty('types');
    expect(details).toHaveProperty('abilities');
    expect(details).toHaveProperty('height');
    expect(details).toHaveProperty('weight');
  });

  it('PokemonResponse type has correct properties', () => {
    const response: PokemonResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25',
        },
      ],
    };
    expect(response).toHaveProperty('count');
    expect(response).toHaveProperty('next');
    expect(response).toHaveProperty('previous');
    expect(response).toHaveProperty('results');
  });

  it('ResultsProps type has correct properties', () => {
    const props: ResultsProps = {
      items: [],
      loading: false,
      error: null,
    };
    expect(props).toHaveProperty('items');
    expect(props).toHaveProperty('loading');
    expect(props).toHaveProperty('error');
  });

  it('SearchProps type has correct properties', () => {
    const props: SearchProps = {
      searchTerm: 'pikachu',
      onSearch: () => {},
      loading: false,
    };
    expect(props).toHaveProperty('searchTerm');
    expect(props).toHaveProperty('onSearch');
    expect(props).toHaveProperty('loading');
  });
});
