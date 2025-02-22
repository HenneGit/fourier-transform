import {useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import * as d3 from "d3";
import {
    FourierPoint,
    ICircle,
    IFourierColorSettings,
    IFourierProperties,
    IFourierStrokeSettings,
    Point,
    ViewPort
} from "@/model/model.ts";
import path from "path";
import {generateHSLSteps, getHslString, getViewPortString} from "@/components/fourier/helpers.ts";


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
        const viewPortZoom = 0.06;
        const svgRef = useRef<SVGSVGElement>(null);
        const [fourierPoints, setFourierPoints] = useState<FourierPoint[]>();
        const [circles, setCircles] = useState<ICircle[]>();
        const [startingCircles, setStartingCircles] = useState<ICircle[]>([]);
        const [currentFrequency, setCurrentFrequency] = useState(0);
        const [points, setPoints] = useState<Point[]>(properties.path ? properties.path : []);
        const pathRef = useRef<SVGPathElement>(null);
        const [isStart, setIsStart] = useState(false);
        const intervalMs = 1;
        const [isFirstRender, setIsFirstRender] = useState(true);
        const [renderCycle, setRenderCycle] = useState<number>(1);
        const [circleColorArray, setCircleColorArray] = useState<[number, number, number][]>([]);
        const [viewPort, setViewPort] = useState<ViewPort>(properties.viewPort)
        const [viewPortIncrement, setSetViewPortIncrement] = useState(0.05);
        const [animationSpeed, setAnimationSpeed] = useState(1)

        useEffect(() => {
            const fourierPoints: FourierPoint[] = [];
            const newCircles: ICircle[] = [];
            setCurrentFrequency(0);
            setPoints([]);
            setViewPort(properties.viewPort)
            setRenderCycle(0);
            const circleColors = generateHSLSteps(colors.circleColor, 2, properties);
            if (properties.path) {
                generateFourierProps(properties.path, fourierPoints, newCircles, circleColors);
            } else {
                console.log('no path');
            }
            fourierPoints.sort((a, b) => {
                return b.radius - a.radius;
            })
            setFourierPoints(fourierPoints);
            setCircles(newCircles);
        }, [properties]);

        const generateFourierProps = (
            points: Point[],
            fourier: FourierPoint[],
            newCircles: ICircle[],
            circleColors: [number, number, number][]
        ) => {
            const N = points.length;
            // Compute Fourier coefficients
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
                const frequency = k;
                fourier.push({radius: amplitude, frequency: frequency, phase: phase});
            }

        }

//plays starting animation
// useEffect(() => {
//     if (!isStart) {
//         return;
//     }
//     if (circles) {
//         let resolveFn: (() => void) | null = null;
//         const renderingPromise = new Promise<void>((resolve) => {
//             resolveFn = resolve;
//         });
//         let lastTimestamp = 0;
//         let index = 0;
//         const renderItems = (timestamp: number) => {
//             if (index === circles.length - 1) {
//                 resolveFn?.();
//                 return;
//             }
//             if (index === 0 || timestamp - lastTimestamp >= intervalMs) {
//                 lastTimestamp = timestamp;
//                 setStartingCircles((prev) => [...prev, circles[index]]);
//                 index++;
//             }
//             requestAnimationFrame(renderItems);
//         };
//         requestAnimationFrame(renderItems);
//         renderingPromise.then(() => {
//             setIsStart(false);
//             if (startingCircles.length === properties.numberOfCircles) {
//                 renderPath(startingCircles[properties.numberOfCircles - 1].centerX, startingCircles[properties.numberOfCircles - 1].centerY);
//             }
//         });
//     }
// }, [circles]);
        useEffect(() => {
            let animationFrameId: number;
            const animate = (time: number) => {
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
        }, [isPause, animationSpeed, fourierPoints, circles]);
        useEffect(() => {
            if (!fourierPoints) return;
            const newCircles: ICircle[] = [];
            let prevCircle: ICircle | null = null;

            for (let i = 0; i < fourierPoints.length; i++) {
                const {radius, frequency, phase} = fourierPoints[i];

                // Compute the new angle at the current timtimestampe step
                const angle = 2 * Math.PI * frequency * currentFrequency + phase;

                // First circle rotates around (0,0)
                const centerX = prevCircle ? prevCircle.centerX + prevCircle.radius * Math.cos(prevCircle.angle) : 0;
                const centerY = prevCircle ? prevCircle.centerY + prevCircle.radius * Math.sin(prevCircle.angle) : 0;

                const newCircle: ICircle = {
                    centerX,
                    centerY,
                    radius,
                    angle, // Store the updated angle
                    color: circleColorArray[i],
                };
                newCircles.push(newCircle);
                prevCircle = newCircle; // Update previous circle for the next iteration
                if (i === fourierPoints.length - 1) {
                    const centerX = prevCircle ? prevCircle.centerX + prevCircle.radius * Math.cos(angle) : 0;
                    const centerY = prevCircle ? prevCircle.centerY + prevCircle.radius * Math.sin(angle) : 0;
                    renderPath(centerX, centerY)
                }
            }
            setCircles(newCircles);
        }, [currentFrequency]); // Runs every time frequency updates


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
