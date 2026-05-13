export const TYPE_COLORES: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}

export function getTypeColor(type: string): string {
    return TYPE_COLORES[type] ?? '#A8A878'
}

export function getTypeFondo(type: string): string {
  const map: Record<string, string> = {
    normal: '#E8E8D0',
    fire: '#FDEBD0',
    water: '#D6E4FF',
    electric: '#FEF9D0',
    grass: '#D9F0D0',
    ice: '#D9F5F5',
    fighting: '#F5D0CF',
    poison: '#EDD0ED',
    ground: '#F5EAC8',
    flying: '#E8E0FF',
    psychic: '#FFD6E8',
    bug: '#E5EAB0',
    rock: '#EDE5B8',
    ghost: '#D9CCEC',
    dragon: '#DDD0FF',
    dark: '#D9D0C8',
    steel: '#E8E8F0',
    fairy: '#FBE8F2',
  };
  return map[type] ?? '#E8E8D0';
}

export function formatId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}