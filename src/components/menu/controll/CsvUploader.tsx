import React, {useEffect, useState} from "react";
import Papa from "papaparse";
import {add, Complex, complex, divide, multiply, subtract} from "mathjs";

interface CsvRow {
    [key: string]: string; // Adjust the type based on your CSV structure
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

const CsvUploader: React.FC = () => {
    const [data, setData] = useState<CsvRow[]>([]);
    const {width, height} = useWindowSize();


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        Papa.parse<CsvRow>(file, {
            delimiter: ";",
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
                setData(result.data);
                const pathComplex: Complex[] = result.data.map(([real, imag]) => complex(real, imag));
                const {center, targetWidth, targetHeight, topLeft} = getCanvas();
                const {
                    leftmostPoint,
                    rightmostPoint,
                    topmostPoint,
                    bottommostPoint
                } = getInputCanvasDimension(pathComplex)
                const width: Complex = subtract(rightmostPoint, leftmostPoint);
                const height: Complex = subtract(bottommostPoint, topmostPoint)
                const marginTop = (targetHeight - height.im / width * targetWidth) / 2

                const transformedPath = [];
                for (const complexPoint of pathComplex) {
                    const marginComplex = complex(0, marginTop);
                    const transformedPoint = add(add(multiply(divide(subtract(subtract(complexPoint, leftmostPoint), topmostPoint), width), targetWidth), topLeft), marginComplex);
                    transformedPath.push(transformedPoint)
                }
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
        if (numbers.length === 0) {
            throw new Error("Array is empty");
        }

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

        const leftmostPoint = complex(minRe, 0);
        const rightmostPoint = complex(maxRe, 0);
        const topmostPoint = complex(0, minIm);
        const bottommostPoint = complex(0, maxIm);

        return {
            leftmostPoint,
            rightmostPoint,
            topmostPoint,
            bottommostPoint
        };
    };


    const getCanvas = (): { center: Complex, targetWidth: number, targetHeight: number, topLeft: Complex } => {
        const canvas: Complex = complex(width, height);
        const topLeft: Complex = multiply(divide(canvas, 8), -3);
        const bottomRight: Complex = multiply(divide(canvas, 8), 3);
        const center: Complex = divide(add(topLeft, bottomRight), 2);
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
