import {useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import * as d3 from "d3";
import {IFourierColorSettings, IFourierProperties, IFourierStrokeSettings} from "@/model/model.ts";

export interface FourierPoint {
    radius: number;
    frequency: number;
}

export interface ICircle {
    centerX: number;
    centerY: number;
    radius: number;
    angle: number;
    color: Array<number>;
}

type FourierWrapperProps = {
    properties: IFourierProperties;
    colors: IFourierColorSettings;
    strokes: IFourierStrokeSettings;
    startPosition: Array<number>;
    isPause: boolean;
    setStrokes: React.Dispatch<React.SetStateAction<IFourierStrokeSettings>>;
    setColors: React.Dispatch<React.SetStateAction<IFourierColorSettings>>;
}


const FourierWrapper: React.FC<FourierWrapperProps> = ({
                                                           properties,
                                                           colors,
                                                           strokes,
                                                           startPosition,
                                                           isPause,
                                                           setStrokes,
                                                           setColors
                                                       }) => {
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
    const [viewPort, setViewPort] = useState<[number, number, number, number]>(properties.viewPort)
    const [viewPortIncrement, setSetViewPortIncrement] = useState(0.05);
    useEffect(() => {
        const fourierPoint: FourierPoint[] = [];
        const newCircles: ICircle[] = [];
        setPoints([]);
        setViewPort(properties.viewPort)
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
                console.log(properties.numberOfCircles);
                console.log(startingCircles);
                setIsStart(false);
                if (startingCircles.length === properties.numberOfCircles) {
                    renderPath(startingCircles[properties.numberOfCircles - 1].centerX, startingCircles[properties.numberOfCircles - 1].centerY);
                }
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
        if (frequency % 10 > 0 && frequency % 10 < 1 && colors.rotateCircleColor) {
            cycleCircleColor();
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
                    if (currentCircle) {
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
                    }
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
            renderFastZoom();
            if (properties.addViewPortZoom) {
                incrementViewPort();

            }
        }
    }, [frequency, colors]);


    const cycleCircleColor = () => {
        for (let i = 0; i < circleColorArray.length; i++) {
            const generateNewColors = generateHSLSteps([90, 30, 30], 1.5);
            circleColorArray[circleColorArray.length - i - 1] = generateNewColors[i];
        }
    }

    const renderFastZoom = () => {
        if (viewPort[2] <= 100) {
            return;
        }
        setViewPort(prevNumbers => {
            return [
                prevNumbers[0] + viewPortIncrement / 2,
                prevNumbers[1] + viewPortIncrement / 2,
                prevNumbers[2] - viewPortIncrement,
                prevNumbers[3] - viewPortIncrement
            ];
        });
        setSetViewPortIncrement((prevState) => prevState + 0.012);
    }

    const incrementViewPort = () => {
        setViewPort(prevNumbers => {
            if (prevNumbers.length < 2) {
                return prevNumbers;
            }
            // const randomNumber = Math.random();
            // if ((randomNumber > 0.99 && randomNumber < 0.9999)) {
            //     setColors(presets[0].colors)
            //     setStrokes(presets[0].strokes)
            //     console.log((randomNumber > 0.9 && randomNumber < 0.99));
            // }

            if (prevNumbers[2] < 10|| prevNumbers[2] < 10) {
                return properties.viewPort;
            }
            return [
                prevNumbers[0] + 0.03,
                prevNumbers[1] + 0.03,
                prevNumbers[2] - 0.06,
                prevNumbers[3] - 0.06
            ];
        });
    };


    const getRandomNumber = (min: number, max: number, delta: number) => {
        if (Math.random() < 1 / 20) {
            return Math.random() * (max + delta - min + delta) + min + delta;
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

    const getViewPortString = () => {
        const s = viewPort.join(' ');
        console.log(s);
        return s;
    };

    return (
        <div className={'fourier-container'}>
            <svg style={{backgroundColor: getHslString(colors.backgroundColor)}} ref={svgRef} width="100%" height="100%"
                 viewBox={getViewPortString()}
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
