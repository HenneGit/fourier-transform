import {useEffect, useRef, useState} from "react";
import {ColorSettings, RandomCirclesSettings, StrokeSettings, Point, ViewPort} from "@/model/model.ts";
import {getHslString, getViewPortString} from "@/components/fourier/helpers.ts";


type StaticSVGProps = {
    properties: RandomCirclesSettings;
    colors: ColorSettings;
    strokes: StrokeSettings;
    inputPath: Point[];
    viewPort: ViewPort;
}


const StaticSVGPath: React.FC<StaticSVGProps> = ({
                                                     properties,
                                                     colors,
                                                     strokes,
                                                     inputPath,
                                                     viewPort,
                                                 }) => {

        const svgRef = useRef<SVGSVGElement>(null);
        const [path, setPath] = useState<string>('');

        useEffect(() => {
            if (inputPath && inputPath.length > 0) {
                const pathD = `M ${inputPath[0].x} ${inputPath[0].y} ` + inputPath.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
                setPath(pathD)
            }
        }, [properties, colors, strokes, path]);


        return (
            <div className={'svg-container'}>
                <svg style={{backgroundColor: getHslString(colors.backgroundColor), position:'relative'}} ref={svgRef}
                     viewBox={getViewPortString(viewPort)}  >
                    <path d={path}
                          stroke={colors.showPathGradient ? "url(#grad)" : getHslString(colors.pathColor)}
                          fill="none"
                          strokeWidth={strokes.pathStroke}/>

                </svg>
            </div>
        )
    }
;

export default StaticSVGPath;
