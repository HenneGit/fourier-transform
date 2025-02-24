import './App.css'
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {PropertiesMenu} from "@/components/menu/properties/PropertiesMenu.tsx";

import {useEffect, useState} from "react";
import MouseTracker from "@/components/ui/MouseTracker.tsx";
import {presets} from "@/presets.ts";
import {IFourierColorSettings, IFourierProperties, IFourierStrokeSettings, Point} from "@/model/model.ts";
import FourierWrapper from "@/components/fourier/FourierWrapper.tsx";
import RandomCircles from "@/components/fourier/RandomCircles.tsx";
import {SvgMenu} from "@/components/menu/svg/SvgMenu.tsx";
import StaticSVGPath from "@/components/fourier/StaticSVGPath.tsx";


const useWindowSize = () => {
    const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});

    useEffect(() => {
        const handleResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
};

function App() {
    const [isPause, setPause] = useState(false);
    const [strokes, setStrokes] = useState<IFourierStrokeSettings>(presets[4].strokes);
    const [colors, setColors] = useState<IFourierColorSettings>(presets[4].colors);
    const [properties, setProperties] = useState<IFourierProperties>(presets[4].properties);
    const {width, height} = useWindowSize();
    const [isUploading, setIsUploading] = useState(false);
    const [key, setKey] = useState(0);
    const [path, setPath] = useState<Point[] | undefined>();
    useEffect(() => {
        const json = sessionStorage.getItem('path');
        if (json) {
            const item: Point[] = JSON.parse(json);
            if (item) {
                setProperties((prev) => ({
                    ...prev,
                    path: item
                }));
            }
        }

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


    useEffect(() => {
        setProperties((prev) => ({
            ...prev,
            viewPort:    {
                minX: -width / 2,
                minY: -height / 2,
                height: height,
                width: width
            }
        }));
    }, []);

    return (
        <>
            <SidebarProvider open={isPause}>
                <PropertiesMenu setPath={setPath} setKey={setKey} setIsUploading={setIsUploading} setProperties={setProperties}
                                setStrokes={setStrokes} setColors={setColors}
                                strokes={strokes} properties={properties} colors={colors} height={height}
                                width={width}/>
                <SvgMenu setKey={setKey} setIsUploading={setIsUploading} setProperties={setProperties}
                         setStrokes={setStrokes} setColors={setColors}
                         strokes={strokes} properties={properties} colors={colors} height={height} width={width}/>
                <main>
                    {!isUploading && properties && strokes && colors &&
                        <>
                            <StaticSVGPath inputPath={path} key={key} isPause={isPause} properties={properties}
                                           colors={colors} strokes={strokes}/>
                        </>
                    }
                </main>
                <MouseTracker isPaused={isPause} setClicked={setPause}/>
            </SidebarProvider>
        </>
    );
}

export default App
