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
        circleStroke: 0.01,
        radiusStroke: 0.01,
        pathStroke: 0.09,
        jointPointStroke: 0.01,
    });
    const [colors, setColors] = useState<IFourierColorSettings>({
        hslBase: [140, 5, 9],
        rotateCircleColor: false,
        rotateCircleColorDelay: 30,
        radiusColor: getHslString(190, 20, 100),
        circleColor: getHslString(1, 20, 100),
        jointPointColor: getHslString(132, 20, 102),
        backgroundColor: getHslString(123, 50, 1),
        showPathGradient: false,
        gradientColor: getHslString(190, 50, 60),
        gradientColor1: getHslString(90, 100, 120),
        gradientColor2: getHslString(10, 20, 30),

    });
    const [properties, setProperties] = useState<IFourierProperties>({
        numberOfCircles: 20,
        maxSpeed: 0.499,
        minSpeed: -0.499,
        speedDelta: 3,
        maxRadius: 5,
        radiusDelta: 2,
        animationSpeed: 10,
        zoom: 90,
        deletePath: true,
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
