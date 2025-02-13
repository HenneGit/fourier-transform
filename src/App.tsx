import './App.css'
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {MenuBar} from "@/components/menu/MenuBar.tsx";

import {useEffect, useState} from "react";
import MouseTracker from "@/components/ui/MouseTracker.tsx";
import {presets} from "@/presets.ts";
import {IFourierColorSettings, IFourierProperties, IFourierStrokeSettings} from "@/model/model.ts";
import FourierWrapper from "@/components/fourier/FourierWrapper.tsx";


function App() {
    const [isPause, setPause] = useState(false);
    const [strokes, setStrokes] = useState<IFourierStrokeSettings>(presets[1].strokes);
    const [colors, setColors] = useState<IFourierColorSettings>(presets[1].colors);
    const [properties, setProperties] = useState<IFourierProperties>(presets[1].properties);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                setPause((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    return (
        <>
            <SidebarProvider open={isPause}>
                <MenuBar setProperties={setProperties} setStrokes={setStrokes} setColors={setColors}
                         strokes={strokes} properties={properties} colors={colors}/>
                <main>
                    {properties && strokes && colors ?
                        <FourierWrapper setColors={setColors} setStrokes={setStrokes} isPause={isPause} properties={properties} colors={colors} strokes={strokes}
                                        startPosition={[50, 50]}/>
                        : null
                    }
                </main>
                <MouseTracker isPaused={isPause} setClicked={setPause}/>
            </SidebarProvider>
        </>
    );
}

export default App
