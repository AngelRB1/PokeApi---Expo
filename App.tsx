import AppNavigator from './src/AppNavigator';
import { ComparadorProvider } from './src/context/ComparadorContext';

export default function App() {
    return (
        <ComparadorProvider>
            <AppNavigator />
        </ComparadorProvider>
    );
}