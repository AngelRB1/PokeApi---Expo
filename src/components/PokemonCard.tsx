import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { PokemonCard as PokemonCardType } from "../types/pokemon";
import { capitalize, formatId, getTypeFondo, getTypeColor } from "../utils/pokemonHelpers";

interface Props {
    pokemon: PokemonCardType;
    onPress?: (pokemon: PokemonCardType) => void;
}

export default function PokemonCard({ pokemon, onPress }: Props) {
    const tipoPrimario = pokemon.types[0] ?? 'normal';
    const bgColor = getTypeFondo(tipoPrimario);
    const typeColor = getTypeColor(tipoPrimario);

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: '#fff' }]}
            onPress={() => onPress?.(pokemon)}
            activeOpacity={0.85}
        >
            <View style={[styles.pokeBottom, { backgroundColor: bgColor }]} />

            <View style={styles.pokeTop} />
            <View style={styles.pokeLine} />

            <View style={[styles.pokeCenterRing, { borderColor: typeColor }]}>
                <View style={[styles.pokeCenterDot, { backgroundColor: typeColor }]} />
            </View>

            <Text style={styles.number}>{formatId(pokemon.id)}</Text>

            <Image
                source={{ uri: pokemon.imageUrl }}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

            <View style={styles.typeRow}>
                {pokemon.types.map((type) => (
                    <View
                        key={type}
                        style={[styles.typeBadge, { backgroundColor: getTypeColor(type) }]}
                    >
                        <Text style={styles.typeLabel}>{capitalize(type)}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
}

const CARD_HEIGHT = 180;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        borderRadius: 20,
        height: CARD_HEIGHT,
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },

    pokeBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: CARD_HEIGHT / 2,
    },
    pokeTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: CARD_HEIGHT / 2,
        backgroundColor: '#fff',
    },
    pokeLine: {
        position: 'absolute',
        top: CARD_HEIGHT / 2 - 3,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: '#1a1a2e',
        zIndex: 1,
    },
    pokeCenterRing: {
        position: 'absolute',
        top: CARD_HEIGHT / 2 - 14,
        alignSelf: 'center',
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 4,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    pokeCenterDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },

    number: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 12,
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(0,0,0,0.3)',
        letterSpacing: 0.5,
        zIndex: 3,
    },
    image: {
        width: 90,
        height: 90,
        marginTop: -4,
        zIndex: 3,
    },
    name: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1a1a2e',
        textAlign: 'center',
        letterSpacing: 0.3,
        zIndex: 3,
        marginTop: 2,
    },
    typeRow: {
        flexDirection: 'row',
        gap: 5,
        marginTop: 5,
        flexWrap: 'wrap',
        justifyContent: 'center',
        zIndex: 3,
        paddingBottom: 10,
    },
    typeBadge: {
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 20,
    },
    typeLabel: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});