import { StatusBar } from 'expo-status-bar';
import {View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <View style={{flex: 1}}>
      <StatusBar style="light" />
      <HomeScreen />
    </View>
  );
}

