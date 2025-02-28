import {useRef, useState} from "react";
import {Point} from "@/model/model.ts";

const DrawPath = ({setPath} : {    setPath: (path: Point[]) => void;}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [pathData, setPathData] = useState<Point[]>([]);
    const svgRef = useRef(null);

    const handleMouseDown = (e: { nativeEvent: { offsetX: number; offsetY: number; }; }) => {
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setPathData([{ x: offsetX, y: offsetY }]);
    };

    const handleMouseMove = (e: { nativeEvent: { offsetX: number; offsetY: number; }; }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        setPathData((prevData) => [...prevData, { x: offsetX, y: offsetY }]);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        console.log('Path data:', pathData);
        setPathData([]);
        setPath(pathData);
    };

    const drawPath = () => {
        if (pathData.length < 2) return '';
        return pathData
            .map((point, index) => {
                return index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`;
            })
            .join(' ');
    };

    return (
        <div>
            <svg
                ref={svgRef}
                width="260"
                height="200"
                style={{ border: '1px solid black', position: 'relative' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <path d={drawPath()} stroke="black" fill="transparent" strokeWidth="2" />
            </svg>
        </div>
    );
};

export default DrawPath;