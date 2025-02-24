import {ColorSettings, RandomCirclesSettings, StrokeSettings} from "@/model/model.ts";


export interface Preset {
    properties: RandomCirclesSettings;
    colors: ColorSettings;
    strokes: StrokeSettings;
}


const LilaGreenPresetStrokes: StrokeSettings = {
    circleStroke: 0.04,
    radiusStroke: 0.1,
    pathStroke: 0.1,
    jointPointStroke: 0.2,
    deletePath: true,
    deletePathDelay: 25,
};


const LilaGreenPresetColors: ColorSettings = {
    rotateCircleColor: true,
    rotateCircleColorDelay: 5,
    radiusColor: [65, 82, 50],
    circleColor: [1, 20, 100],
    jointPointColor: [20, 120, 70],
    backgroundColor: [286, 90, 14],
    showPathGradient: true,
    pathColor: [132, 71, 70],
    gradientColor: [90, 90, 50],
    gradientColor1: [170, 90, 50],
    gradientColor2: [314, 90, 50],

}

const LilaGreenPresetProps: RandomCirclesSettings = {
    addViewPortZoom: false,
    numberOfCircles: 40,
    maxSpeed: 0.299,
    minSpeed: -0.299,
    speedDelta: 2,
    maxRadius: 5,
    radiusDelta: 1,
    zoom: 90,
    viewPort:  {
        minX: -75,
        minY: -75,
        height: 150,
        width: 150
    }
}


const PinkSolarSystemStrokes: StrokeSettings = {
    circleStroke: 0.04,
    radiusStroke: 0,
    pathStroke: 0.1,
    jointPointStroke: 0.4,
    deletePath: true,
    deletePathDelay: 7,
};


const PinkSolarSystemColors: ColorSettings = {
    rotateCircleColor: false,
    rotateCircleColorDelay: 5,
    radiusColor: [0, 0, 0],
    circleColor: [305, 100, 50],
    jointPointColor: [40, 100, 50],
    backgroundColor: [40, 100, 5],
    showPathGradient: false,
    pathColor: [132, 71, 70],
    gradientColor: [90, 90, 50],
    gradientColor1: [170, 90, 50],
    gradientColor2: [314, 90, 50],

}
const PinkSolarSystemProperties: RandomCirclesSettings = {
    addViewPortZoom: true,
    numberOfCircles: 99,
    maxSpeed: 0.199,
    minSpeed: -0.199,
    speedDelta: 1,
    maxRadius: 5,
    radiusDelta: 5,
    zoom: 90,
    viewPort:  {
        minX: -75,
        minY: -75,
        height: 150,
        width: 150
    }}


const BlueWormsStrokes: StrokeSettings = {
    circleStroke: 0.00,
    radiusStroke: 0,
    pathStroke: 0,
    jointPointStroke: 0.35,
    deletePath: true,
    deletePathDelay: 0,
};


const BlueWormsColors: ColorSettings = {
    rotateCircleColor: false,
    rotateCircleColorDelay: 5,
    radiusColor: [0, 0, 0],
    circleColor: [305, 100, 50],
    jointPointColor: [189, 86, 58],
    backgroundColor: [234, 86, 47],
    showPathGradient: false,
    pathColor: [132, 71, 70],
    gradientColor: [90, 90, 50],
    gradientColor1: [170, 90, 50],
    gradientColor2: [314, 90, 50],

}
const BlueWormsProperties: RandomCirclesSettings = {
    addViewPortZoom: false,
    numberOfCircles: 200,
    maxSpeed: 0.199,
    minSpeed: -0.388,
    speedDelta: 0,
    maxRadius: 0.1,
    radiusDelta: 8,
    zoom: 90,
    viewPort:  {
        minX: -75,
        minY: -75,
        height: 150,
        width: 150
    }
}


const WindyTreeStrokes: StrokeSettings = {
    circleStroke: 0.00,
    radiusStroke: 0.2,
    pathStroke: 0,
    jointPointStroke: 0.35,
    deletePath: true,
    deletePathDelay: 1,
};


const WindyTreeColors: ColorSettings = {
    rotateCircleColor: false,
    rotateCircleColorDelay: 5,
    radiusColor: [360, 76, 55],
    circleColor: [305, 100, 50],
    jointPointColor: [360, 98, 65],
    backgroundColor: [54, 87, 95],
    showPathGradient: false,
    pathColor: [132, 71, 70],
    gradientColor: [90, 90, 50],
    gradientColor1: [170, 90, 50],
    gradientColor2: [314, 90, 50],

}
const WindyTreeProperties: RandomCirclesSettings = {
    addViewPortZoom: false,
    numberOfCircles: 120,
    maxSpeed: 0.299,
    minSpeed: -0.288,
    speedDelta: 0,
    maxRadius: 2.5,
    radiusDelta: 0,
    zoom: 90,
    viewPort:  {
        minX: -75,
        minY: -75,
        height: 150,
        width: 150
    }
}

const SlowGreenCirclesProperties: RandomCirclesSettings = {
    addViewPortZoom: false,
    numberOfCircles: 10,
    maxSpeed: 0.299,
    minSpeed: -0.288,
    speedDelta: 0.8,
    maxRadius: 10,
    radiusDelta: 20,
    zoom: 90,
    viewPort:  {
        minX: -75,
        minY: -75,
        height: 150,
        width: 150
    }
}


const SlowGreenCirclestrokes: StrokeSettings = {
    circleStroke: 0.5,
    radiusStroke: 0.3,
    pathStroke: 0.49,
    jointPointStroke: 0,
    deletePath: true,
    deletePathDelay: 15,
};


const SlowGreenCirclesColors: ColorSettings = {
    rotateCircleColor: false,
    rotateCircleColorDelay: 5,
    radiusColor: [44, 58.44, 84.9],
    circleColor: [103.57, 51.85, 31.76],
    jointPointColor: [360, 98, 65],
    backgroundColor: [150.86, 49.3, 13.92],
    showPathGradient: false,
    pathColor: [82.04, 40.83, 47.06],
    gradientColor: [90, 90, 50],
    gradientColor1: [170, 90, 50],
    gradientColor2: [314, 90, 50],

}


export const presets: Preset[] = [
    {properties: LilaGreenPresetProps, colors: LilaGreenPresetColors, strokes: LilaGreenPresetStrokes},
    {properties: PinkSolarSystemProperties, colors: PinkSolarSystemColors, strokes: PinkSolarSystemStrokes},
    {properties: BlueWormsProperties, colors: BlueWormsColors, strokes: BlueWormsStrokes},
    {properties: WindyTreeProperties, colors: WindyTreeColors, strokes: WindyTreeStrokes},
    {properties: SlowGreenCirclesProperties, colors: SlowGreenCirclesColors, strokes: SlowGreenCirclestrokes},
];
