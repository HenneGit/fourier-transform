import React from "react";
import Papa from "papaparse";
import {Point} from "@/model/model.ts";

interface CsvRow {
    [key: string]: string;
}

const CsvUploader = ({setPath, height }: {
    setPath: (path: Point[]) => void;
    height: number
}) => {


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        Papa.parse<CsvRow>(file, {
            delimiter: ";",
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
                const inputPathData: [number, number][] = result.data
                const {
                    leftmostPoint,
                    rightMostPoint,
                    bottommostPoint,
                    topmostPoint,
                } = getInputCanvasDimension(inputPathData)

                const inputHeight = topmostPoint - bottommostPoint;
                const inputWidth = rightMostPoint - leftmostPoint;
                //find center of current svg coordinates
                const centerX = rightMostPoint - (inputWidth / 2)
                const centerY = topmostPoint - (inputHeight / 2)

                const transformedPath: Point[] = [];
                for (const point of inputPathData) {
                    const transformedX = (point[0] - centerX) * (height / 2 / inputWidth);
                    const transformedY = (point[1] - centerY) * (height / 2 / inputHeight);
                    transformedPath.push({x: transformedX, y: transformedY});
                }
                setPath(transformedPath);
                sessionStorage.setItem('path', JSON.stringify(transformedPath))
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

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileUpload}/>
        </div>
    );
};

export default CsvUploader;
