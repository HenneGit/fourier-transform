import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {CircleProps} from "./CircleWrapper.tsx";

type RotatingCircleProps = {
    centerX: number | undefined;
    centerY: number | undefined;
    circles: CircleProps[];
    circleNo: number;
    baseFrequency: number;
};

const NextCircle: React.FC<RotatingCircleProps> = ({centerX, centerY, circles, circleNo, baseFrequency}) => {
    const circleRef = useRef<SVGCircleElement>(null);
    const lineRef = useRef<SVGLineElement>(null);
    const finalLineRef = useRef<SVGPathElement>(null);  // Ref for the path element
    const [newX, setNewX] = useState<number>()
    const [newY, setNewY] = useState<number>()
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);  // To store points

    useEffect(() => {
        const circle = d3.select(circleRef.current);
        const line = d3.select(lineRef.current);
        const angle = baseFrequency * circles[circleNo].frequency * Math.PI;

        if (centerX !== undefined && centerY !== undefined) {
            const x = centerX + circles[circleNo].radius * Math.cos(angle);
            const y = centerY + circles[circleNo].radius * Math.sin(angle);
            circle.attr("cx", x).attr("cy", y);
            line.attr("x1", centerX).attr("y1", centerY).attr("x2", x).attr("y2", y);
            setNewX(x);
            setNewY(y);
            if (circleNo === circles.length - 1) {
                const finalLine = d3.select(finalLineRef.current);
                setPoints((prevPoints) => [...prevPoints, {x, y}]);
                const pathData = points.map((point, index) => {
                    return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
                }).join(" ");
                finalLine.attr("d", pathData);
            }
        }
    }, [centerX, centerY]);

    return (
        <>
            {baseFrequency > 0 &&
                <>
                    <circle cx={centerX} cy={centerY} r={circles[circleNo].radius} stroke="white" fill="none"
                            strokeWidth={2.4}/>
                    <line ref={lineRef} stroke="white" strokeWidth={2.4}/>
                    <circle ref={circleRef} r={2} fill="grey"/>
                    <>{circles[circleNo].radius}</>
                    {circleNo < circles.length - 1 ?
                        <NextCircle centerX={newX} centerY={newY} circles={circles} baseFrequency={baseFrequency}
                                    circleNo={circleNo + 1}></NextCircle> :
                        <path ref={finalLineRef} stroke="white" fill="none" strokeWidth={7.8}/>
                    }
                </>
            }
        </>
    );
};

export default NextCircle;
