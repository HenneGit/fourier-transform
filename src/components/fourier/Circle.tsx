import {useEffect, useRef} from "react";
import * as d3 from "d3";
import {IFourierColorSettings, IFourierStrokeSettings} from "./FourierWrapper.tsx";

type RotatingCircleProps = {
    circle: Circle;
    strokeSettings: IFourierStrokeSettings;
    colorSettings: IFourierColorSettings;
};

export interface Circle  {
    centerX: number;
    centerY: number;
    radius: number;
    angle: number;
    color: string;
}

const Circle: React.FC<RotatingCircleProps> = ({circle, colorSettings, strokeSettings}) => {
    const circleRef = useRef<SVGCircleElement>(null);
    const lineRef = useRef<SVGLineElement>(null);

    useEffect(() => {

        const circleSvg = d3.select(circleRef.current);
        const line = d3.select(lineRef.current);
        if (circle.centerX !== undefined && circle.centerY !== undefined) {
            const x = circle.centerX + circle.radius * Math.cos(circle.angle);
            const y = circle.centerY + circle.radius * Math.sin(circle.angle);
            circleSvg.attr("cx", x).attr("cy", y);
            line.attr("x1", circle.centerX).attr("y1", circle.centerY).attr("x2", x).attr("y2", y);
        }
    }, [circle, colorSettings]);

    return (
        <>
            <circle cx={circle.centerX} cy={circle.centerY} r={circle.radius} stroke={colorSettings.rotateCircleColor ? colorSettings.circleColor : circle.color} fill="none"
                    strokeWidth={strokeSettings.circleStroke}/>
            <line ref={lineRef} stroke={colorSettings.radiusColor} strokeWidth={strokeSettings.radiusStroke}/>
            <circle ref={circleRef} r={strokeSettings.jointPointStroke} fill={colorSettings.jointPointColor}/>
        </>
    );
};

export default Circle;
