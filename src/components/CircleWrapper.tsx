import {useEffect, useRef, useState} from "react";
import StartCircle from "./StartCircle.tsx";


export interface CircleProps {
    radius: number;
    frequency: number;
}

const CircleWrapper = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [circles, setCircles] = useState<CircleProps[]>();

    useEffect(() => {
        const newCircles: CircleProps[] = [];
        for (let i = 0; i < 250; i++) {
            const radius = parseFloat((Math.random() * 180).toFixed(3));
            const frequency = Math.random() * (0.543 - 0.67) + - 0.67;
            newCircles.push({radius: radius, frequency: frequency})
        }
        setCircles(newCircles);
        console.log(newCircles);
    }, []);


    return (
        <div style={{background: "black", width:"100%",  height:"100%"}}>
            <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 5800 5800" preserveAspectRatio="xMidYMid meet">
                {circles && circles.length > 0 && <StartCircle
                    centerX={2800}
                    centerY={2800}
                    radius={230}
                    circles={circles}
                />
                }
            </svg>
        </div>
    );
};

export default CircleWrapper;
