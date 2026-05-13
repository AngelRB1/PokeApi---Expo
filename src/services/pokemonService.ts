import type {PokemonCard,PokemonDetalle,PokemonListaRespuesta} from '../types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2';

function extraerId(url: string): number {
    const partes = url.replace(/\/$/, '').split('/');
    return Number(partes[partes.length - 1]);
}

function getOfficialArtWork(id: number): string{
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

async function fetchJSON<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`HTTP ${response.status} - ${url}`);
    }
    return response.json() as Promise<T>;
}

export async function fetchPokemonLista(limit = 20, offset = 0): Promise<PokemonCard[]> {
    const data = await fetchJSON<PokemonListaRespuesta>(
        `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );

    const detalles = await Promise.all(
        data.results.map((item) => {
            const id = extraerId(item.url);
            return fetchJSON<PokemonDetalle>(`${BASE_URL}/pokemon/${id}`);
        })
    );

    return detalles.map((detalles) => ({
        id: detalles.id,
        name: detalles.name,
        imageUrl: getOfficialArtWork(detalles.id),
        types: detalles.types.map((t) => t.type.name),
    }));
}
