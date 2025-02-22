import {IFourierColorSettings, IFourierProperties, ViewPort} from "@/model/model.ts";

export const generateHSLSteps = (startColor: number[], step: number, properties: IFourierProperties): [number, number, number][] => {
    const [h, s, l] = startColor;
    const colors: [number, number, number][] = [];
    for (let i = 0; i < properties.numberOfCircles; i++) {
        const newL = Math.min(100, l + i * step);
        colors.push([h, s, newL]);
    }
    return colors;
}


export const getRandomNumber = (min: number, max: number, delta: number) => {
    if (Math.random() < 1 / 20) {
        return Math.random() * (max + delta - min + delta) + min + delta;
    } else {
        return Math.random() * (max - min) + min;
    }
};


export const getHslString = (hsl: number[]): string => {
    return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

export const getViewPortString = (viewPort: ViewPort) => {
    return `${viewPort.minX} ${viewPort.minY} ${viewPort.width} ${viewPort.height}`;
};
export const incrementViewPort = (setViewPort: React.Dispatch<React.SetStateAction<ViewPort>>, viewPortIncrement: number, properties: IFourierProperties) => {
    setViewPort(prevNumbers => {
        if (prevNumbers.width < 10 || prevNumbers.height < 10) {
            return properties.viewPort;
        }
        return {
            minX: prevNumbers.minX + viewPortIncrement / 2,
            minY: prevNumbers.minY + viewPortIncrement / 2,
            height: prevNumbers.height - viewPortIncrement,
            width: prevNumbers.width - viewPortIncrement
        }
    });
};


export const cycleCircleColor = (frequency: number, colors: IFourierColorSettings, circleColorArray: [number, number, number][], properties: IFourierProperties) => {
    if (frequency % 10 > 0 && frequency % 10 < 1 && colors.rotateCircleColor) {
        for (let i = 0; i < circleColorArray.length; i++) {
            const generateNewColors = generateHSLSteps([90, 30, 30], 1.5, properties);
            circleColorArray[circleColorArray.length - i - 1] = generateNewColors[i];
        }
    }
}

export const renderFastZoom = (viewPort: ViewPort, viewPortIncrement: number, setViewPort: React.Dispatch<React.SetStateAction<ViewPort>>, setSetViewPortIncrement: React.Dispatch<React.SetStateAction<number>>) => {
    if (viewPort.height <= 100) {
        return;
    }
    setViewPort(prevNumbers => {
        return {
            minX: prevNumbers.minX + viewPortIncrement / 2,
            minY: prevNumbers.minY + viewPortIncrement / 2,
            height: prevNumbers.height - viewPortIncrement,
            width: prevNumbers.width - viewPortIncrement
        }

    });
    setSetViewPortIncrement((prevState) => prevState + 0.011);
}
