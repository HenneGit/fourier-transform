import {useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import * as d3 from "d3";
import {
    FourierTransform,
    ICircle,
    IFourierColorSettings,
    IFourierProperties,
    IFourierStrokeSettings,
    Point,
    ViewPort
} from "@/model/model.ts";
import path from "path";
import {getHslString, getViewPortString} from "@/components/fourier/helpers.ts";


type FourierWrapperProps = {
    properties: IFourierProperties;
    colors: IFourierColorSettings;
    strokes: IFourierStrokeSettings;
    inputPath: Point[] | undefined;
    isPause: boolean;
}


const FourierWrapper: React.FC<FourierWrapperProps> = ({
                                                           properties,
                                                           colors,
                                                           strokes,
                                                           inputPath
                                                       }) => {

        const svgRef = useRef<SVGSVGElement>(null);
        const [path, setPath] = useState<string>('');

        useEffect(() => {
            if (inputPath) {
                const pathD = `M ${inputPath[0].x} ${inputPath[0].y} ` + inputPath.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
                setPath(pathD)
            }
        }, [properties, colors, strokes, path]);


        return (
            <div className={'fourier-container'}>
                <svg style={{backgroundColor: getHslString(colors.backgroundColor)}} ref={svgRef} width="100%" height="100%"
                     viewBox={getViewPortString(properties.viewPort)}>
                    <path d={path}
                          stroke={colors.showPathGradient ? "url(#grad)" : getHslString(colors.pathColor)}
                          fill="none"
                          strokeWidth={strokes.pathStroke}/>

                </svg>
            </div>
        )
    }
;

export default FourierWrapper;
