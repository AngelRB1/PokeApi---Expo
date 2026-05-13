import { useEffect, useState } from "react";
import { fetchPokemonLista } from "../services/pokemonService";
import type { PokemonCard } from "../types/pokemon";

interface UsePokemonListaResultado {
    pokemon: PokemonCard[];
    cargando: boolean;
    error: string |  null;
    refetch: () => void;
}

export function usePokemonLista(limit = 20): UsePokemonListaResultado{
    const [pokemon, setPokemon] = useState<PokemonCard[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelada = false;

        async function carga(){
            setCargando(true);
            setError(null);
            try{
                const data = await fetchPokemonLista(limit);
                if(!cancelada) setPokemon(data);
            }catch(err){
                if(!cancelada){
                    setError(
                        err instanceof Error ? err.message : 'Error al cargar pokemon'
                    );
                }
            } finally {
                if(!cancelada) setCargando(false);
            }
        }

        carga();
        return () => {
            cancelada = true;
        };

    }, [limit, refreshKey]);

    return {
        pokemon, cargando, error, refetch: () => setRefreshKey((n) => n + 1),
    }

}