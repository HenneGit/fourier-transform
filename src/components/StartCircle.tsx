import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import NextCircle from "./NextCircle.tsx";
import {CircleProps} from "./CircleWrapper.tsx";

type RotatingCircleProps = {
    centerX: number | undefined;
    centerY: number | undefined;
    radius: number;
    circles: CircleProps[]
};


const StartCircle: React.FC<RotatingCircleProps> = ({centerX, centerY, radius,circles}) => {
    const circleRef = useRef<SVGCircleElement>(null);
    const lineRef = useRef<SVGLineElement>(null);

    const [frequency, setfrequency] = useState(0);
    const [newY, setY] = useState<number>();
    const [newX, setX] = useState<number>();
    useEffect(() => {
        const circle = d3.select(circleRef.current);
        const line = d3.select(lineRef.current);
        d3.timer((elapsed) => {
            const angle = (elapsed / 1000) * Math.PI;
            setfrequency(elapsed / 1000);
            let x;
            let y;
            if (centerX !== undefined && centerY !== undefined) {
                x = centerX + radius * Math.cos(angle);
                y = centerY + radius * Math.sin(angle);
                circle.attr("cx", x).attr("cy", y);
                line.attr("x1", centerX).attr("y1", centerY).attr("x2", x).attr("y2", y);
                setY(x);
                setX(y);
            }
        });
    }, [centerX, centerY]);

    return (
        <>
            <circle cx={centerX} cy={centerY} r={radius} stroke="black" fill="none" strokeWidth={0.4}/>
            <line ref={lineRef} stroke="black" strokeWidth={0.5}/>
            <circle ref={circleRef} r={2} fill="red"/>
            <NextCircle centerX={newY} centerY={newX} circles={circles} baseFrequency={frequency} circleNo={0}></NextCircle>
        </>
    );
};

export default StartCircle;
