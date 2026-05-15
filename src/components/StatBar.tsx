import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { capitalize } from "../utils/pokemonHelpers";

const ESTADISTICAS_LABELS: Record<string, string> = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defensa",
    'special-attack': 'At. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidad',
};

const MAX_STAT = 255

interface Props{
    statName: string;
    baseStat: number;
    color: string;
}

export default function StatBar({statName, baseStat, color}: Props){
    const label = ESTADISTICAS_LABELS[statName] ?? capitalize(statName);
    const porcentaje = Math.min((baseStat/MAX_STAT) *100,100);

    return(
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, {color}]}>{baseStat}</Text>
            <View style={styles.barBg}>
                <View style={[styles.barFill, {width: `${porcentaje}%`, backgroundColor: color}]}></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },

    label: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        width: 72,
    },

    value: {
        fontSize: 13,
        fontWeight: '800',
        width: 32,
        textAlign: 'right',
    },

    barBg: {
        flex: 1,
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        overflow: 'hidden',
    },

    barFill: {
        height: '100%',
        borderRadius: 4,
    },
});