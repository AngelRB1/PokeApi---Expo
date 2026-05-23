import React, { createContext, useContext, useState } from "react";
 
interface ComparadorState {
    modoComparar: boolean;
    slotActivo: 1 | 2 | null;
    idOtro: string | null;
    activarModo: (slot?: 1 | 2, idOtro?: string | null) => void;
    cancelarModo: () => void;
}
 
const ComparadorContext = createContext<ComparadorState>({
    modoComparar: false,
    slotActivo: null,
    idOtro: null,
    activarModo: () => {},
    cancelarModo: () => {},
});
 
export function ComparadorProvider({ children }: { children: React.ReactNode }) {
    const [modoComparar, setModoComparar] = useState(false);
    const [slotActivo, setSlotActivo] = useState<1 | 2 | null>(null);
    const [idOtro, setIdOtro] = useState<string | null>(null);
 
    function activarModo(slot?: 1 | 2, otro?: string | null) {
        setModoComparar(true);
        setSlotActivo(slot ?? null);
        setIdOtro(otro ?? null);
    }
 
    function cancelarModo() {
        setModoComparar(false);
        setSlotActivo(null);
        setIdOtro(null);
    }
 
    return (
        <ComparadorContext.Provider value={{ modoComparar, slotActivo, idOtro, activarModo, cancelarModo }}>
            {children}
        </ComparadorContext.Provider>
    );
}
 
export const useComparador = () => useContext(ComparadorContext);