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
    animationSpeed: number;
    zoom: number;
    deletePath: boolean;
    pathDeletionDelay: number;
    viewPort: string;

}

export interface IFourierStrokeSettings {
    circleStroke: number;
    radiusStroke: number;
    pathStroke: number;
    jointPointStroke: number;
}


export interface IFourierColorSettings {
    hslBase: number[];
    rotateCircleColor: boolean;
    rotateCircleColorDelay: number;
    radiusColor: string;
    circleColor: string;
    jointPointColor: string;
    backgroundColor: string;
    showPathGradient: boolean,
    gradientColor: string;
    gradientColor1: string;
    gradientColor2: string;
}


const FourierWrapper:React.FC<IFourierSettings>  = ({properties, colors, strokes, startPosition, isPause}) => {
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
    const [circleColorArray, setCircleColorArray] = useState<string[]>([]);
    const [hslBase, setHslBase] = useState<number[]>(colors.hslBase);
    const numberOfCircles = properties.numberOfCircles;

    useEffect(() => {

        const fourierPoint: FourierPoint[] = [];
        const newCircles: ICircle[] = [];
        console.log(colors);
        for (let i = 0; i < numberOfCircles; i++) {
            let currentCircle;
            const radius = parseFloat((getRandomNumber(1, properties.maxRadius, properties.radiusDelta)).toFixed(3));
            const min = properties.minSpeed;
            const max = properties.maxSpeed;
            const frequency = parseFloat(getRandomNumber(min, max, properties.speedDelta).toFixed(3));
            fourierPoint.push({radius: radius, frequency: frequency})
            setCircleColorArray(prevState => [...prevState, incrementLightness(hslBase, 1, i * 0.001)]);
            circleColorArray.push(incrementLightness(hslBase, 1, i));
            if (i === 0) {
                currentCircle = {
                    centerX: startPosition[0],
                    centerY: startPosition[1],
                    radius: 1,
                    angle: 1,
                    color: circleColorArray[i]
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
                    color: circleColorArray[i]
                };
                newCircles.push(newCircle);
            }
        }
        setFourierPoints(fourierPoint)
        setCircles(newCircles);
    }, [properties, colors, strokes]);

    const incrementLightness = (hslBase: number[], lightnessIncrement: number, index: number) => {
        const [h, s, l] = hslBase;
        const newLightness = Math.min(100, l + lightnessIncrement * index);
        return `hsl(${h}, ${s}%, ${newLightness}%)`;
    };

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
            });
        }
    }, [circles]);

    //starts the main animation
    useEffect(() => {
        let animationFrameId: number;

        if (!isStart && !isPause) {
            const animate = (elapsed : number) => {
                setFrequency(elapsed / 1000);
                animationFrameId = requestAnimationFrame(animate);
            };
            animationFrameId = requestAnimationFrame(animate);
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
        if (frequency > properties.pathDeletionDelay && properties.deletePath) {
            points.splice(0, 1)
        }
        if (frequency % 10 > 0 && frequency % 10 < 1) {
            const newHslBase = hslBase[0] + 5
            setHslBase([newHslBase, hslBase[1], hslBase[2]]);
            for (let i = 0; i < circleColorArray.length; i++) {
                circleColorArray[i] = incrementLightness(hslBase, i, 0.2);
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
                    if (newCircles.length === fourierPoints.length && !isFirstRender && renderCycle > currentCircles.length + 150) {
                        currentCircle = currentCircles[i];
                        const angle = frequency * currentPoint.frequency * Math.PI;
                        const x = currentCircle.centerX + currentCircle.radius * Math.cos(angle);
                        const y = currentCircle.centerY + currentCircle.radius * Math.sin(angle);
                        renderPath(x, y);
                    }
                }
            }
            if (renderCycle <= currentCircles.length + 150 ) {
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
        <div className={'fourier-container'} style={{backgroundColor: colors.backgroundColor}}>
            <svg ref={svgRef} width="100%" height="100%" viewBox={properties.viewPort} preserveAspectRatio="xMidYMid meet">
                {isStart && startingCircles ? startingCircles.map((item, index) => (
                    <Circle key={index} circle={item} strokeSettings={strokes} colorSettings={colors}/>
                )) : null}
                {!isStart && circles && circles.map((item, index) => (
                    <Circle key={index} circle={item} strokeSettings={strokes} colorSettings={colors}/>
                ))}
                {colors.showPathGradient ?
                    <defs>
                        <linearGradient id="grad">
                            <stop offset="0%" stopColor={colors.gradientColor} />
                            <stop offset="50%" stopColor={colors.gradientColor1} />
                            <stop offset="100%" stopColor={colors.gradientColor2} />
                        </linearGradient>
                    </defs> : null
                }
                <path ref={pathRef} stroke="url(#grad)"   fill="none" strokeWidth={strokes.pathStroke}/>
            </svg>
        </div>
    )
};

export default FourierWrapper;
