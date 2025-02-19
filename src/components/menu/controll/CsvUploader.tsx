import React, {useEffect, useState} from "react";
import Papa from "papaparse";
import Complex from "complex.js";
import {Point, ViewPort} from "@/model/model.ts";

interface CsvRow {
    [key: string]: string;
}

const useWindowSize = () => {
    const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});

    useEffect(() => {
        const handleResize = () => setSize({width: window.innerWidth, height: window.innerHeight});

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
};

const CsvUploader = ({setPath, setViewPort}: {
    setPath: (path: Point[]) => void;
    setViewPort: (path: ViewPort) => void;
}) => {
    const [data, setData] = useState<CsvRow[]>([]);
    const {width, height} = useWindowSize();


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(width, height);
        setViewPort(
            {
                minX: -width / 2,
                minY: -height / 2,
                height: height,
                width: width
            }
        )
        if (!file) return;

        Papa.parse<CsvRow>(file, {
            delimiter: ";",
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
                setData(result.data);
                const inputPathData: [number, number][] = result.data

                const {
                    leftmostPoint,
                    rightMostPoint,
                    bottommostPoint,
                    topmostPoint,
                } = getInputCanvasDimension(inputPathData)

                const offsetX = width - rightMostPoint;
                const offsetY = width - rightMostPoint;
                const inputHeight = topmostPoint - bottommostPoint;
                const inputWidth = rightMostPoint - leftmostPoint;

                console.log('width', inputWidth);
                console.log('height', inputHeight);

                const centerX = rightMostPoint - (inputWidth / 2)
                const centerY = topmostPoint - (inputHeight / 2)

                const transformedPath: Point[] = [];
                for (const point of inputPathData) {
                    const transformedX = point[0] - centerX
                    const transformedY = point[1] - centerY
                    transformedPath.push({x: transformedX, y: transformedY});
                }
                setPath(transformedPath);
                console.log("Complex Data:", transformedPath);
            },
        });
    };


    const getInputCanvasDimension = (numbers: [number, number][]): {
        leftmostPoint: number,
        rightMostPoint: number,
        bottommostPoint: number,
        topmostPoint: number;
    } => {
        let rightMostPoint = numbers[0][0];
        let leftmostPoint = numbers[0][0];
        let bottommostPoint = numbers[0][1];
        let topmostPoint = numbers[0][1];

        for (const num of numbers) {
            if (num[0] < leftmostPoint) {
                leftmostPoint = num[0];
            }
            if (num[0] > rightMostPoint) {
                rightMostPoint = num[0];
            }
            if (num[1] < bottommostPoint) {
                bottommostPoint = num[1];
            }
            if (num[1] > topmostPoint) {
                topmostPoint = num[1];
            }
        }


        return {
            leftmostPoint: leftmostPoint,
            rightMostPoint: rightMostPoint,
            bottommostPoint: bottommostPoint,
            topmostPoint: topmostPoint,
        };
    };


    const getCanvas = (): { center: Complex, targetWidth: number, targetHeight: number, topLeft: Complex } => {


        const canvas: Complex = new Complex(width, height);

        const topLeft: Complex = canvas.div(20).mul(-16);
        const bottomRight: Complex = canvas.div(20).mul(16);
        const center: Complex = topLeft.add(bottomRight).div(2);
        const targetWidth = bottomRight.re - topLeft.re
        const targetHeight = bottomRight.im - topLeft.im

        return {center: center, targetWidth: targetWidth, targetHeight: targetHeight, topLeft: topLeft};
    }

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileUpload}/>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default CsvUploader;
