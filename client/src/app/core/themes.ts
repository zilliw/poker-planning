import { CardValue, ThemeId } from './models';

export interface CardArt {
  /** Character shown on the card. */
  name: string;
  /** Illustration shown when no image is available. */
  emoji: string;
  /** Explicit image; see also `ThemeDefinition.bundledImages`. */
  image?: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  emoji: string;
  available: boolean;
  /**
   * True once a face-cropped portrait `client/public/themes/<id>/<slug>.webp` exists for every card;
   * portraits are shown in a round medallion.
   */
  bundledImages?: boolean;
  /** CSS custom properties applied to the room. */
  palette: { primary: string; secondary: string; accent: string; background: string };
  cards: Partial<Record<CardValue, CardArt>>;
}

/** File name of a card image: the value itself, `question` for ? and `coffee` for ☕. */
export const cardSlug = (value: CardValue): string =>
  value === '?' ? 'question' : value === '☕' ? 'coffee' : value;

export const cardImage = (theme: ThemeDefinition, value: CardValue): string | undefined =>
  theme.cards[value]?.image ?? (theme.bundledImages ? `themes/${theme.id}/${cardSlug(value)}.webp` : undefined);

const pokemonArt = (id: number, name: string, emoji: string): CardArt => ({
  name,
  emoji,
  // Official artwork from PokeAPI/sprites, resized and bundled to avoid hotlinking.
  image: `themes/pokemon/${id}.webp`,
});

/** In every theme, the bigger the estimate, the more powerful the character. */
const POKEMON: ThemeDefinition = {
  id: 'pokemon',
  label: 'Pokémon',
  emoji: '⚡',
  available: true,
  palette: { primary: '#ef5350', secondary: '#3b4cca', accent: '#ffde00', background: '#f4f6fb' },
  cards: {
    '0': pokemonArt(129, 'Magicarpe', '🐟'),
    '1': pokemonArt(10, 'Chenipan', '🐛'),
    '2': pokemonArt(172, 'Pichu', '🐭'),
    '3': pokemonArt(25, 'Pikachu', '⚡'),
    '5': pokemonArt(4, 'Salamèche', '🔥'),
    '8': pokemonArt(5, 'Reptincel', '🔥'),
    '13': pokemonArt(6, 'Dracaufeu', '🐉'),
    '21': pokemonArt(130, 'Léviator', '🌊'),
    '?': pokemonArt(201, 'Zarbi', '❓'),
    '☕': pokemonArt(143, 'Ronflex', '😴'),
  },
};

const ONE_PIECE: ThemeDefinition = {
  id: 'onepiece',
  label: 'One Piece',
  emoji: '🏴‍☠️',
  available: true,
  bundledImages: true,
  palette: { primary: '#c62828', secondary: '#1a3a6b', accent: '#f4c542', background: '#fbf3e0' },
  cards: {
    '0': { name: 'Usopp', emoji: '🎯' },
    '1': { name: 'Chopper', emoji: '🦌' },
    '2': { name: 'Baggy', emoji: '🤡' },
    '3': { name: 'Nami', emoji: '🍊' },
    '5': { name: 'Sanji', emoji: '🍳' },
    '8': { name: 'Zoro', emoji: '⚔️' },
    '13': { name: 'Luffy', emoji: '👒' },
    '21': { name: 'Gol D. Roger', emoji: '☠️' },
    '?': { name: 'Nico Robin', emoji: '📚' },
    '☕': { name: 'Brook', emoji: '🎻' },
  },
};

const DRAGON_BALL: ThemeDefinition = {
  id: 'dragonball',
  label: 'Dragon Ball Z',
  emoji: '🐉',
  available: true,
  palette: { primary: '#f57c00', secondary: '#1e3a8a', accent: '#fde047', background: '#fff7ed' },
  cards: {
    '0': { name: 'Yamcha', emoji: '🐺' },
    '1': { name: 'Chaozu', emoji: '🎎' },
    '2': { name: 'Krilin', emoji: '💿' },
    '3': { name: 'Tenshinhan', emoji: '👁️' },
    '5': { name: 'Piccolo', emoji: '🟢' },
    '8': { name: 'Gohan', emoji: '📘' },
    '13': { name: 'Vegeta', emoji: '👑' },
    '21': { name: 'Goku', emoji: '⚡' },
    '?': { name: 'Majin Buu', emoji: '🍬' },
    '☕': { name: 'Tortue Géniale', emoji: '🐢' },
  },
};

const MARIO: ThemeDefinition = {
  id: 'mario',
  label: 'Mario',
  emoji: '🍄',
  available: true,
  palette: { primary: '#e52521', secondary: '#049cd8', accent: '#fbd000', background: '#eef8ff' },
  cards: {
    '0': { name: 'Goomba', emoji: '🌰' },
    '1': { name: 'Koopa', emoji: '🐢' },
    '2': { name: 'Toad', emoji: '🍄' },
    '3': { name: 'Yoshi', emoji: '🦖' },
    '5': { name: 'Peach', emoji: '👑' },
    '8': { name: 'Luigi', emoji: '💚' },
    '13': { name: 'Mario', emoji: '⭐' },
    '21': { name: 'Bowser', emoji: '🔥' },
    '?': { name: 'Boo', emoji: '👻' },
    '☕': { name: 'Donkey Kong', emoji: '🍌' },
  },
};

const FOOTBALL: ThemeDefinition = {
  id: 'football',
  label: 'Footballeurs',
  emoji: '⚽',
  available: false,
  palette: { primary: '#2e7d32', secondary: '#333', accent: '#fff', background: '#f4f6fb' },
  cards: {},
};

export const THEMES: ThemeDefinition[] = [POKEMON, ONE_PIECE, DRAGON_BALL, MARIO, FOOTBALL];

export const themeById = (id: ThemeId): ThemeDefinition => THEMES.find((t) => t.id === id) ?? POKEMON;
