import {useSettings} from "@/context/SettingsContext.tsx";
import {useActiveRendererId} from "@/context/ActiveRendererContext.tsx";
import {useEffect, useState} from "react";
import RNGCirclesRenderer from "@/components/fourier/RNGCirclesRenderer.tsx";
import {Point, ViewPort} from "@/model/model.ts";
import {presets} from "@/presets.ts";
import {v4 as uuidv4} from "uuid";
import {transformPathToDimensions} from "@/components/menu/csv.helper.ts";
import {useRNGSettings} from "@/context/RNGSettingsContext.tsx";
import CircleOverviewDrawer from "@/components/menu/properties/CircleOverviewDrawer.tsx";
import {useDisclosure} from "@heroui/modal";
import MouseTracker from "@/components/ui/MouseTracker.tsx";


const Main = ({width, height}: { width: number, height: number }) => {
    const [key, setKey] = useState(0);
    const [path, setPath] = useState<Point[]>([]);
    const [viewPort, setViewPort] = useState<ViewPort>();
    const {isOpen, onOpenChange} = useDisclosure();
    const {addSettings} = useSettings();
    const {setRNGSettingsList, currentRNGSettings} = useRNGSettings();
    const {setId, id} = useActiveRendererId();

    const [isPause, setPause] = useState(false);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            event.preventDefault();
            onPauseButtonClick();
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

    useEffect(() => {
        const id = uuidv4();
        setId(id);
        addSettings({id: id, strokeSettings: presets[1].strokes, colorSettings: presets[1].colors});
        setRNGSettingsList([{id: id, rngSettings: presets[1].properties}]);
        console.log('@sh');
    }, []);

    const onPauseButtonClick = () => {
        setPause(prevState => !prevState);
        onOpenChange();
    }

    const adjustPathToViewPort = (path: Point[]) => {
        const transformedPath = transformPathToDimensions(path, width, height);
        if (transformedPath) {
            setPath(transformedPath);
        }
    };



    return (
        <>
            {currentRNGSettings ?
                <>

                    <CircleOverviewDrawer isOpen={isOpen} onOpenChange={onOpenChange}/>
                    {id && viewPort ?
                        <>
                            <RNGCirclesRenderer isPause={isPause} viewPort={viewPort} key={key} id={id}/>
                        </>
                        : null
                    }
                </> : null
            }

            <MouseTracker isPaused={isPause} onClick={onPauseButtonClick}/>
        </>
    );
}

export default Main;