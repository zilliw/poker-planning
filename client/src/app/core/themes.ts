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
  /** True once an image `client/public/themes/<id>/<slug>.webp` (280×400, card ratio) exists for every card. */
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
  bundledImages: true,
  palette: { primary: '#f57c00', secondary: '#1e3a8a', accent: '#fde047', background: '#fff7ed' },
  cards: {
    '0': { name: 'Mr. Satan', emoji: '🏆' },
    '1': { name: 'Yamcha', emoji: '🐺' },
    '2': { name: 'Krilin', emoji: '💿' },
    '3': { name: 'Piccolo', emoji: '🟢' },
    '5': { name: 'Sangohan', emoji: '📘' },
    '8': { name: 'Vegeta', emoji: '👑' },
    '13': { name: 'Sangoku', emoji: '⚡' },
    '21': { name: 'Vegeto', emoji: '💥' },
    '?': { name: 'Majin Buu', emoji: '🍬' },
    '☕': { name: 'Tortue Géniale', emoji: '🐢' },
  },
};

const MARIO: ThemeDefinition = {
  id: 'mario',
  label: 'Mario',
  emoji: '🍄',
  available: true,
  bundledImages: true,
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

const KPOP: ThemeDefinition = {
  id: 'kpop',
  label: 'KPop Demon Hunters',
  emoji: '🎤',
  available: true,
  bundledImages: true,
  palette: { primary: '#c026d3', secondary: '#4c1d95', accent: '#facc15', background: '#faf5ff' },
  cards: {
    '0': { name: 'Sussie', emoji: '🐦' },
    '1': { name: 'Bobby', emoji: '📋' },
    '2': { name: 'Baby Saja', emoji: '🍼' },
    '3': { name: 'Abby Saja', emoji: '💪' },
    '5': { name: 'Zoey', emoji: '✍️' },
    '8': { name: 'Mira', emoji: '💃' },
    '13': { name: 'Jinu', emoji: '😈' },
    '21': { name: 'Rumi', emoji: '🌟' },
    '?': { name: 'Mystery Saja', emoji: '🎭' },
    '☕': { name: 'Derpy', emoji: '🐯' },
  },
};

const NARUTO: ThemeDefinition = {
  id: 'naruto',
  label: 'Naruto',
  emoji: '🍥',
  available: true,
  bundledImages: true,
  palette: { primary: '#f97316', secondary: '#1f2937', accent: '#facc15', background: '#fff7ed' },
  cards: {
    '0': { name: 'Konohamaru', emoji: '🧣' },
    '1': { name: 'Sakura', emoji: '🌸' },
    '2': { name: 'Rock Lee', emoji: '👍' },
    '3': { name: 'Gaara', emoji: '🏜️' },
    '5': { name: 'Kakashi', emoji: '📕' },
    '8': { name: 'Itachi', emoji: '🌙' },
    '13': { name: 'Sasuke', emoji: '⚡' },
    '21': { name: 'Naruto', emoji: '🍥' },
    '?': { name: 'Tobi', emoji: '🌀' },
    '☕': { name: 'Tonton', emoji: '🐷' },
  },
};

export const THEMES: ThemeDefinition[] = [POKEMON, ONE_PIECE, DRAGON_BALL, MARIO, KPOP, NARUTO];

export const themeById = (id: ThemeId): ThemeDefinition => THEMES.find((t) => t.id === id) ?? POKEMON;
