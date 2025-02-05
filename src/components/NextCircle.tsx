import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

type RotatingCircleProps = {
    centerX: number | undefined;
    centerY: number | undefined;
    radius: number;
    speed: number;
    circles: {radius: number, speed: number}[];
    circleNo: number;
};

const NextCircle: React.FC<RotatingCircleProps> = ({centerX, centerY, radius, speed, circles, circleNo}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const circleRef = useRef<SVGCircleElement>(null);
    const lineRef = useRef<SVGLineElement>(null);
    const finalLineRef = useRef<SVGPathElement>(null);  // Ref for the path element
    const [newSpeed, setNewSpeed] = useState(speed)
    const [newX, setNewX] = useState<number>()
    const [newY, setNewY] = useState<number>()
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);  // To store points
    useEffect(() => {
        const circle = d3.select(circleRef.current);
        const line = d3.select(lineRef.current);
        const angle = speed + 5 * Math.PI;

        if (centerX !== undefined && centerY !== undefined) {
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            circle.attr("cx", x).attr("cy", y);
            line.attr("x1", centerX).attr("y1", centerY).attr("x2", x).attr("y2", y);
            setNewSpeed((prevState) => prevState + circles[circleNo].speed)
            setNewX(x);
            setNewY(y);
            if (circleNo === circles.length -1) {
                const finalLine = d3.select(finalLineRef.current);

                setPoints((prevPoints) => [...prevPoints, { x, y }]);
                const pathData = points.map((point, index) => {
                    return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
                }).join(" ");

                finalLine.attr("d", pathData);
            }
        }

    }, [centerX, centerY]);

    return (
        <svg ref={svgRef} width={4000} height={4000}>
            <circle cx={centerX} cy={centerY} r={radius} stroke="black" fill="none" strokeWidth={0.4}/>
            <line ref={lineRef} stroke="black" strokeWidth={0.5}/>
            <circle ref={circleRef} r={5} fill="red"/>
            {circleNo < circles.length  -1 ?
                <NextCircle centerX={newX} centerY={newY} radius={circles[circleNo].radius} speed={newSpeed} circles={circles} circleNo={circleNo +1}></NextCircle> :  <path ref={finalLineRef} stroke="blue" fill="none" strokeWidth={0.5} />
            }
        </svg>
    );
};

export default NextCircle;
