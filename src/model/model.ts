export interface IFourierProperties {
    numberOfCircles: number;
    maxSpeed: number;
    minSpeed: number;
    speedDelta: number;
    maxRadius: number;
    radiusDelta: number;
    zoom: number;
    addViewPortZoom: boolean;
    viewPort: ViewPort;
    path: Point[] | undefined;

}

export interface IFourierStrokeSettings {
    circleStroke: number;
    radiusStroke: number;
    pathStroke: number;
    jointPointStroke: number;
    deletePath: boolean;
    deletePathDelay: number;
}


export interface IFourierColorSettings {
    rotateCircleColor: boolean;
    rotateCircleColorDelay: number;
    radiusColor: number[];
    circleColor: Array<number>;
    pathColor: Array<number>;
    jointPointColor: Array<number>;
    backgroundColor: Array<number>;
    showPathGradient: boolean,
    gradientColor: Array<number>;
    gradientColor1: Array<number>;
    gradientColor2: Array<number>;
}

export interface RenderedCircle {
    centerX: number;
    centerY: number;
    radius: number;
    angle: number;
    color: number[];
}

export interface Point {
    x: number;
    y: number;
}

export interface ViewPort {
    minX: number;
    minY: number;
    height: number;
    width: number;
}

export interface FourierPoint {
    radius: number;
    frequency: number;
    phase: number;
}

export interface ICircle {
    centerX: number;
    centerY: number;
    radius: number;
    angle: number;
    color: Array<number>;
}

