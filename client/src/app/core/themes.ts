import { CardValue, ThemeId } from './models';

export interface CardArt {
  /** Character shown on the card. */
  name: string;
  image: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  emoji: string;
  available: boolean;
  /** CSS custom properties applied to the room. */
  palette: { primary: string; secondary: string; accent: string; background: string };
  cards: Partial<Record<CardValue, CardArt>>;
}

const pokemonArt = (id: number, name: string): CardArt => ({
  name,
  // Official artwork from PokeAPI/sprites, resized and bundled to avoid hotlinking.
  image: `themes/pokemon/${id}.webp`,
});

/** The bigger the estimate, the more powerful the Pokémon. */
const POKEMON: ThemeDefinition = {
  id: 'pokemon',
  label: 'Pokémon',
  emoji: '⚡',
  available: true,
  palette: { primary: '#ef5350', secondary: '#3b4cca', accent: '#ffde00', background: '#f4f6fb' },
  cards: {
    '0': pokemonArt(129, 'Magicarpe'),
    '1': pokemonArt(10, 'Chenipan'),
    '2': pokemonArt(172, 'Pichu'),
    '3': pokemonArt(25, 'Pikachu'),
    '5': pokemonArt(4, 'Salamèche'),
    '8': pokemonArt(5, 'Reptincel'),
    '13': pokemonArt(6, 'Dracaufeu'),
    '21': pokemonArt(130, 'Léviator'),
    '?': pokemonArt(201, 'Zarbi'),
    '☕': pokemonArt(143, 'Ronflex'),
  },
};

const comingSoon = (id: ThemeId, label: string, emoji: string, primary: string): ThemeDefinition => ({
  id,
  label,
  emoji,
  available: false,
  palette: { primary, secondary: '#333', accent: '#fff', background: '#f4f6fb' },
  cards: {},
});

export const THEMES: ThemeDefinition[] = [
  POKEMON,
  comingSoon('onepiece', 'One Piece', '🏴‍☠️', '#d32f2f'),
  comingSoon('football', 'Footballeurs', '⚽', '#2e7d32'),
  comingSoon('mario', 'Mario', '🍄', '#e53935'),
];

export const themeById = (id: ThemeId): ThemeDefinition => THEMES.find((t) => t.id === id) ?? POKEMON;
