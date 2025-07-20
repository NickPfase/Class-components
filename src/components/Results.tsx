import React, { Component } from 'react';
import { ResultsProps } from '../types';
import ItemCard from './ItemCard';

class Results extends Component<ResultsProps> {
  render(): React.ReactNode {
    const { items, loading, error } = this.props;

    if (loading) {
      return (
        <div className="results-section">
          <div className="loading">
            <div className="spinner" data-testid="spinner"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="results-section">
          <div className="error">
            <h3>Error occurred</h3>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="results-section">
          <div className="error">
            <h3>No results found</h3>
            <p>Try searching for a different Pokemon name.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="results-section">
        <h2>Search Results ({items.length} found)</h2>
        <div className="item-list">
          {items.map((item) => (
            <ItemCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    );
  }
}

export default Results;
