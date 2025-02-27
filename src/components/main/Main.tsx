import {useSettings} from "@/context/SettingsContext.tsx";
import {useActiveRendererId} from "@/context/ActiveRendererContext.tsx";
import {useEffect, useState} from "react";
import RNGCirclesRenderer from "@/components/fourier/RNGCirclesRenderer.tsx";
import {Point, ViewPort} from "@/model/model.ts";
import {presets} from "@/presets.ts";
import {v4 as uuidv4} from "uuid";
import {transformPathToDimensions} from "@/components/menu/csv.helper.ts";
import {useRNGSettings} from "@/context/RNGSettingsContext.tsx";


const Main = ({width, height, isPause}: { width: number, height: number, isPause: boolean }) => {
    const [key, setKey] = useState(0);
    const [path, setPath] = useState<Point[]>([]);
    const [viewPort, setViewPort] = useState<ViewPort>();

    const {addSettings} = useSettings();
    const {setRNGSettingsList} = useRNGSettings();
    const {setId, id} = useActiveRendererId();

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
        addSettings({id: id, strokeSettings: presets[0].strokes, colorSettings: presets[0].colors});
        setRNGSettingsList([{id: id, rngSettings: presets[0].properties}]);
        console.log('@sh');
    }, []);


    const adjustPathToViewPort = (path: Point[]) => {
        const transformedPath = transformPathToDimensions(path, width, height);
        if (transformedPath) {
            setPath(transformedPath);
        }
    };

    return (
        <>
            {id && viewPort ?
                <>
                    <RNGCirclesRenderer isPause={isPause} viewPort={viewPort} key={key} id={id}/>
                </> : null
            }
        </>
    );
}

export default Main;