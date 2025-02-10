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
    color: number[];
}

type IFourierSettings = {
    properties: IFourierProperties;
    colors: IFourierColorSettings;
    strokes: IFourierStrokeSettings;
    startPosition: number[];
    isPause: boolean;
}

export interface IFourierProperties {
    numberOfCircles: number;
    maxSpeed: number;
    minSpeed: number;
    speedDelta: number;
    maxRadius: number;
    radiusDelta: number;
    zoom: number;
    viewPort: string;

}

export interface IFourierStrokeSettings {
    circleStroke: number;
    radiusStroke: number;
    pathStroke: number;
    jointPointStroke: number;
    deletePath: boolean;
    deletePathDelay: number;
}


export interface IFourierColorSettings {
    hslBase: number[];
    rotateCircleColor: boolean;
    rotateCircleColorDelay: number;
    radiusColor: number[];
    circleColor: number[];
    pathColor: number[];
    jointPointColor: number[];
    backgroundColor: number[];
    showPathGradient: boolean,
    gradientColor: number[];
    gradientColor1: number[];
    gradientColor2: number[];
}


const FourierWrapper: React.FC<IFourierSettings> = ({properties, colors, strokes, startPosition, isPause}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [fourierPoints, setFourierPoints] = useState<FourierPoint[]>();
    const [circles, setCircles] = useState<ICircle[]>();
    const [startingCircles, setStartingCircles] = useState<ICircle[]>([]);
    const [frequency, setFrequency] = useState(0);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const pathRef = useRef<SVGPathElement>(null);
    const [isStart, setIsStart] = useState(true);
    const intervalMs = 2;
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [renderCycle, setRenderCycle] = useState<number>(1);
    const [circleColorArray, setCircleColorArray] = useState<[number, number, number][]>([]);
    const [savedElapsed, setSavedElapsed] = useState(0);


    useEffect(() => {
        const fourierPoint: FourierPoint[] = [];
        const newCircles: ICircle[] = [];
        setPoints([]);
        setRenderCycle(0);
        setSavedElapsed(0);
        const circleColors = generateHSLSteps(colors.circleColor, 2);
        for (let i = 0; i < properties.numberOfCircles; i++) {
            let currentCircle;
            const radius = parseFloat((getRandomNumber(1, properties.maxRadius, properties.radiusDelta)).toFixed(3));
            const min = properties.minSpeed;
            const max = properties.maxSpeed;
            const frequency = parseFloat(getRandomNumber(min, max, properties.speedDelta).toFixed(3));
            fourierPoint.push({radius: radius, frequency: frequency});
            if (i === 0) {
                currentCircle = {
                    centerX: startPosition[0],
                    centerY: startPosition[1],
                    radius: parseFloat((getRandomNumber(1, properties.maxRadius, properties.radiusDelta)).toFixed(3)),
                    angle: parseFloat(getRandomNumber(min, max, properties.speedDelta).toFixed(3)),
                    color: circleColors[i]
                };
                newCircles.push(currentCircle);
            } else {
                currentCircle = newCircles[i - 1];
                const angle = frequency * Math.PI;
                const x = currentCircle.centerX + currentCircle.radius * Math.cos(currentCircle.angle);
                const y = currentCircle.centerY + currentCircle.radius * Math.sin(currentCircle.angle);
                const newCircle = {
                    centerX: x,
                    centerY: y,
                    radius: radius,
                    angle: angle,
                    color: circleColors[i]
                };
                newCircles.push(newCircle);
            }
        }
        setCircleColorArray(circleColors);
        setFourierPoints(fourierPoint)
        setCircles(newCircles);
    }, [properties]);


    function generateHSLSteps(startColor: number[], step: number): [number, number, number][] {
        const [h, s, l] = startColor;
        const colors: [number, number, number][] = [];
        for (let i = 0; i < properties.numberOfCircles; i++) {
            const newL = Math.min(100, l + i * step);
            colors.push([h, s, newL]);
        }
        return colors;
    }

    //plays starting animation
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
                if (index === circles.length - 1) {
                    resolveFn?.();
                    return;
                }
                if (index === 0 || timestamp - lastTimestamp >= intervalMs) {
                    lastTimestamp = timestamp;
                    setStartingCircles((prev) => [...prev, circles[index]]);
                    index++;
                }
                requestAnimationFrame(renderItems);
            };
            requestAnimationFrame(renderItems);
            renderingPromise.then(() => {
                setIsStart(false);
                renderPath(startingCircles[properties.numberOfCircles - 1].centerX, startingCircles[properties.numberOfCircles - 1].centerY);
            });
        }
    }, [circles]);


    useEffect(() => {
        let animationFrameId: number;
        let startTime: number | null = null;

        if (!isStart && !isPause) {
            startTime = performance.now();
            const animate = () => {
                if (!startTime) {
                    startTime = 0;
                }
                const elapsed = performance.now() - startTime + savedElapsed;
                setFrequency(elapsed / 1000);
                animationFrameId = requestAnimationFrame(animate);
            };
            animationFrameId = requestAnimationFrame(animate);
        } else if (isPause) {
            setSavedElapsed(frequency * 1000);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isStart, isPause]);


    //renders the circle stack
    useEffect(() => {
        const currentCircles = isFirstRender ? startingCircles : circles;
        if (frequency > strokes.deletePathDelay + savedElapsed / 1000 && strokes.deletePath) {
            points.splice(0, 1)
        }
        const generateNewColors = generateHSLSteps([90, 30, 30], 1.5);
        if (frequency % 10 > 0 && frequency % 10 < 1 && colors.rotateCircleColor) {
            for (let i = 0; i < circleColorArray.length; i++) {
                circleColorArray[circleColorArray.length - i -1 ] = generateNewColors[i];
            }
        }
        if (fourierPoints && currentCircles) {
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
                        color: circleColorArray[i]
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
                        color: circleColorArray[i]
                    };
                    newCircles.push(newCircle);
                    if (newCircles.length === fourierPoints.length && !isFirstRender && renderCycle > currentCircles.length + properties.numberOfCircles) {
                        currentCircle = currentCircles[i];
                        const angle = frequency * currentPoint.frequency * Math.PI;
                        const x = currentCircle.centerX + currentCircle.radius * Math.cos(angle);
                        const y = currentCircle.centerY + currentCircle.radius * Math.sin(angle);
                        renderPath(x, y);
                    }
                }
            }
            if (renderCycle <= currentCircles.length + properties.numberOfCircles) {
                setRenderCycle((prevState) => prevState + 1);
            }
            setIsFirstRender(false);
            setCircles(newCircles);
        }
    }, [frequency, colors]);


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

    const getHslString = (hsl: number[]): string => {
        return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
    }
    return (
        <div className={'fourier-container'}>
            <svg style={{backgroundColor: getHslString(colors.backgroundColor)}} ref={svgRef} width="100%" height="100%"
                 viewBox={properties.viewPort}
                 preserveAspectRatio="xMidYMid meet">
                {isStart && startingCircles ? startingCircles.map((item, index) => (
                    <Circle key={index} circle={item} strokeSettings={strokes} colorSettings={colors}/>
                )) : null}
                {!isStart && circles && circles.map((item, index) => (
                    <Circle key={index} circle={item} strokeSettings={strokes} colorSettings={colors}/>
                ))}
                {colors.showPathGradient ?
                    <defs>
                        <linearGradient id="grad">
                            <stop offset="0%" stopColor={getHslString(colors.gradientColor)}/>
                            <stop offset="50%" stopColor={getHslString(colors.gradientColor1)}/>
                            <stop offset="100%" stopColor={getHslString(colors.gradientColor2)}/>
                        </linearGradient>
                    </defs> : null
                }
                {points.length > 0 ? <path ref={pathRef}
                                           stroke={colors.showPathGradient ? "url(#grad)" : getHslString(colors.pathColor)}
                                           fill="none"
                                           strokeWidth={strokes.pathStroke}/> : null
                }
            </svg>
        </div>
    )
};

export default FourierWrapper;
