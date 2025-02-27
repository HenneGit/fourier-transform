import {createContext, useContext, useEffect, useState} from "react";
import {ColorSettings, StrokeSettings} from "@/model/model.ts";
import {useActiveRendererId} from "@/context/ActiveRendererContext.tsx";

export interface ColorAndStrokeSettings {
    id: string;
    colorSettings: ColorSettings;
    strokeSettings: StrokeSettings;
}

interface SettingsContextType {
    settingsList: ColorAndStrokeSettings[];
    addSettings: (newSettings: ColorAndStrokeSettings) => void;
    updateStrokeSettings: ( updatedSettings: Partial<StrokeSettings>) => void;
    updateColorSettings: (updatedSettings: Partial<ColorSettings>) => void;
    removeSettings: () => void;
    currentStrokeSettings: StrokeSettings | undefined;
    currentColorSettings: ColorSettings | undefined;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);


export function SettingsProvider({children}: { children: React.ReactNode }) {
    const [settingsList, setSettingsList] = useState<ColorAndStrokeSettings[]>([]);
    const [currentStrokeSettings, setCurrentStrokeSettings] = useState<StrokeSettings>()
    const [currentColorSettings, setCurrentColorSettings] = useState<ColorSettings>()
    const {id} = useActiveRendererId();

    useEffect(() => {
        if (settingsList && settingsList.length > 0) {
            const strokeSettings = settingsList.filter(s => s.id === id)[0].strokeSettings;
            if (strokeSettings) {
                setCurrentStrokeSettings(strokeSettings);
            }
            const colorSettings = settingsList.filter(s => s.id === id)[0].colorSettings;
            if (colorSettings) {
                setCurrentColorSettings(colorSettings);
            }
        }
    }, [id, settingsList]);

    const updateStrokeSettings = ( updatedStrokeSettings: Partial<StrokeSettings>) => {
        console.log(id, updatedStrokeSettings);
        setSettingsList((prev) =>
            prev.map((setting) => (setting.id === id ? {...setting, strokeSettings: {...setting.strokeSettings, ...updatedStrokeSettings}} : setting))
        );
    };


    const addSettings = (newSettings: ColorAndStrokeSettings) => {
        console.log(newSettings);
        setSettingsList((prev) => [...prev, newSettings]);
    };


    const updateColorSettings = (updatedColorSettings: Partial<ColorSettings>) => {
        console.log(id, updatedColorSettings);
        setSettingsList((prev) =>
            prev.map((settings) => (settings.id === id ? {...settings, colorSettings: {...settings.colorSettings, ...updatedColorSettings}} : settings))
        );
    };


    const removeSettings = () => {
        setSettingsList((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <SettingsContext.Provider value={{
            settingsList,
            addSettings,
            updateStrokeSettings,
            updateColorSettings,
            removeSettings,
            currentStrokeSettings,
            currentColorSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
