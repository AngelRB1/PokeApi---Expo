//Clase 1
export interface PokemonListaItem{
    name: string;
    url: string;
}

export interface PokemonListaRespuesta{
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListaItem[];
}

export interface TipoPokemon{
    slot: number;
    type :{
        name: string;
        url: string;
    }
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    }
}

export interface PokemonSprites{
    front_default : string | null;
    other: {
        'official-artwork': {
            front_default: string | null;
        }
    }
}

export interface PokemonDetalle{
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites : PokemonSprites;
    types: TipoPokemon[];
    stats: PokemonStat[];
    abilities: PokemonHabilidad[];
}

export interface PokemonCard{
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
}

//Clase 2
export interface PokemonHabilidad{
    ability:{
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}
