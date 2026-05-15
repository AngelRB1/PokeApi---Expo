import type { PokemonDetalle } from "../types/pokemon";

const BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchJSON<T>(url: string): Promise<T>{
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`HTTP ${response.status} - ${url}`);
    }

    return response.json() as Promise<T>;
}

export async function fetchPokemonDetalle(idOrName: number | string): Promise<PokemonDetalle>{
    return fetchJSON<PokemonDetalle>(`${BASE_URL}/pokemon/${idOrName}`);
}