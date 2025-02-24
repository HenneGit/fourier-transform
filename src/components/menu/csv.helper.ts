import {Point} from "@/model/model.ts";

export const getInputCanvasDimension = (numbers: [number, number][]): {
    leftmostPoint: number,
    rightMostPoint: number,
    bottommostPoint: number,
    topmostPoint: number;
} | undefined => {
    if (!numbers || numbers.length === 0) {
        return undefined;
    }
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


export const transFormPathToDimensions = (inputPathData: [number, number][], width: number, height: number) => {
    const inputCanvasDimension = getInputCanvasDimension(inputPathData);
    if (inputCanvasDimension) {
        const {
            leftmostPoint,
            rightMostPoint,
            bottommostPoint,
            topmostPoint,
        } = inputCanvasDimension;
        const marginFactor = 0.9;
        const maxWidth = width * marginFactor;
        const maxHeight = height * marginFactor;

        const inputHeight = topmostPoint - bottommostPoint;
        const inputWidth = rightMostPoint - leftmostPoint;

        const centerX = rightMostPoint - inputWidth / 2;
        const centerY = topmostPoint - inputHeight / 2;

        const inputAspectRatio = inputWidth / inputHeight;
        const canvasAspectRatio = width / height;

        let scale: number;
        if (inputAspectRatio > canvasAspectRatio) {
            scale = (maxWidth / inputWidth);
        } else {
            scale = (maxHeight / inputHeight);
        }
        const transformedPath: Point[] = inputPathData.map(([x, y]) => ({
            x: (x - centerX) * scale,
            y: (y - centerY) * scale
        }));
        return transformedPath;
    }
}