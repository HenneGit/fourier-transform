import './App.css'
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {PropertiesMenu} from "@/components/menu/properties/PropertiesMenu.tsx";

import {useEffect, useState} from "react";
import MouseTracker from "@/components/ui/MouseTracker.tsx";
import {presets} from "@/presets.ts";
import {ColorSettings, RandomCirclesSettings, StrokeSettings, Point, ViewPort} from "@/model/model.ts";
import {SvgMenu} from "@/components/menu/svg/SvgMenu.tsx";
import FourierTransformRenderer from "@/components/fourier/FourierTransformRenderer.tsx";
import {transformNumberArrayToDimensions, transformPathToDimensions} from "@/components/menu/csv.helper.ts";
import RandomCirclesRenderer from "@/components/fourier/RandomCirclesRenderer.tsx";


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
    const [strokes, setStrokes] = useState<StrokeSettings>(presets[0].strokes);
    const [colors, setColors] = useState<ColorSettings>(presets[0].colors);
    const [properties, setProperties] = useState<RandomCirclesSettings>(presets[0].properties);
    const {width, height} = useWindowSize();
    const [isUploading, setIsUploading] = useState(false);
    const [key, setKey] = useState(0);
    const [path, setPath] = useState<Point[]>([]);
    const [viewPort, setViewPort] = useState<ViewPort>();

    useEffect(() => {
        const json = sessionStorage.getItem('path');
        if (json) {
            const item: Point[] = JSON.parse(json);
            if (item) {
                setPath(item);
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


    const adjustPathToViewPort = (path: Point[]) => {
        const transformedPath = transformPathToDimensions(path, width, height);
        console.log(path);

        if (transformedPath) {
            setPath(transformedPath);
        }
    };

    useEffect(() => {
        setViewPort({
            minX: -width / 2,
            minY: -height / 2,
            height: height,
            width: width
        })
    }, []);

    return (
        <>
            <SidebarProvider open={isPause}>
                <PropertiesMenu setPath={setPath} setKey={setKey} setIsUploading={setIsUploading}
                                setProperties={setProperties}
                                setStrokes={setStrokes} setColors={setColors}
                                strokes={strokes} properties={properties} colors={colors} height={height}
                                width={width}/>
                <SvgMenu setPath={adjustPathToViewPort} strokes={strokes} properties={properties} colors={colors}/>
                <main>
                    {properties && strokes && colors && viewPort && path ?
                        <>
                            <RandomCirclesRenderer inputPath={path} isPause={isPause} viewPort={viewPort} key={key}
                                                      properties={properties}
                                                      colors={colors} strokes={strokes}/>
                        </> : null
                    }
                </main>
                <MouseTracker isPaused={isPause} setClicked={setPause}/>
            </SidebarProvider>
        </>
    );
}

export default App
