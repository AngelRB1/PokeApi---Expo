import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/Navigation";
import { usePokemonDetalle } from "../hooks/usePokemonDetalle";
import ComparadorStats from "../components/ComparadorStats";
import { comparadorStyles as styles } from "../components/ComparadorStyle";
import { capitalize, formatId, getTypeColor, getTypeFondo } from "../utils/pokemonHelpers";
import { useComparador } from "../context/ComparadorContext";
import { X, AlertTriangle } from "lucide-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Comparador">;

interface SlotProps {
    slot: 1 | 2;
    idOrName: string | null;
    onCambiar: () => void;
    onBuscar: (v: string) => void;
}

function SlotHeader({ slot, idOrName, onCambiar, onBuscar }: SlotProps) {
    const [input, setInput] = useState("");
    const { pokemon, cargando, error } = usePokemonDetalle(idOrName);
    const color = slot === 1 ? "#6890F0" : "#F08030";

    function handleSubmit() {
        if (input.trim()) onBuscar(input.trim().toLowerCase());
    }

    if (!idOrName) {
        return (
            <View style={[localStyles.slotEmpty, { backgroundColor: color + "33" }]}>
                <Text style={localStyles.slotEmptyIcon}>?</Text>
                <Text style={localStyles.slotEmptyLabel}>Pokémon {slot}</Text>
                <View style={styles.headerInputRow}>
                    <TextInput
                        style={styles.headerInput}
                        placeholder="Nombre o #ID"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={input}
                        onChangeText={setInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="search"
                        onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity style={[styles.headerBuscarBtn, { backgroundColor: color }]} onPress={handleSubmit} activeOpacity={0.8}>
                        <Text style={styles.headerBuscarLabel}>OK</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={localStyles.elegirBtn} onPress={onCambiar} activeOpacity={0.8}>
                    <Text style={localStyles.elegirBtnLabel}>Elegir de la lista</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (cargando) {
        return (
            <View style={[localStyles.slotEmpty, { backgroundColor: color + "33" }]}>
                <ActivityIndicator color="#fff" />
                <Text style={localStyles.slotEmptyLabel}>Cargando...</Text>
            </View>
        );
    }

    if (error || !pokemon) {
        return (
            <View style={[localStyles.slotEmpty, { backgroundColor: color + "33" }]}>
                <AlertTriangle size={28} color="#fff" strokeWidth={2.5} />
                <Text style={localStyles.slotEmptyLabel}>No encontrado</Text>
                <TouchableOpacity style={localStyles.elegirBtn} onPress={onCambiar}>
                    <Text style={localStyles.elegirBtnLabel}>Cambiar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const artworkURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    return (
        <View style={localStyles.slotLoaded}>
            <Image source={{ uri: artworkURL }} style={styles.headerArtwork} resizeMode="contain" />
            <Text style={styles.headerPokeNumber}>{formatId(pokemon.id)}</Text>
            <Text style={styles.headerPokeName}>{capitalize(pokemon.name)}</Text>
            <View style={styles.headerTypeRow}>
                {pokemon.types.map((t) => (
                    <View key={t.type.name} style={styles.headerTypeBadge}>
                        <Text style={styles.headerTypeLabel}>{capitalize(t.type.name)}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.cambiarChipHeader} onPress={onCambiar} activeOpacity={0.8}>
                <X size={12} color="#fff" strokeWidth={3} />
                <Text style={styles.cambiarChipLabel}>Cambiar</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function ComparadorScreen({ navigation, route }: Props) {
    const initialA = route.params?.pokemonAId ?? null;
    const initialB = route.params?.pokemonBId ?? null;

    const [idA, setIdA] = useState<string | null>(initialA);
    const [idB, setIdB] = useState<string | null>(initialB);

    const { pokemon: pokemonA } = usePokemonDetalle(idA);
    const { pokemon: pokemonB } = usePokemonDetalle(idB);
    const { activarModo } = useComparador();

    const tipoA = pokemonA?.types[0]?.type.name ?? null;
    const tipoB = pokemonB?.types[0]?.type.name ?? null;
    const colorA = tipoA ? getTypeColor(tipoA) : "#6890F0";
    const colorB = tipoB ? getTypeColor(tipoB) : "#F08030";

    function irASeleccionarEnHome(slot: 1 | 2) {
        const idOtro = slot === 1 ? idB : idA;
        activarModo(slot, idOtro);
        navigation.goBack(); 
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.headerWrap}>
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1, backgroundColor: colorA }} />
                        <View style={{ flex: 1, backgroundColor: colorB }} />
                    </View>
                </View>

                <View style={styles.headerTopBar}>
                    <TouchableOpacity style={styles.backCard} onPress={() => navigation.goBack()} activeOpacity={0.8} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={styles.backCardLabel}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerVsLabel}>VS</Text>
                    <View style={{ width: 80 }} />
                </View>

                <View style={styles.headerPokemonRow}>
                    <SlotHeader slot={1} idOrName={idA} onCambiar={() => irASeleccionarEnHome(1)} onBuscar={(v) => setIdA(v)} />
                    <SlotHeader slot={2} idOrName={idB} onCambiar={() => irASeleccionarEnHome(2)} onBuscar={(v) => setIdB(v)} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {pokemonA && pokemonB ? (
                    <ComparadorStats pokemonA={pokemonA} pokemonB={pokemonB} colorA={colorA} colorB={colorB} />
                ) : (
                    <View style={styles.hint}>
                        <Text style={styles.hintText}>Selecciona dos Pokémon para comparar sus estadísticas</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    slotEmpty: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 16, padding: 12, gap: 8, minHeight: 160 },
    slotLoaded: { flex: 1, alignItems: "center", gap: 4 },
    slotEmptyIcon: { fontSize: 36, color: "#fff", fontWeight: "900", opacity: 0.6 },
    slotEmptyLabel: { fontSize: 13, fontWeight: "700", color: "#fff" },
    elegirBtn: { borderWidth: 1.5, borderColor: "rgba(255,255,255,0.5)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, marginTop: 2 },
    elegirBtnLabel: { color: "#fff", fontSize: 11, fontWeight: "700" },
});