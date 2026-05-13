import { View, ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import PokemonCard from "../components/PokemonCard";
import { usePokemonLista } from "../hooks/usePokemonLista";
import type { PokemonCard as PokemonCardType } from "../types/pokemon";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen(){
    const {pokemon, cargando, error, refetch } = usePokemonLista(20);

    function handleCardPress(p: PokemonCardType){
        console.log('Selected:' , p.name);
    }

    if(cargando){
        return(
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#E3350D" />
                <Text style={styles.loadingText}>Cargando Pokedex...</Text>
            </SafeAreaView>
        )
    }

    if(error){
        return(
            <SafeAreaView style={styles.center}>
                <Text style={styles.errorEmoji}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
                    <Text style={styles.retryLabel}>Reintentar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pokedex</Text>
                <Text style={styles.headerSub}>{pokemon.length} Pokemon</Text>
            </View>

            <FlatList
                data={pokemon}
                keyExtractor={(item) => String(item.id)}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                renderItem={({item}) => (
                    <PokemonCard pokemon={item} onPress={handleCardPress}></PokemonCard>
                )}
                showsVerticalScrollIndicator={false}
            >
            </FlatList>
        </SafeAreaView>
    )
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

  header: {
    backgroundColor: '#E3350D',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginTop: 2,
  },

  listContent: {
    padding: 8,
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
