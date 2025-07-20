export interface PokemonItem {
  name: string;
  url: string;
}

export interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonItem[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
}

export interface AppState {
  searchTerm: string;
  items: PokemonItem[];
  loading: boolean;
  error: string | null;
}

export interface SearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  loading: boolean;
}

export interface ResultsProps {
  items: PokemonItem[];
  loading: boolean;
  error: string | null;
}

export interface ItemCardProps {
  item: PokemonItem;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
