import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PokemonCard } from "../types/pokemon";

const STORAGE_KEY = "pokedex_favoritos";

interface UseFavoritosResultado {
    favoritos: PokemonCard[];
    esFavorito: (id: number) => boolean;
    toggleFavorito: (pokemon: PokemonCard) => void;
    cargando: boolean;
}

export function useFavoritos(): UseFavoritosResultado {
    const [favoritos, setFavoritos] = useState<PokemonCard[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarFavoritos() {
            try {
                const data = await AsyncStorage.getItem(STORAGE_KEY);
                if (data) {
                    setFavoritos(JSON.parse(data));
                }
            } catch (err) {
                console.warn("Error al cargar favoritos:", err);
            } finally {
                setCargando(false);
            }
        }

        cargarFavoritos();
    }, []);

    const guardarFavoritos = useCallback(async (nuevos: PokemonCard[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
        } catch (err) {
            console.warn("Error al guardar favoritos:", err);
        }
    }, []);

    const toggleFavorito = useCallback(
        (pokemon: PokemonCard) => {
            setFavoritos((prev) => {
                const existe = prev.some((f) => f.id === pokemon.id);
                const nuevos = existe
                    ? prev.filter((f) => f.id !== pokemon.id)
                    : [...prev, pokemon];
                guardarFavoritos(nuevos);
                return nuevos;
            });
        },
        [guardarFavoritos]
    );

    const esFavorito = useCallback(
        (id: number) => favoritos.some((f) => f.id === id),
        [favoritos]
    );

    return { favoritos, esFavorito, toggleFavorito, cargando };
}