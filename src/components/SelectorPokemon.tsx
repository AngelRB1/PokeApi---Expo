import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,Image,ActivityIndicator} from "react-native";
import { usePokemonDetalle } from "../hooks/usePokemonDetalle";
import { capitalize, formatId, getTypeColor, getTypeFondo } from "../utils/pokemonHelpers";
import { comparadorStyles as styles } from "./ComparadorStyle";
import { AlertTriangle, X } from "lucide-react-native";

interface Props {
    slot: 1 | 2;
    idOrName: string | null;
    onConfirmar: (valor: string) => void;
}

export default function SelectorPokemon({ slot, idOrName, onConfirmar }: Props) {
    const [input, setInput] = useState("");
    const { pokemon, cargando, error } = usePokemonDetalle(idOrName);

    const color = slot === 1 ? "#487cf4" : "#ef6f13";

    function handleBuscar() {
        if (input.trim()) onConfirmar(input.trim().toLowerCase());
    }

    if (!idOrName) {
        return (
            <View style={[styles.selectorEmpty, { borderColor: color }]}>
                <Text style={[styles.slotLabel, { color }]}>Pokemon {slot}</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.selectorInput}
                        placeholder="Nombre o #ID"
                        placeholderTextColor="#bbb"
                        value={input}
                        onChangeText={setInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="search"
                        onSubmitEditing={handleBuscar}
                    />
                    <TouchableOpacity
                        style={[styles.buscarBtn, { backgroundColor: color }]}
                        onPress={handleBuscar}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buscarBtnLabel}>Buscar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (cargando) {
        return (
            <View style={[styles.selectorCard, { borderColor: color }]}>
                <ActivityIndicator color={color} />
                <Text style={[styles.loadingLabel, { color }]}>Cargando...</Text>
            </View>
        );
    }

    if (error || !pokemon) {
        return (
            <View style={[styles.selectorCard, { borderColor: color }]}>
                <AlertTriangle
                    size={28}
                    color="#ff9500"
                    strokeWidth={2.5}
                />
                <Text style={styles.errorLabel}>No encontrado</Text>
                <TouchableOpacity onPress={() => onConfirmar("")} style={styles.resetBtn}>
                    <Text style={[styles.resetLabel, { color }]}>Cambiar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const tipo = pokemon.types[0]?.type.name ?? "normal";
    const artworkURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    return (
        <View style={[styles.selectorCard, { borderColor: color, backgroundColor: getTypeFondo(tipo) }]}>
            <TouchableOpacity
                style={styles.cambiarChip}
                onPress={() => onConfirmar("")}
                activeOpacity={0.8}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <X
                        size={14}
                        color={color}
                        strokeWidth={2.5}
                    />
                    <Text style={[styles.cambiarLabel, { color }]}>
                        Cambiar
                    </Text>
                </View>
            </TouchableOpacity>

            <Image source={{ uri: artworkURL }} style={styles.selectorArtwork} resizeMode="contain" />

            <Text style={[styles.selectorNumber, { color: getTypeColor(tipo) }]}>
                {formatId(pokemon.id)}
            </Text>
            <Text style={styles.selectorName}>{capitalize(pokemon.name)}</Text>

            <View style={styles.typeRow}>
                {pokemon.types.map((t) => (
                    <View
                        key={t.type.name}
                        style={[styles.typeBadge, { backgroundColor: getTypeColor(t.type.name) }]}
                    >
                        <Text style={styles.typeLabel}>{capitalize(t.type.name)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}