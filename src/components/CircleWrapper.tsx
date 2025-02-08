import {useEffect, useRef, useState} from "react";
import NextCircle from "./NextCircle.tsx";
import * as d3 from "d3";


export interface CircleProps {
    radius: number;
    frequency: number;
}

const CircleWrapper = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [circles, setCircles] = useState<CircleProps[]>();
    const [frequency, setFrequency] = useState(0);

    useEffect(() => {
        const newCircles: CircleProps[] = [];
        for (let i = 0; i < 20; i++) {
            const radius = parseFloat((Math.random() * 180).toFixed(3));
            const min = -0.999;
            const max = 0.999;
            const frequency = parseFloat(getRandomNumber(min, max).toFixed(3));
            newCircles.push({radius: radius, frequency: frequency})
        }
        setCircles(newCircles);
        console.log(newCircles);
    }, []);



    useEffect(() => {
        d3.timer((elapsed) => {
            setFrequency(elapsed / 1000);
        });
    }, []);


    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    return (
        <div style={{background: "black", width:"100%",  height:"100%"}}>
            <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 5800 5800" preserveAspectRatio="xMidYMid meet">
                {circles && circles.length > 0 && <NextCircle
                    centerX={2800}
                    centerY={2800}
                    circles={circles}
                    circleNo={0}
                    baseFrequency={frequency}
                />
                }
            </svg>
        </div>
    );
};

export default CircleWrapper;
