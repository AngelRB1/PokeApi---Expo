import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types/Navigation";
import HomeScreen from "./screens/HomeScreen";
import DetalleScreen from "./screens/DetalleScreen";
import ComparadorScreem from "./screens/ComparadorScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Detalle" component={DetalleScreen} />
                <Stack.Screen name="Comparador" component={ComparadorScreem} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}