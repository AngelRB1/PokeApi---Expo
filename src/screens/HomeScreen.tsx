import React, { useState, useMemo } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import PokemonCard from "../components/PokemonCard";
import BuscadorFiltro from "../components/BuscadorFiltro";
import { usePokemonLista } from "../hooks/usePokemonLista";
import { useFavoritos } from "../hooks/useFavoritos";
import { useComparador } from "../context/ComparadorContext";
import type { PokemonCard as PokemonCardType } from "../types/pokemon";
import type { RootStackParamList } from "../types/Navigation";
import { AlertTriangle, Heart, SearchX, GitCompareArrows, X, CheckCircle2 } from "lucide-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
type TabType = "todos" | "favoritos";

export default function HomeScreen({ navigation }: Props) {
    const { pokemon, cargando, error, refetch } = usePokemonLista(40);
    const { favoritos, esFavorito, toggleFavorito } = useFavoritos();
    const { modoComparar, slotActivo, idOtro, activarModo, cancelarModo } = useComparador();

    const [busqueda, setBusqueda] = useState("");
    const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
    const [tabActiva, setTabActiva] = useState<TabType>("todos");
    const [seleccionados, setSeleccionados] = useState<PokemonCardType[]>([]);

    const isFocused = useIsFocused();

    function handleCardPress(p: PokemonCardType) {
        if (modoComparar) {
            handleSeleccionComparar(p);
        } else {
            navigation.navigate("Detalle", { PokemonId: p.id });
        }
    }

    function handleSeleccionComparar(p: PokemonCardType) {
        if (slotActivo !== null) {
            const pokemonAId = slotActivo === 1 ? String(p.id) : (idOtro ?? undefined);
            const pokemonBId = slotActivo === 2 ? String(p.id) : (idOtro ?? undefined);
            cancelarModo();
            navigation.navigate("Comparador", { pokemonAId, pokemonBId });
            return;
        }

        setSeleccionados((prev) => {
            const yaSeleccionado = prev.find((s) => s.id === p.id);
            if (yaSeleccionado) return prev.filter((s) => s.id !== p.id);
            if (prev.length >= 2) return [prev[1], p];
            const nuevo = [...prev, p];
            if (nuevo.length === 2) {
                setTimeout(() => {
                    cancelarModo();
                    setSeleccionados([]);
                    navigation.navigate("Comparador", {
                        pokemonAId: String(nuevo[0].id),
                        pokemonBId: String(nuevo[1].id),
                    });
                }, 150);
            }
            return nuevo;
        });
    }

    function handleCancelar() {
        cancelarModo();
        setSeleccionados([]);
    }

    const listaBase = tabActiva === "favoritos" ? favoritos : pokemon;
    const listaFiltrada = useMemo(() => {
        return listaBase.filter((p) => {
            const coincideBusqueda = p.name.toLowerCase().includes(busqueda.toLowerCase().trim());
            const coincideTipo = tipoSeleccionado === null || p.types.includes(tipoSeleccionado);
            return coincideBusqueda && coincideTipo;
        });
    }, [listaBase, busqueda, tipoSeleccionado]);

    if (cargando) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#E3350D" />
                <Text style={styles.loadingText}>Cargando Pokedex...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.center}>
                <AlertTriangle size={40} color="#ff9500" strokeWidth={2.3} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
                    <Text style={styles.retryLabel}>Reintentar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const bannerText =
        slotActivo !== null
            ? `Elige el Pokémon ${slotActivo === 1 ? "A" : "B"} para comparar`
            : seleccionados.length === 0
            ? "Selecciona el primer Pokémon"
            : seleccionados.length === 1
            ? `✓ ${seleccionados[0].name}  •  Selecciona el segundo`
            : "¡Listos! Abriendo comparador...";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Pokedex</Text>

                    {modoComparar ? (
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelar} activeOpacity={0.8}>
                            <View style={styles.btnContent}>
                                <X size={16} color="#fff" strokeWidth={2.5} />
                                <Text style={styles.btnText}>Cancelar</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.compareBtn} onPress={() => activarModo()} activeOpacity={0.8}>
                            <View style={styles.btnContent}>
                                <GitCompareArrows size={16} color="#fff" strokeWidth={2.5} />
                                <Text style={styles.btnText}>Comparar</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                {modoComparar && (
                    <View style={styles.compareBanner}>
                        <Text style={styles.compareBannerText}>{bannerText}</Text>
                        {slotActivo === null && (
                            <View style={styles.compareDots}>
                                <View style={[styles.dot, seleccionados.length >= 1 && styles.dotActivo]} />
                                <View style={[styles.dot, seleccionados.length >= 2 && styles.dotActivo]} />
                            </View>
                        )}
                    </View>
                )}

                {!modoComparar && (
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, tabActiva === "todos" && styles.tabActiva]}
                            onPress={() => setTabActiva("todos")}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabLabel, tabActiva === "todos" && styles.tabLabelActiva]}>
                                Todos · {pokemon.length}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, tabActiva === "favoritos" && styles.tabActiva]}
                            onPress={() => setTabActiva("favoritos")}
                            activeOpacity={0.8}
                        >
                            <View style={styles.tabInner}>
                                <Heart
                                    size={14}
                                    color={tabActiva === "favoritos" ? "#dc0606" : "#fff"}
                                    fill={tabActiva === "favoritos" ? "#dc0606" : "transparent"}
                                />
                                <Text style={[styles.tabLabel, tabActiva === "favoritos" && styles.tabLabelActiva]}>
                                    Favoritos · {favoritos.length}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {!modoComparar && (
                <BuscadorFiltro
                    busqueda={busqueda}
                    onBusquedaChange={setBusqueda}
                    tipoSeleccionado={tipoSeleccionado}
                    onTipoChange={setTipoSeleccionado}
                />
            )}

            {listaFiltrada.length === 0 ? (
                <View style={styles.emptyContainer}>
                    {tabActiva === "favoritos" ? (
                        <Heart size={52} color="#bbb" strokeWidth={1.8} />
                    ) : (
                        <SearchX size={52} color="#bbb" strokeWidth={1.8} />
                    )}
                    <Text style={styles.emptyTitle}>
                        {tabActiva === "favoritos" && favoritos.length === 0 ? "Sin favoritos aún" : "Sin resultados"}
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        {tabActiva === "favoritos" && favoritos.length === 0
                            ? "Toca el corazón en una tarjeta para guardar un Pokémon"
                            : `No se encontró "${busqueda || tipoSeleccionado || ""}"`}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={listaFiltrada}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => {
                        const estaSeleccionado = seleccionados.some((s) => s.id === item.id);
                        const indice = seleccionados.findIndex((s) => s.id === item.id);
                        return (
                            <View style={{ flex: 1, position: "relative" }}>
                                <PokemonCard
                                    pokemon={item}
                                    onPress={handleCardPress}
                                    esFavorito={!modoComparar && esFavorito(item.id)}
                                    onToggleFavorito={!modoComparar ? toggleFavorito : undefined}
                                />
                                {modoComparar && estaSeleccionado && (
                                    <View style={[styles.seleccionOverlay, indice === 0 ? styles.seleccionA : styles.seleccionB]}>
                                        <CheckCircle2 size={28} color="#fff" fill={indice === 0 ? "#6890F0" : "#F08030"} strokeWidth={2} />
                                        <Text style={styles.seleccionLabel}>{indice === 0 ? "Pokémon A" : "Pokémon B"}</Text>
                                    </View>
                                )}
                                {modoComparar && !estaSeleccionado && seleccionados.length === 2 && (
                                    <View style={styles.dimOverlay} />
                                )}
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5" },
    center: { flex: 1, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center", gap: 12 },
    header: { backgroundColor: "#dc0606", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
    headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    headerTitle: { fontSize: 32, fontWeight: "900", color: "#fff", letterSpacing: -0.5 },
    compareBtn: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
    },
    cancelBtn: {
        backgroundColor: "rgba(0,0,0,0.25)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
    },
    btnContent: { flexDirection: "row", alignItems: "center", gap: 6 },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
    compareBanner: {
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    compareBannerText: { color: "#fff", fontWeight: "700", fontSize: 13, flex: 1 },
    compareDots: { flexDirection: "row", gap: 6, marginLeft: 10 },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.3)", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.5)" },
    dotActivo: { backgroundColor: "#fff", borderColor: "#fff" },
    tabs: { flexDirection: "row", gap: 8 },
    tab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)" },
    tabActiva: { backgroundColor: "#fff" },
    tabInner: { flexDirection: "row", alignItems: "center", gap: 6 },
    tabLabel: { color: "rgba(255,255,255,0.8)", fontWeight: "700", fontSize: 13 },
    tabLabelActiva: { color: "#dc0606" },
    listContent: { padding: 8 },
    seleccionOverlay: { position: "absolute", top: 8, left: 8, right: 8, bottom: 8, borderRadius: 18, alignItems: "center", justifyContent: "center", gap: 4 },
    seleccionA: { backgroundColor: "rgba(104,144,240,0.6)", borderWidth: 3, borderColor: "#6890F0" },
    seleccionB: { backgroundColor: "rgba(240,128,48,0.6)", borderWidth: 3, borderColor: "#F08030" },
    seleccionLabel: { color: "#fff", fontWeight: "900", fontSize: 13, textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    dimOverlay: { position: "absolute", top: 8, left: 8, right: 8, bottom: 8, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.55)" },
    emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: "800", color: "#1a1a2e", textAlign: "center" },
    emptySubtitle: { fontSize: 14, color: "#888", textAlign: "center", lineHeight: 20 },
    loadingText: { color: "#666", fontSize: 14, fontWeight: "500" },
    errorText: { color: "#444", fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
    retryBtn: { backgroundColor: "#E3350D", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 24, marginTop: 8 },
    retryLabel: { color: "#fff", fontWeight: "700", fontSize: 14 },
});