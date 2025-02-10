import './App.css'
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {MenuBar} from "@/components/menu/MenuBar.tsx";
import FourierWrapper, {
    IFourierColorSettings,
    IFourierProperties,
    IFourierStrokeSettings
} from "@/components/fourier/FourierWrapper.tsx";
import {useState} from "react";


function App() {

    const getHslString = (h: number, s: number, l: number): string => {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    const [strokes, setStrokes] = useState<IFourierStrokeSettings>({
        circleStroke: 0.05,
        radiusStroke: 0.1,
        pathStroke: 0.09,
        jointPointStroke: 0.3,
    });
    const [colors, setColors] = useState<IFourierColorSettings>({
        hslBase: [140, 5, 9],
        rotateCircleColor: false,
        rotateCircleColorDelay: 20,
        radiusColor: getHslString(190, 20, 10),
        circleColor: getHslString(1, 20, 100),
        jointPointColor: getHslString(100, 90, 60),
        backgroundColor: getHslString(123, 50, 1),
        showPathGradient: true,
        gradientColor: getHslString(6, 90, 50),
        gradientColor1: getHslString(6, 90, 50),
        gradientColor2: getHslString(6, 90, 50),

    });
    const [properties, setProperties] = useState<IFourierProperties>({
        numberOfCircles: 25,
        maxSpeed: 0.499,
        minSpeed: -0.499,
        speedDelta: 2,
        maxRadius: 5,
        radiusDelta: 0.5,
        animationSpeed: 10,
        zoom: 90,
        deletePath: false,
        pathDeletionDelay: 5,
        viewPort: "0 0 100 100"
    });

    return (
        <>
            <SidebarProvider>
                <MenuBar setProperties={setProperties} setStrokes={setStrokes} setColors={setColors} colors={colors}
                         strokes={strokes} properties={properties}/>
                <main>
                    {properties && strokes && colors ?
                        <FourierWrapper properties={properties} colors={colors} strokes={strokes} startPosition={[50, 50]} />
                        : null
                    }
                </main>
            </SidebarProvider>
        </>
    );
}

export default App
