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
    color: string;
}

const FourierWrapper = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [fourierPoints, setFourierPoints] = useState<FourierPoint[]>();
    const [circles, setCircles] = useState<ICircle[]>();
    const [startingCircles, setStartingCircles] = useState<ICircle[]>([]);
    const [frequency, setFrequency] = useState(0);
    const startPosition = [2800, 2800];
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);  // To store points
    const pathRef = useRef<SVGPathElement>(null);
    const [isStart, setIsStart] = useState(true);
    const intervalMs = 1;
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [renderCycle, setRenderCycle] = useState<number>(1);
    const [colors, setColors] = useState<string[]>([]);
    const hslBase = [60, 50, 30];
    const maxCircles = 55;

    useEffect(() => {
        console.log("Hallo");
        const fourierPoint: FourierPoint[] = [];
        const newCircles: ICircle[] = [];

        for (let i = 0; i < maxCircles; i++) {
            let currentCircle;
            const radius = parseFloat((getRandomNumber(61, 360, -60)).toFixed(3));
            const min = -0.499;
            const max = 0.499;
            const frequency = parseFloat(getRandomNumber(min, max, 2).toFixed(3));
            fourierPoint.push({radius: radius, frequency: frequency})
            setColors(prevState => [...prevState, getBrighterColor(hslBase, 1, i)]);
            colors.push(getBrighterColor(hslBase, 1, i));
            if (i === 0) {
                currentCircle = {
                    centerX: startPosition[0],
                    centerY: startPosition[1],
                    radius: 1,
                    angle: 1,
                    color: colors[i]
                };
                newCircles.push(currentCircle);
            } else {
                currentCircle = newCircles[i - 1];
                const angle = frequency * frequency * Math.PI;
                const x = currentCircle.centerX + currentCircle.radius * Math.cos(currentCircle.angle);
                const y = currentCircle.centerY + currentCircle.radius * Math.sin(currentCircle.angle);
                const newCircle = {
                    centerX: x,
                    centerY: y,
                    radius: radius,
                    angle: angle,
                    color: colors[i]
                };
                newCircles.push(newCircle);
            }
        }
        setFourierPoints(fourierPoint)
        setCircles(newCircles);
    }, []);

    const getBrighterColor = (hslBase: number[], lightnessIncrement: number, index: number) => {
        const [h, s, l] = hslBase;
        const newLightness = Math.min(100, l + lightnessIncrement * index);
        return `hsl(${h}, ${s}%, ${newLightness}%)`;
    };


    useEffect(() => {
        if (!isStart) {
            return;
        }
        if (circles) {
            let resolveFn: (() => void) | null = null;
            const renderingPromise = new Promise<void>((resolve) => {
                resolveFn = resolve;
            });
            let lastTimestamp = 0;
            let index = 0;
            const renderItems = (timestamp: number) => {
                if (index === circles.length -1) {
                    console.log(fourierPoints)
                    resolveFn?.();
                    return;
                }
                if (timestamp - lastTimestamp >= intervalMs) {
                    lastTimestamp = timestamp;
                    setStartingCircles((prev) => [...prev, circles[index]]);
                    index++;
                }
                requestAnimationFrame(renderItems);
            };
            requestAnimationFrame(renderItems);

            renderingPromise.then(() => {
                setIsStart(false);
            });
        }
        console.log(startingCircles);
    }, [circles]);


    useEffect(() => {
        if (!isStart) {
            d3.timer((elapsed) => {
                setFrequency(elapsed / 1000);
            });
        }
    }, [isStart]);


    useEffect(() => {
        const currentCircles = isFirstRender ? startingCircles : circles;
        if (frequency > 15) {
            points.splice(0,1)
        }
        if (fourierPoints && currentCircles && !isStart) {
            const newCircles: ICircle[] = [];
            for (let i = 0; i < fourierPoints.length; i++) {
                let currentCircle;
                const currentPoint = fourierPoints[i];
                if (i === 0) {
                    const angle = frequency * currentPoint.frequency * Math.PI;
                    currentCircle = {
                        centerX: startPosition[0],
                        centerY: startPosition[1],
                        radius: 1,
                        angle: angle,
                        color: colors[i]
                    };
                    newCircles.push(currentCircle);
                } else {
                    currentCircle = currentCircles[i - 1];
                    const angle = frequency * currentPoint.frequency * Math.PI;
                    const x = currentCircle.centerX + currentCircle.radius * Math.cos(currentCircle.angle);
                    const y = currentCircle.centerY + currentCircle.radius * Math.sin(currentCircle.angle);
                    const newCircle = {
                        centerX: x,
                        centerY: y,
                        radius: currentPoint.radius,
                        angle: angle,
                        color: colors[i]
                    };
                    newCircles.push(newCircle);
                    if (newCircles.length === fourierPoints.length && !isFirstRender && renderCycle > currentCircles.length) {
                        renderPath(x, y);
                    }
                }
            }
            if (renderCycle <= currentCircles.length) {
                setRenderCycle((prevState) => prevState + 1);
            }
            setIsFirstRender(false);
            setCircles(newCircles);
        }
    }, [frequency]);


    const getRandomNumber = (min: number, max: number, extremeValue: number) => {
        if (Math.random() < 1 / 20) {
            return Math.random() * (max + extremeValue - min + extremeValue) + min + extremeValue;
        } else {
            return Math.random() * (max - min) + min;
        }
    };


    const renderPath = (x: number, y: number) => {
        const graph = d3.select(pathRef.current);
        setPoints((prevPoints) => [...prevPoints, {x, y}]);
        const pathData = points.map((point, index) => {
            return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
        }).join(" ");
        graph.attr("d", pathData);
    };

    return (
        <div className={'fourier-container'}>
            <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 5800 5800" preserveAspectRatio="xMidYMid meet">
                {isStart && startingCircles ? startingCircles.map((item, index) => (
                    <Circle key={index} circle={item}/>
                )) : null}
                {!isStart && circles && circles.map((item, index) => (
                    <Circle key={index} circle={item}/>
                ))}
                <path ref={pathRef} stroke="#FFFFFFDD" fill="none" strokeWidth={2.1}/>
            </svg>
        </div>
    )
};

export default FourierWrapper;
