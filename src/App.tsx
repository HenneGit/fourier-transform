import './App.css'
import FourierWrapper, {
    IFourierColorSettings,
    IFourierProperties,
    IFourierStrokeSettings
} from "./components/FourierWrapper.tsx";
import {useEffect, useState} from "react";

function App() {


    const [strokes, setStrokes] = useState<IFourierStrokeSettings>();
    const [colors, setColors] = useState<IFourierColorSettings>();
    const [properties, setProperties] = useState<IFourierProperties>();

    useEffect(() => {
        const newStrokes: IFourierStrokeSettings = {
            circleStroke: 2.1,
            radiusStroke: 3.1,
            pathStroke: 4,
            jointPointStroke: 1,
        };
        const newColors: IFourierColorSettings = {
            hslBase: [140, 5, 9],
            rotatingColor: true,
            rotatingColorDelay: 30,
            radiusColor: getHslString(90, 20, 1),
            circleColor: getHslString(90, 20, 1),
            jointPointColor: getHslString(90, 20, 1),
            backgroundColor: getHslString(90, 20, 1),
        };
        const newProperties: IFourierProperties = {
            numberOfCircles: 140,
            maxSpeed: 0.499,
            minSpeed: -0.499,
            speedDelta: 3,
            maxRadius: 210,
            radiusDelta: 90,
            animationSpeed: 10,
            zoom: 90,
            deletePath: false,
            pathDeletionDelay: 90,
        };
        setStrokes(newStrokes);
        setProperties(newProperties)
        setColors(newColors);
    }, []);

    const getHslString = (h: number, s: number, l: number): string => {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    return (
        <>
            {strokes && colors && properties ?
                <FourierWrapper strokes={strokes} colors={colors} properties={properties}></FourierWrapper>
                : null}
        </>
    );
}

export default App
