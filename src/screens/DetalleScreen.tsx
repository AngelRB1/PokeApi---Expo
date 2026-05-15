import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"; 
import type { RootStackParamList } from "../types/Navigation";
import { usePokemonDetalle } from "../hooks/usePokemonDetalle";
import { capitalize, getTypeColor, getTypeFondo } from "../utils/pokemonHelpers";
import DetalleHeader from "../components/DetalleHeader";
import StatBar from "../components/StatBar";

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>;

export default function DetalleScreen({route, navigation}: Props){
    const {PokemonId} = route.params;
    const {pokemon, cargando, error, refetch} = usePokemonDetalle(PokemonId);

    if(cargando){
        return(
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size='large' color='#E3350D' />
                <Text style={styles.loadingText}>Cargando detalles...</Text>
            </SafeAreaView>
        );
    }

    if(error || !pokemon){
        return(
            <SafeAreaView>
                <Text style={styles.errorEmoji}>⚠️</Text>
                <Text style={styles.errorText}>{error ?? 'Pokemon no encontrado'}</Text>
                <TouchableOpacity onPress={refetch} style={styles.retryBtn}>
                    <Text style={styles.retryLabel}>Reintentar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const tipoPrimario = pokemon.types[0]?.type.name ?? 'normal';
    const colorPrimario = getTypeColor(tipoPrimario);
    const fondoPrimario = getTypeFondo(tipoPrimario);

    const habilidadesVisibles = pokemon.abilities.filter((e) => !e.is_hidden);
    const habildadesOcultas = pokemon.abilities.filter((e) => e.is_hidden);

    return(
        <SafeAreaView style={styles.container} edges={['top']}>
            <DetalleHeader
                pokemon={pokemon}
                fondoPrimario={fondoPrimario}
                ColorPrimario = {colorPrimario}
                onBack={() => navigation.goBack()}
            >
            </DetalleHeader>

            <ScrollView style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={styles.row2col}>
                        <View style={styles.col}>
                            <Text style={styles.colLabel}>Altura</Text>
                            <Text style={[styles.colValue, {color: colorPrimario,}]}>{(pokemon.height / 10).toFixed(1)} M</Text>
                        </View>

                        <View style={styles.divider}/>
                            <View style={styles.col}>
                                <Text style={styles.colLabel}>Peso</Text>
                                <Text style={[styles.colValue, {color: colorPrimario}]}>{(pokemon.weight / 10).toFixed(1)} KG</Text>
                            </View>
                        </View>
                    </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Habilidades</Text>
                    <View style={styles.abilitiesWrap}>
                        {habilidadesVisibles.map((e) => (
                            <View
                                key={e.ability.name}
                                style={[styles.abilityBadge,{backgroundColor: fondoPrimario, borderColor: colorPrimario}]}
                            >
                                <Text style={[styles.abilityText, {color: colorPrimario}]}>
                                    {capitalize(e.ability.name.replace(/-/g,' '))}
                                </Text>
                            </View>
                        ))}

                        {habildadesOcultas.map((e) => (
                            <View
                                key={e.ability.name}
                                style={[styles.abilityBadge, styles.hiddenBadge]}
                            >
                                <Text style={styles.abilityHiddenText}>
                                    {capitalize(e.ability.name.replace(/-/g,' '))} (oculta)
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Estadisticas Base</Text>
                    {pokemon.stats.map((a) =>(
                        <StatBar key={a.stat.name} statName={a.stat.name} baseStat={a.base_stat} color={colorPrimario}></StatBar>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    center: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },

    body: {
        flex: 1,
    },

    bodyContent: {
        padding: 16,
        paddingTop: 28,
        gap: 12,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1a1a2e',
        marginBottom: 14,
        letterSpacing: 0.3,
    },

    row2col: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    col: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },

    colLabel: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },

    colValue: {
        fontSize: 22,
        fontWeight: '900',
    },

    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#eee',
    },

    abilitiesWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    abilityBadge: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 24,
        borderWidth: 1.5,
    },

    hiddenBadge: {
        backgroundColor: '#f5f5f5',
        borderColor: '#ccc',
    },

    abilityText: {
        fontSize: 13,
        fontWeight: '700',
    },

    abilityHiddenText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#999',
    },

    loadingText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },

    errorEmoji: {
        fontSize: 40,
    },

    errorText: {
        color: '#444',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
    },

    retryBtn: {
        backgroundColor: '#E3350D',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 24,
        marginTop: 8,
    },

    retryLabel: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});