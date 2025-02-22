import {useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import * as d3 from "d3";
import {
    FourierTransform,
    ICircle,
    IFourierColorSettings,
    IFourierProperties,
    IFourierStrokeSettings,
    Point,
    ViewPort
} from "@/model/model.ts";
import path from "path";
import {getHslString, getViewPortString} from "@/components/fourier/helpers.ts";


type FourierWrapperProps = {
    properties: IFourierProperties;
    colors: IFourierColorSettings;
    strokes: IFourierStrokeSettings;
    isPause: boolean;
}


const FourierWrapper: React.FC<FourierWrapperProps> = ({
                                                           properties,
                                                           colors,
                                                           strokes,
                                                           isPause,
                                                       }) => {
        const intervalMs = 1;
        const svgRef = useRef<SVGSVGElement>(null);
        const pathRef = useRef<SVGPathElement>(null);
        const [fourierPoints, setFourierSteps] = useState<FourierTransform[]>();
        const [circles, setCircles] = useState<ICircle[] | undefined>();
        const [startingCircles, setStartingCircles] = useState<ICircle[] | undefined>([]);
        const [currentFrequency, setCurrentFrequency] = useState(0);
        const [points, setPath] = useState<Point[]>(properties.path ? properties.path : []);
        const [isStart, setIsStart] = useState(true);
        const [circleColorArray, setCircleColorArray] = useState<[number, number, number][]>([]);
        const [viewPort, setViewPort] = useState<ViewPort>(properties.viewPort)
        const [viewPortIncrement, setSetViewPortIncrement] = useState(0.05);
        const [animationSpeed, setAnimationSpeed] = useState(1)

        useEffect(() => {
            const fourierPoints: FourierTransform[] = [];
            const newCircles: ICircle[] = [];
            setCurrentFrequency(0);
            setFourierSteps(undefined)
            setPath([]);
            setIsStart(true);
            setCircles(undefined);
            setStartingCircles(undefined)
            setViewPort(properties.viewPort)
            if (properties.path) {
                generateFourierProps(properties.path, fourierPoints);
                fourierPoints.sort((a, b) => {
                    return b.radius - a.radius;
                })
                setFourierSteps(fourierPoints);
            } else {
                console.log('no path');
            }
        }, [properties]);

        const generateFourierProps = (
            points: Point[],
            fourier: FourierTransform[],
        ) => {
            const N = points.length;
            for (let k = 0; k < N; k++) {
                const sum = {re: 0, im: 0};
                for (let n = 0; n < N; n++) {
                    const angle = (2 * Math.PI * k * n) / N;
                    sum.re += points[n].x * Math.cos(angle) + points[n].y * Math.sin(angle);
                    sum.im += -points[n].x * Math.sin(angle) + points[n].y * Math.cos(angle);
                }
                sum.re /= N;
                sum.im /= N;

                const amplitude = Math.sqrt(sum.re ** 2 + sum.im ** 2);
                const phase = Math.atan2(sum.im, sum.re);
                fourier.push({radius: amplitude, frequency: k, phase: phase});
            }
        }


        useEffect(() => {
            const initCircles = renderCircles();
            if (isStart && initCircles) {
                let resolveFn: (() => void) | null = null;
                const renderingPromise = new Promise<void>((resolve) => {
                    resolveFn = resolve;
                });
                let lastTimestamp = 0;
                let index = 0;
                let animationFrameId: number;
                const renderItems = (timestamp: number) => {
                    if (index === initCircles.length - 1) {
                        resolveFn?.();
                        return;
                    }
                    if (index === 0 || timestamp - lastTimestamp >= intervalMs) {
                        lastTimestamp = timestamp;
                        if (startingCircles) {
                            setStartingCircles((prev) => [...prev, initCircles[index]]);
                        } else {
                            setStartingCircles([initCircles[index]])
                        }
                        index++;
                    }
                    animationFrameId = requestAnimationFrame(renderItems);
                };
                requestAnimationFrame(renderItems);
                renderingPromise.then(() => {
                    setIsStart(false);
                    return () => {
                        cancelAnimationFrame(animationFrameId);
                    };
                });
            }
        }, [fourierPoints]);


        useEffect(() => {
            if (!isStart) {
                let animationFrameId: number;
                const animate = () => {
                    if (!isPause && properties.path !== undefined) {
                        setCurrentFrequency(prevState => prevState + (1 / properties.path.length));
                        animationFrameId = requestAnimationFrame(animate);
                    }
                };
                if (!isPause) {
                    animationFrameId = requestAnimationFrame(animate);
                }
                return () => {
                    cancelAnimationFrame(animationFrameId);
                };
            }
        }, [isPause, circles, isStart]);


        useEffect(() => {
            if (!fourierPoints) {
                return;
            }
            setCircles(renderCircles());
        }, [currentFrequency]);

        const renderCircles = (): ICircle[] | undefined => {
            if (!fourierPoints) {
                return undefined;
            }
            const newCircles: ICircle[] = [];
            let prevCircle: ICircle | null = null;

            for (let i = 0; i < fourierPoints.length; i++) {
                const {radius, frequency, phase} = fourierPoints[i];

                const angle = 2 * Math.PI * frequency * currentFrequency + phase;

                const centerX = prevCircle ? prevCircle.centerX + prevCircle.radius * Math.cos(prevCircle.angle) : 0;
                const centerY = prevCircle ? prevCircle.centerY + prevCircle.radius * Math.sin(prevCircle.angle) : 0;

                const newCircle: ICircle = {
                    centerX,
                    centerY,
                    radius,
                    angle,
                    color: circleColorArray[i],
                };
                newCircles.push(newCircle);
                prevCircle = newCircle;
                if (i === fourierPoints.length - 1) {
                    const centerX = prevCircle ? prevCircle.centerX + prevCircle.radius * Math.cos(angle) : 0;
                    const centerY = prevCircle ? prevCircle.centerY + prevCircle.radius * Math.sin(angle) : 0;
                    renderPath(centerX, centerY)
                }
            }
            return newCircles;
        }


        const renderPath = (x: number, y: number) => {
            const graph = d3.select(pathRef.current);
            setPath((prevPoints) => [...prevPoints, {x, y}]);
            const pathData = points.map((point, index) => {
                return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
            }).join(" ");
            graph.attr("d", pathData);
        };

        return (
            <div className={'fourier-container'}>
                <svg style={{backgroundColor: getHslString(colors.backgroundColor)}} ref={svgRef} width="100%" height="100%"
                     viewBox={getViewPortString(viewPort)}>
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
    }
;

export default FourierWrapper;
