import React from "react";
import { View, Text } from "react-native";
import type { PokemonDetalle } from "../types/pokemon";
import { capitalize } from "../utils/pokemonHelpers";
import { comparadorStyles as styles } from "./ComparadorStyle";
const STATS_ORDENADAS = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed",
];

const STATS_LABELS: Record<string, string> = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "At. Esp.",
    "special-defense": "Def. Esp.",
    speed: "Velocidad",
};

const MAX_STAT = 255;

interface Props {
    pokemonA: PokemonDetalle;
    pokemonB: PokemonDetalle;
    colorA: string;
    colorB: string;
}

export default function ComparadorStats({ pokemonA, pokemonB, colorA, colorB }: Props) {
    const totalA = pokemonA.stats.reduce((acc, s) => acc + s.base_stat, 0);
    const totalB = pokemonB.stats.reduce((acc, s) => acc + s.base_stat, 0);

    return (
        <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Estadísticas Base</Text>

            <View style={styles.leyenda}>
                <View style={styles.leyendaItem}>
                    <View style={[styles.leyendaDot, { backgroundColor: colorA }]} />
                    <Text style={styles.leyendaLabel}>{capitalize(pokemonA.name)}</Text>
                </View>
                <View style={styles.leyendaItem}>
                    <View style={[styles.leyendaDot, { backgroundColor: colorB }]} />
                    <Text style={styles.leyendaLabel}>{capitalize(pokemonB.name)}</Text>
                </View>
            </View>

            {STATS_ORDENADAS.map((statKey) => {
                const valA = pokemonA.stats.find((s) => s.stat.name === statKey)?.base_stat ?? 0;
                const valB = pokemonB.stats.find((s) => s.stat.name === statKey)?.base_stat ?? 0;
                const ganadorA = valA > valB;
                const ganadorB = valB > valA;

                return (
                    <View key={statKey} style={styles.statRow}>
                        <Text style={styles.statLabel}>
                            {STATS_LABELS[statKey] ?? capitalize(statKey)}
                        </Text>

                        <View style={styles.statBarsCol}>
                            <View style={styles.barWrap}>
                                <Text style={[styles.statVal, { color: colorA }, ganadorA && styles.ganador]}>
                                    {valA}{ganadorA ? " ▲" : ""}
                                </Text>
                                <View style={styles.barBg}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            {
                                                width: `${(valA / MAX_STAT) * 100}%`,
                                                backgroundColor: colorA,
                                                opacity: ganadorA ? 1 : 0.5,
                                            },
                                        ]}
                                    />
                                </View>
                            </View>

                            <View style={styles.barWrap}>
                                <Text style={[styles.statVal, { color: colorB }, ganadorB && styles.ganador]}>
                                    {valB}{ganadorB ? " ▲" : ""}
                                </Text>
                                <View style={styles.barBg}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            {
                                                width: `${(valB / MAX_STAT) * 100}%`,
                                                backgroundColor: colorB,
                                                opacity: ganadorB ? 1 : 0.5,
                                            },
                                        ]}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                );
            })}

            <View style={styles.totalRow}>
                <View style={[styles.totalChip, { backgroundColor: colorA }]}>
                    <Text style={styles.totalLabel}>
                        {capitalize(pokemonA.name)}: {totalA} total
                    </Text>
                </View>
                <View style={[styles.totalChip, { backgroundColor: colorB }]}>
                    <Text style={styles.totalLabel}>
                        {capitalize(pokemonB.name)}: {totalB} total
                    </Text>
                </View>
            </View>

            {totalA === totalB ? (
                <View style={styles.ganadorBanner}>
                    <Text style={styles.ganadorText}>¡Empate!</Text>
                </View>
            ) : (
                <View style={[styles.ganadorBanner, { backgroundColor: totalA > totalB ? colorA : colorB }]}>
                    <Text style={styles.ganadorText}>
                        {capitalize(totalA > totalB ? pokemonA.name : pokemonB.name)} gana en stats totales
                    </Text>
                </View>
            )}
        </View>
    );
}