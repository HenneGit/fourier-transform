import {useRef} from "react";
import StartCircle from "./StartCircle.tsx";

const CircleWrapper = () => {
    const svgRef = useRef<SVGSVGElement>(null);


    return (
        <div>
            <svg ref={svgRef}  width="100%" height="100%" viewBox="0 0 1800 1800" preserveAspectRatio="xMidYMid meet">
                <StartCircle
                    centerX={800}
                    centerY={800}
                    radius={150}
                    speed={3000}
                />
            </svg>
        </div>
    );
};

export default CircleWrapper;
