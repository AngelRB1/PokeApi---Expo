import React from "react";
import {View,TextInput,Text,TouchableOpacity,ScrollView,StyleSheet} from "react-native";
import { getTypeColor } from "../utils/pokemonHelpers";
import { Search, X } from "lucide-react-native";

const TIPOS = [
    "normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

interface Props {
    busqueda: string;
    onBusquedaChange: (texto: string) => void;
    tipoSeleccionado: string | null;
    onTipoChange: (tipo: string | null) => void;
}

export default function BuscadorFiltro({busqueda,onBusquedaChange,tipoSeleccionado,onTipoChange}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <View style={styles.inputWrap}>
                    <Search size={18} color="#777" />
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar Pokemon..."
                        placeholderTextColor="#aaa"
                        value={busqueda}
                        onChangeText={onBusquedaChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                    />
                    {busqueda.length > 0 && (
                        <TouchableOpacity onPress={() => onBusquedaChange("")} style={styles.clearBtn}>
                            <X size={15} color="#999" strokeWidth={2.5} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tiposRow}
            >
                <TouchableOpacity
                    style={[
                        styles.chip,
                        tipoSeleccionado === null && styles.chipActivo,
                    ]}
                    onPress={() => onTipoChange(null)}
                    activeOpacity={0.75}
                >
                    <Text
                        style={[
                            styles.chipLabel,
                            tipoSeleccionado === null && styles.chipLabelActivo,
                        ]}
                    >
                        Todos
                    </Text>
                </TouchableOpacity>

                {TIPOS.map((tipo) => {
                    const color = getTypeColor(tipo);
                    const activo = tipoSeleccionado === tipo;
                    return (
                        <TouchableOpacity
                            key={tipo}
                            style={[
                                styles.chip,
                                activo && { backgroundColor: color, borderColor: color },
                            ]}
                            onPress={() => onTipoChange(activo ? null : tipo)}
                            activeOpacity={0.75}
                        >
                            <Text
                                style={[
                                    styles.chipLabel,
                                    activo && styles.chipLabelActivo,
                                ]}
                            >
                                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingTop: 12,
        paddingBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 4,
    },

    searchRow: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },

    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 44,
    },


    input: {
        flex: 1,
        fontSize: 15,
        color: "#1a1a2e",
        fontWeight: "500",
    },

    clearBtn: {
        padding: 4,
    },

    tiposRow: {
        paddingHorizontal: 16,
        gap: 8,
    },

    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },

    chipActivo: {
        backgroundColor: "#1a1a2e",
        borderColor: "#1a1a2e",
    },

    chipLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#555",
    },

    chipLabelActivo: {
        color: "#fff",
    },
});