import {createContext, SetStateAction, useContext, useState} from "react";
import {RandomCirclesSettings} from "@/model/model.ts";

export interface RandomCircleRendererSettings {
    id: string;
    properties: RandomCirclesSettings;
}

interface SettingsContextType {
    propertiesList: RandomCircleRendererSettings[];
    addProperties: (newSettings: RandomCircleRendererSettings) => void;
    updateProperties: (id: string, updatedSettings: Partial<RandomCircleRendererSettings>) => void;
    removeProperties: (id: string) => void;
    setPropertiesList: React.Dispatch<SetStateAction<RandomCircleRendererSettings[]>>
}

const RandomCircleContext = createContext<SettingsContextType | undefined>(undefined);


export function RandomCirclesPropertiesProvider({ children }: { children: React.ReactNode }) {
    const [propertiesList, setPropertiesList] = useState<RandomCircleRendererSettings[]>([]);

    const addProperties = (newSettings: RandomCircleRendererSettings) => {
        console.log(newSettings);
        setPropertiesList((prev) => [...prev, newSettings]);
    };

    const updateProperties = (id: string, updatedSettings: Partial<RandomCircleRendererSettings>) => {
        console.log(id, updatedSettings);
        setPropertiesList((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...updatedSettings } : s))
        );
    };

    const removeProperties = (id: string) => {
        setPropertiesList((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <RandomCircleContext.Provider value={{ propertiesList, addProperties, updateProperties, removeProperties, setPropertiesList }}>
            {children}
        </RandomCircleContext.Provider>
    );
}

export function useRandomCircleSettings() {
    const context = useContext(RandomCircleContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
