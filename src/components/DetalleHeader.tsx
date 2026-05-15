import React from "react";
import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { capitalize, formatId, getTypeColor } from "../utils/pokemonHelpers";
import type { PokemonDetalle } from "../types/pokemon";

interface Props{
    pokemon: PokemonDetalle;
    fondoPrimario: string;
    ColorPrimario: string;
    onBack: () => void;
}

export default function DetalleHeader({pokemon, fondoPrimario, ColorPrimario, onBack}: Props){
    const artworkURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    return(
        <View style={[styles.header, {backgroundColor: fondoPrimario}]}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                <Text style={[styles.backArrow, {color: ColorPrimario}]}>Volver</Text>
            </TouchableOpacity>

            <View style={styles.info}>
                <Text style={styles.number}>{formatId(pokemon.id)}</Text>
                <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

                <View style={styles.typeRow}>
                    {pokemon.types.map((t) => (
                        <View
                            key={t.type.name}
                            style={[styles.badge, { backgroundColor: getTypeColor(t.type.name) }]}
                        >
                            <Text style={styles.badgeLabel}>{capitalize(t.type.name)}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <Image source={{uri: artworkURL}} style={styles.artwork} resizeMode="contain"></Image>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 24,
        position: 'relative',
    },

    backBtn: {
        alignSelf: 'flex-start',
        marginBottom: 12,
        width: 100,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        elevation: 3
    },

    backArrow: {
        fontSize: 20,
        fontWeight: '700',
    },

    info: {
        paddingRight: 120,
    },

    number: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(0,0,0,0.4)',
        letterSpacing: 0.5,
    },

    name: {
        fontSize: 30,
        fontWeight: '900',
        color: '#1a1a2e',
        marginTop: 2,
    },

    typeRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 10,
        flexWrap: 'wrap',
    },

    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },

    badgeLabel: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },

    artwork: {
        position: 'absolute',
        right: 10,
        bottom: 0,
        width: 130,
        height: 130,
    },
});