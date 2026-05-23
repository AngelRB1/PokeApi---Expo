export type RootStackParamList = {
    Home: undefined;
    Detalle: { PokemonId: number | string };
    Comparador: {
        pokemonAId?: string;
        pokemonBId?: string;
    } | undefined;
};
 