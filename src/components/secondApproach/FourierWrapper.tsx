import {useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import * as d3 from "d3";


export interface FourierPoint {
    radius: number;
    frequency: number;
}

export interface ICircle {
    centerX: number;
    centerY: number;
    radius: number;
    angle: number;
}

const FourierWrapper = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [fourierPoints, setFourierPoints] = useState<FourierPoint[]>();
    const [circles, setCircles] = useState<ICircle[]>();
    const [frequency, setFrequency] = useState(0);
    const startPosition = [2800, 2800];
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);  // To store points
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const fourierPoint: FourierPoint[] = [];
        const newCircles: ICircle[] = [];
        for (let i = 0; i < 10; i++) {
            let currentCircle;

            const radius = parseFloat((Math.random() * 50).toFixed(3));
            const min = -0.999;
            const max = 0.999;
            const frequency = parseFloat(getRandomNumber(min, max).toFixed(3));
            fourierPoint.push({radius: radius, frequency: frequency})
            if (i === 0) {
                currentCircle = {centerX: startPosition[0], centerY: startPosition[1], radius: 1, angle: 1};
                newCircles.push(currentCircle);
            } else {
                currentCircle = {centerX: startPosition[0], centerY: startPosition[1], radius: radius, angle: frequency};
                newCircles.push(currentCircle);
            }
        }
        setFourierPoints(fourierPoint)
        setCircles(newCircles);
        console.log(newCircles);
    }, []);


    useEffect(() => {
        d3.timer((elapsed) => {
            setFrequency(elapsed / 1000);
        });
    }, [fourierPoints]);


    useEffect(() => {

        if (fourierPoints && circles) {
            for (let i = 0; i < fourierPoints.length; i++) {
                let currentCircle;
                const currentPoint = fourierPoints[i];
                if (i === 0) {
                    currentCircle = {centerX: startPosition[0], centerY: startPosition[1], radius: 1, angle: 1};
                } else {
                    currentCircle = circles[i - 1];
                    const angle = frequency * currentPoint.frequency * Math.PI;
                    const x = currentCircle.centerX + currentCircle.radius * Math.cos(currentCircle.angle);
                    const y = currentCircle.centerY + currentCircle.radius * Math.sin(currentCircle.angle);
                    currentCircle.centerX = x;
                    currentCircle.centerY = y;
                    currentCircle.angle = angle;
                    if (circles.length === fourierPoints.length) {
                        const graph = d3.select(pathRef.current);
                        setPoints((prevPoints) => [...prevPoints, {x, y}]);
                        const pathData = points.map((point, index) => {
                            return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
                        }).join(" ");
                        graph.attr("d", pathData);
                    }
                }
            }
        }
    }, [frequency]);

    function getRandomNumber(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    return (
        <div style={{background: "black", width: "100%", height: "100%"}}>
            <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 5800 5800" preserveAspectRatio="xMidYMid meet">
                {circles && circles.map((item, index) => (
                    <Circle key={index} circle={item}/>
                ))}
                <path ref={pathRef} stroke="white" fill="none" strokeWidth={3}/>
            </svg>
        </div>
    )
};

export default FourierWrapper;
