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
                const pathComplex: Complex[] = result.data.map(([real, imag]: [number, number]) => new Complex(real, imag));
                const {center, targetWidth, targetHeight, topLeft} = getCanvas();
                const {
                    leftmostPoint,
                    rightmostPoint,
                    topmostPoint,
                    bottommostPoint
                } = getInputCanvasDimension(pathComplex)
                const width: Complex = rightmostPoint.sub(leftmostPoint);
                const height: Complex = bottommostPoint.sub(topmostPoint);
                const marginTop = (targetHeight - height.im / width * targetWidth) / 2

                const transformedPath: Point[] = [];
                for (const complexPoint of pathComplex) {
                    const marginComplex = new Complex(0, marginTop);
                    const transformedPoint = topmostPoint.sub(complexPoint.sub(leftmostPoint)).div(width).mul(targetWidth).add(marginComplex);
                    transformedPath.push({x: transformedPoint.im, y: transformedPoint.re});
                }
                setPath(transformedPath);
                console.log("Complex Data:", transformedPath);
            },
        });
    };


    const getInputCanvasDimension = (numbers: Complex[]): {
        leftmostPoint: Complex,
        rightmostPoint: Complex,
        topmostPoint: Complex,
        bottommostPoint: Complex
    } => {
        let minRe = numbers[0].re;
        let maxRe = numbers[0].re;
        let minIm = numbers[0].im;
        let maxIm = numbers[0].im;

        for (const num of numbers) {
            if (num.re < minRe) minRe = num.re;
            if (num.re > maxRe) maxRe = num.re;
            if (num.im < minIm) minIm = num.im;
            if (num.im > maxIm) maxIm = num.im;
        }
        const leftmostPoint = new Complex(minRe, 0);
        const rightmostPoint = new Complex(maxRe, 0);
        const topmostPoint = new Complex(0, minIm);
        const bottommostPoint = new Complex(0, maxIm);

        return {
            leftmostPoint,
            rightmostPoint,
            topmostPoint,
            bottommostPoint
        };
    };


    const getCanvas = (): { center: Complex, targetWidth: number, targetHeight: number, topLeft: Complex } => {


        const canvas: Complex = new Complex(width, height);

        const topLeft: Complex = canvas.div(8).mul(-3);
        const bottomRight: Complex = canvas.div(8).mul(3);
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
