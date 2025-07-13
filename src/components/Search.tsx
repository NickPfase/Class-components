import React, { Component } from 'react';
import { SearchProps } from '../types';

interface SearchState {
  inputValue: string;
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      inputValue: props.searchTerm,
    };
  }

  componentDidUpdate(prevProps: SearchProps): void {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.setState({ inputValue: this.props.searchTerm });
    }
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inputValue: event.target.value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedValue = this.state.inputValue.trim();
    this.props.onSearch(trimmedValue);
  };

  handleButtonClick = (): void => {
    const trimmedValue = this.state.inputValue.trim();
    this.props.onSearch(trimmedValue);
  };

  render(): React.ReactNode {
    return (
      <div className="top-section">
        <form onSubmit={this.handleSubmit}>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Pokemon..."
              value={this.state.inputValue}
              onChange={this.handleInputChange}
            />
            <button
              type="button"
              className="search-button"
              onClick={this.handleButtonClick}
              disabled={this.props.loading}
            >
              {this.props.loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Search;
