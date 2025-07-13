import React, { Component } from 'react';
import { ItemCardProps } from '../types';
import { pokemonApi } from '../api';
import { PokemonDetails } from '../types';

interface ItemCardState {
  details: PokemonDetails | null;
  loading: boolean;
}

class ItemCard extends Component<ItemCardProps, ItemCardState> {
  constructor(props: ItemCardProps) {
    super(props);
    this.state = {
      details: null,
      loading: false,
    };
  }

  async componentDidMount(): Promise<void> {
    this.setState({ loading: true });
    try {
      const details = await pokemonApi.getPokemonDetails(this.props.item.url);
      this.setState({ details, loading: false });
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      this.setState({ loading: false });
    }
  }

  render(): React.ReactNode {
    const { item } = this.props;
    const { details, loading } = this.state;

    const formatName = (name: string): string => {
      return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const getDescription = (): string => {
      if (loading) return 'Loading details...';
      if (!details) return 'Unable to load details';

      const types = details.types.map((t) => t.type.name).join(', ');
      const abilities = details.abilities.map((a) => a.ability.name).join(', ');

      return `Type: ${types} | Abilities: ${abilities} | Height: ${details.height / 10}m | Weight: ${details.weight / 10}kg`;
    };

    return (
      <div className="item-card">
        <div className="item-name">{formatName(item.name)}</div>
        <div className="item-description">{getDescription()}</div>
      </div>
    );
  }
}

export default ItemCard;
