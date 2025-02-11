import './App.css'
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {MenuBar} from "@/components/menu/MenuBar.tsx";
import FourierWrapper, {
    IFourierColorSettings,
    IFourierProperties,
    IFourierStrokeSettings
} from "@/components/fourier/FourierWrapper.tsx";
import {useEffect, useState} from "react";
import MouseTracker from "@/components/ui/MouseTracker.tsx";


function App() {

    const [isPause, setPause] = useState(false);
    const [strokes, setStrokes] = useState<IFourierStrokeSettings>({
        circleStroke: 0.04,
        radiusStroke: 0.1,
        pathStroke: 0.1,
        jointPointStroke: 0.2,
        deletePath: true,
        deletePathDelay: 25,

    });
    const [colors, setColors] = useState<IFourierColorSettings>({
        hslBase: [140, 5, 9],
        rotateCircleColor: true,
        rotateCircleColorDelay: 5,
        radiusColor: [65, 82, 50],
        circleColor: [1, 20, 100],
        jointPointColor: [20, 120, 70],
        backgroundColor: [286, 90, 14],
        showPathGradient: true,
        pathColor: [132, 71, 70],
        gradientColor: [90, 90, 50],
        gradientColor1: [170, 90, 50],
        gradientColor2: [314, 90, 50],

    });
    const [properties, setProperties] = useState<IFourierProperties>({
        numberOfCircles: 40,
        maxSpeed: 0.299,
        minSpeed: -0.299,
        speedDelta: 2,
        maxRadius: 5,
        radiusDelta: 1,
        zoom: 90,
        viewPort: "0 0 100 100"
    });


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
                <MenuBar setProperties={setProperties} setStrokes={setStrokes} setColors={setColors} colors={colors}
                         strokes={strokes} properties={properties}/>
                <main>
                    {properties && strokes && colors ?
                        <FourierWrapper isPause={isPause} properties={properties} colors={colors} strokes={strokes}
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
