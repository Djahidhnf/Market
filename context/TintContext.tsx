import React, { createContext, ReactNode, useContext, useState } from "react";


//create context
interface TintContextType {
    tint: boolean,
    setTint: (val: boolean) => void,
}


//create a context with a default value
const TintContext = createContext<TintContextType | undefined>(undefined)

//create a provider
export function TintProvider({children}: {children: ReactNode}) {
    const [tint, setTint] = useState(false);

    return (
        <TintContext.Provider value={{tint, setTint}}>
            {children}
        </TintContext.Provider>
    )
}


//custom hook for easy access
export function useTint() {
    const context = useContext(TintContext);
    if (!context) {
        throw new Error("useTint must be used within a TintProvider");
    }
    return context;
}