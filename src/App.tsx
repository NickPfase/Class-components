import React, { Component } from 'react';
import { AppState } from './types';
import { pokemonApi, localStorageService } from './api';
import ErrorBoundary from './components/ErrorBoundary';
import Search from './components/Search';
import Results from './components/Results';

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: '',
      items: [],
      loading: false,
      error: null,
    };
  }

  async componentDidMount(): Promise<void> {
    const savedSearchTerm = localStorageService.getSearchTerm();
    this.setState({ searchTerm: savedSearchTerm });
    await this.performSearch(savedSearchTerm);
  }

  performSearch = async (searchTerm: string): Promise<void> => {
    this.setState({ loading: true, error: null });

    try {
      const response = await pokemonApi.searchPokemon(searchTerm);
      this.setState({
        items: response.results,
        loading: false,
        searchTerm,
      });
    } catch (error) {
      this.setState({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false,
        items: [],
      });
    }
  };

  handleSearch = (searchTerm: string): void => {
    localStorageService.setSearchTerm(searchTerm);
    this.performSearch(searchTerm);
  };

  throwError = (): void => {
    throw new Error('Test error for Error Boundary');
  };

  render(): React.ReactNode {
    const { searchTerm, items, loading, error } = this.state;

    return (
      <ErrorBoundary>
        <div className="container">
          <h1>Pokemon Search</h1>
          <Search
            searchTerm={searchTerm}
            onSearch={this.handleSearch}
            loading={loading}
          />
          <Results items={items} loading={loading} error={error} />
          <button className="error-button" onClick={this.throwError}>
            Test Error Boundary
          </button>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
