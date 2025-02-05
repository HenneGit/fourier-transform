import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import NextCircle from "./NextCircle.tsx";

type RotatingCircleProps = {
    centerX: number | undefined;
    centerY: number | undefined;
    radius: number;
    speed: number;
};

const StartCircle: React.FC<RotatingCircleProps> = ({centerX, centerY, radius, speed}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const circleRef = useRef<SVGCircleElement>(null);
    const lineRef = useRef<SVGLineElement>(null);
    const circles = [{radius:15, speed: 0.0019}, {radius:66, speed: 0.009}, {radius:100, speed: 0.001}, {radius:115, speed: 0.01}]

    const [newY, setY] = useState<number>();
    const [newX, setX] = useState<number>();
    const [newSpeed, setNewSpeed] = useState(0)
    useEffect(() => {
        const circle = d3.select(circleRef.current);
        const line = d3.select(lineRef.current);
        d3.timer((elapsed) => {
            const angle = (elapsed / speed) * Math.PI;
            let x;
            let y;
            if (centerX !== undefined && centerY !== undefined) {
                x = centerX + radius * Math.cos(angle);
                y = centerY + radius * Math.sin(angle);
                circle.attr("cx", x).attr("cy", y);
                line.attr("x1", centerX).attr("y1", centerY).attr("x2", x).attr("y2", y);
                setY(x);
                setX(y);
                setNewSpeed((prevSpeed) => prevSpeed + 0.008);
            }
        });
    }, [centerX, centerY]);


    return (
        <svg ref={svgRef} width={4000} height={4000}>
            <circle cx={centerX} cy={centerY} r={radius} stroke="black" fill="none" strokeWidth={0.4}/>
            <line ref={lineRef} stroke="black" strokeWidth={0.5}/>
            <circle ref={circleRef} r={5} fill="red"/>
            <NextCircle centerX={newY} centerY={newX} radius={circles[0].radius} speed={newSpeed} circles={circles} circleNo={0}></NextCircle>
        </svg>
    );
};

export default StartCircle;
