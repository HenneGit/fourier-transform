import {useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import * as d3 from "d3";
import {
    FourierTransform,
    ICircle,
    ColorSettings,
    RandomCirclesSettings,
    StrokeSettings,
    Point,
    ViewPort
} from "@/model/model.ts";
import path from "path";
import {getHslString, getRandomNumber, getViewPortString, renderPath} from "@/components/fourier/helpers.ts";


type FourierWrapperProps = {
    properties: RandomCirclesSettings;
    colors: ColorSettings;
    strokes: StrokeSettings;
    isPause: boolean;
    viewPort: ViewPort;
}


const RandomCirclesRenderer: React.FC<FourierWrapperProps> = ({
                                                          properties,
                                                          colors,
                                                          strokes,
                                                          isPause,
                                                          viewPort
                                                      }) => {
        const svgRef = useRef<SVGSVGElement>(null);
        const pathRef = useRef<SVGPathElement>(null);
        const [fourierSteps, setFourierSteps] = useState<FourierTransform[]>();
        const [circles, setCircles] = useState<ICircle[]>();
        const [currentFrequency, setCurrentFrequency] = useState(0);
        const [path, setPath] = useState<Point[]>([]);
        const [circleColorArray, setCircleColorArray] = useState<[number, number, number][]>([]);
        const [newViewPort, setNewViewPort] = useState<ViewPort>(viewPort)
        const [viewPortIncrement, setSetViewPortIncrement] = useState(0.05);
        const [startingTime, setStartingTime] = useState(2);
        const [savedElapsed, setSavedElapsed] = useState(2);


        useEffect(() => {
            const fourierPoints: FourierTransform[] = [];
            setCurrentFrequency(0);
            setFourierSteps(undefined)
            setPath([]);
            setCircles([]);
            setNewViewPort(newViewPort)
            generateRandomFourierProps(fourierPoints);
            setFourierSteps(fourierPoints);
            setCircles(renderCircles(savedElapsed, fourierPoints));
        }, [properties]);


        const generateRandomFourierProps = (fourierProps: FourierTransform[]) => {
            for (let i = 0; i < properties.numberOfCircles; i++) {
                const radius = parseFloat((getRandomNumber(1, properties.maxRadius, properties.radiusDelta)).toFixed(3));
                const phase = parseFloat((getRandomNumber(1, properties.maxRadius, properties.radiusDelta)).toFixed(3));
                const min = properties.minSpeed;
                const max = properties.maxSpeed;
                const frequency = parseFloat(getRandomNumber(min, max, properties.speedDelta).toFixed(3));
                fourierProps.push({radius: radius, frequency: frequency, phase: phase});
            }
            return fourierProps
        }

        useEffect(() => {
            let animationFrameId: number;
            let startTime: number | null = null;
            let isFirstRender = true;
            if (!isPause) {
                startTime = performance.now();
                const animate = () => {
                    if (!startTime) {
                        startTime = 0;
                    }
                    if (isFirstRender) {
                        startTime = startingTime;
                        isFirstRender = false;
                    }
                    const elapsed = performance.now() - startTime + savedElapsed;
                    setCurrentFrequency(elapsed / 1000);
                    animationFrameId = requestAnimationFrame(animate);
                };
                animationFrameId = requestAnimationFrame(animate);
            } else if (isPause) {
                setSavedElapsed(currentFrequency * 1000);
            }
            return () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            };
        }, [isPause]);


        useEffect(() => {
            if (!fourierSteps) {
                return;
            }
            if (path.length > fourierSteps.length) {
                // path.splice(0, 2);
            }
            setCircles(renderCircles(currentFrequency, fourierSteps));
        }, [currentFrequency]);

        const renderCircles = (step: number, currentFourier: FourierTransform[]): ICircle[] | undefined => {
            if (!currentFourier) {
                return undefined;
            }
            const newCircles: ICircle[] = [];
            let prevCircle: ICircle | null = null;

            for (let i = 0; i < currentFourier.length; i++) {
                const {radius, frequency} = currentFourier[i];
                const angle = Math.PI * frequency * step;
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
                if (i === currentFourier.length - 1) {
                    const centerX = prevCircle ? prevCircle.centerX + prevCircle.radius * Math.cos(angle) : 0;
                    const centerY = prevCircle ? prevCircle.centerY + prevCircle.radius * Math.sin(angle) : 0;
                    renderPath(centerX, centerY, pathRef, setPath, path)
                }
            }
            return newCircles;
        }



        return (
            <div className={'fourier-container'}>
                <svg style={{backgroundColor: getHslString(colors.backgroundColor)}} ref={svgRef} width="100%" height="100%"
                     viewBox={getViewPortString(newViewPort)}>
                    {circles && circles.length > 0 ? circles.map((item, index) => (
                        <Circle key={index} circle={item} strokeSettings={strokes} colorSettings={colors}/>
                    )) : null}
                    {path.length > 0 ? <path ref={pathRef}
                                             stroke={colors.showPathGradient ? "url(#grad)" : getHslString(colors.pathColor)}
                                             fill="none"
                                             strokeWidth={strokes.pathStroke}/> : null
                    }
                </svg>
            </div>
        )
    }
;

export default RandomCirclesRenderer;
