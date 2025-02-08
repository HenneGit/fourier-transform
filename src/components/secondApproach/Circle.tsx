import {useEffect, useRef} from "react";
import * as d3 from "d3";

type RotatingCircleProps = {
    circle: Circle;
};

export interface Circle  {
    centerX: number;
    centerY: number;
    radius: number;
    angle: number;
}

const Circle: React.FC<RotatingCircleProps> = ({circle}) => {
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
    }, [circle]);

    return (
        <>
            <circle cx={circle.centerX} cy={circle.centerY} r={circle.radius} stroke="grey" fill="none"
                    strokeWidth={1.4}/>
            <line ref={lineRef} stroke="grey" strokeWidth={1.8}/>
            <circle ref={circleRef} r={2} fill="grey"/>
        </>
    );
};

export default Circle;
