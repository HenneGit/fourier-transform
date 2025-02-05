import {useRef} from "react";
import StartCircle from "./StartCircle.tsx";

const CircleWrapper = () => {
    const svgRef = useRef<SVGSVGElement>(null);


    return (
        <div>
            <svg ref={svgRef} width={4000} height={4000}>
                <StartCircle
                    centerX={400}
                    centerY={400}
                    radius={50}
                    speed={3000}
                />
            </svg>
        </div>
    );
};

export default CircleWrapper;
