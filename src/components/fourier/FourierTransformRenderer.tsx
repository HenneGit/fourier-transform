import {useEffect, useRef, useState} from "react";
import Circle from "./Circle.tsx";
import {
    ColorSettings,
    FourierTransform,
    ICircle,
    Point,
    RNGCirclesSettings,
    StrokeSettings,
    ViewPort
} from "@/model/model.ts";
import path from "path";
import {getHslString, getViewPortString, renderPath} from "@/components/fourier/helpers.ts";


type FourierWrapperProps = {
    properties: RNGCirclesSettings;
    colors: ColorSettings;
    strokes: StrokeSettings;
    isPause: boolean;
    viewPort: ViewPort;
    inputPath: Point[];

}


const FourierTransformRenderer: React.FC<FourierWrapperProps> = ({
                                                                     colors,
                                                                     strokes,
                                                                     isPause,
                                                                     viewPort,
                                                                     inputPath
                                                                 }) => {
        const svgRef = useRef<SVGSVGElement>(null);
        const pathRef = useRef<SVGPathElement>(null);
        const [fourierSteps, setFourierSteps] = useState<FourierTransform[]>();
        const [circles, setCircles] = useState<ICircle[]>();
        const [currentFrequency, setCurrentFrequency] = useState(0);
        const [path, setPath] = useState<Point[]>(inputPath);
        const [circleColorArray, setCircleColorArray] = useState<[number, number, number][]>([]);
        const [newViewPort, setNewViewPort] = useState<ViewPort>(viewPort)
        const [viewPortIncrement, setSetViewPortIncrement] = useState(0.05);
        const [stepIncrement, setStepIncrement] = useState(0);
        const [animationSpeed, setAnimationSpeed] = useState(16.67);
        const [isCompleteCycle, setIsCompleteCycle] = useState(false);

        useEffect(() => {
            setIsCompleteCycle(false);
            setCurrentFrequency(0);
            setStepIncrement(0);
            setFourierSteps(undefined)
            setPath([]);
            setCircles([]);
            setNewViewPort(viewPort)
            if (inputPath) {
                const fourierCoefficient = generateFourierProps(inputPath);
                fourierCoefficient.sort((a, b) => {
                    return b.radius - a.radius;
                })
                setFourierSteps(fourierCoefficient);
                setCircles(renderCircles(0, fourierCoefficient));
            }
        }, [inputPath]);

        const generateFourierProps = (
            points: Point[],
        ) => {
            const fourierPoints: FourierTransform[] = [];
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
                fourierPoints.push({radius: amplitude, frequency: k, phase: phase});
            }
            setStepIncrement(1 / fourierPoints.length)
            console.log(fourierPoints.length)

            return fourierPoints;
        }

        useEffect(() => {
            let animationFrameId: number;
            let lastUpdateTime = performance.now();

            const animate = () => {
                const now = performance.now();
                if (!isPause) {
                    if (now - lastUpdateTime >= animationSpeed) {
                        setCurrentFrequency(prevState => prevState + stepIncrement);
                        lastUpdateTime = now;
                    }
                    animationFrameId = requestAnimationFrame(animate);
                }
            };
            if (!isPause) {
                animationFrameId = requestAnimationFrame(animate);
            }
            return () => {
                cancelAnimationFrame(animationFrameId);
            };
        }, [isPause, fourierSteps]);

        useEffect(() => {
            if (!fourierSteps) {
                return;
            }
            if (currentFrequency > 1) {
                setIsCompleteCycle(true);
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
                const {radius, frequency, phase} = currentFourier[i];
                const angle = 2 * Math.PI * frequency * step + phase;
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
                    if (!isCompleteCycle) {
                        renderPath(centerX, centerY, pathRef, setPath, path);
                    }
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
                    {path.length > 0 ? <path ref={pathRef} stroke-linejoin={'round'}
                                             stroke={colors.showPathGradient ? "url(#grad)" : getHslString(colors.pathColor)}
                                             fill="none"
                                             strokeWidth={strokes.pathStroke}/> : null
                    }
                </svg>
            </div>
        )
    }
;

export default FourierTransformRenderer;
