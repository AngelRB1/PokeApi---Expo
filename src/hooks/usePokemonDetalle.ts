import { useEffect, useState } from "react";
import { fetchPokemonDetalle } from "../services/PokemonDetalleService";
import type { PokemonDetalle } from "../types/pokemon";

interface UsePokemonDetalleResultado {
    pokemon: PokemonDetalle | null;
    cargando: boolean;
    error: string | null;
    refetch: () => void;
}

export function usePokemonDetalle(idOrName: number | string | null): UsePokemonDetalleResultado {
    const [pokemon, setPokemon] = useState<PokemonDetalle | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const pokemonId = idOrName;

        if (pokemonId === null) {
            setPokemon(null);
            setError(null);
            return;
        }

        let cancelada = false;

        async function carga() {
            setCargando(true);
            setError(null);
            try {
                const data = await fetchPokemonDetalle(pokemonId);
                if (!cancelada) setPokemon(data);
            } catch (err) {
                if (!cancelada) {
                    setError(
                        err instanceof Error ? err.message : 'Error al cargar detalles del pokemon'
                    );
                }
            } finally {
                if (!cancelada) setCargando(false);
            }
        }

        carga();
        return () => {
            cancelada = true;
        };
    }, [idOrName, refreshKey]);

    return {
        pokemon,
        cargando,
        error,
        refetch: () => setRefreshKey((n) => n + 1),
    };
}
