import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar.tsx";
import {useEffect, useState} from "react";
import FourierWrapper, {
    IFourierColorSettings,
    IFourierProperties,
    IFourierStrokeSettings
} from "@/components/fourier/FourierWrapper.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Label} from "@radix-ui/react-label";
import {ColorPicker} from "@/components/menu/controll/ColorPicker.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {cn} from "@/lib/utils.ts";
import {SliderWithNumber} from "@/components/menu/controll/SliderWithNumber.tsx";


const getHslString = (h: number, s: number, l: number): string => {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export const MenuBar = () => {
    const [circleStroke, setCircleStroke] = useState();
    const [radiusStroke, setRadiusStroke] = useState();
    const [pathStroke, setPathStroke] = useState();
    const [jointPointStroke, setJointPointStroke] = useState();
    const [rotatingColorDelay, setRotatingColorDelay] = useState();


    const [strokes, setStrokes] = useState<IFourierStrokeSettings>({
        circleStroke: 0.01,
        radiusStroke: 0.01,
        pathStroke: 0.09,
        jointPointStroke: 0.01,
    });
    const [colors, setColors] = useState<IFourierColorSettings>({
        hslBase: [140, 5, 9],
        rotatingColor: false,
        rotatingColorDelay: 30,
        radiusColor: getHslString(190, 20, 1),
        circleColor: getHslString(248, 20, 1),
        jointPointColor: getHslString(132, 20, 102),
        backgroundColor: getHslString(123, 50, 112),
        showPathGradient: false,
        gradientColor: getHslString(190, 50, 60),
        gradientColor1: getHslString(90, 100, 120),
        gradientColor2: getHslString(10, 20, 30),

    });
    const [properties, setProperties] = useState<IFourierProperties>({
        numberOfCircles: 2,
        maxSpeed: 0.499,
        minSpeed: -0.499,
        speedDelta: 3,
        maxRadius: 5,
        radiusDelta: 2,
        animationSpeed: 10,
        zoom: 90,
        deletePath: true,
        pathDeletionDelay: 5,
        viewPort: "0 0 10 10"
    });

    useEffect(() => {

    }, []);


    return (
        <>
            <Sidebar>
                <SidebarHeader/>
                <SidebarContent>

                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div style={{height: '200px', backgroundColor: colors.backgroundColor}}>
                                <FourierWrapper strokes={strokes} properties={properties}
                                                colors={colors}></FourierWrapper>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Properties</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Switch id="delete-path" checked={properties.deletePath}
                                    onCheckedChange={(checked) => setProperties((prev) => ({
                                        ...prev,
                                        deletePath: checked
                                    }))}/>
                            <Label htmlFor="delete-path">Delete Path</Label>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Stroke</SidebarGroupLabel>
                        <SidebarGroupContent>

                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Colors</SidebarGroupLabel>
                        <ColorPicker  color={colors.circleColor} setColor={((color) => setColors((prev) => ({
                            ...prev,
                            circleColor: color
                        })))}>
                        </ColorPicker>
                        <SliderWithNumber number={properties.numberOfCircles} min={2} max={300} setNumber={(number) => setProperties((prev) => ({
                            ...prev,
                            numberOfCircles: number
                        }))} steps={1} />
                        <SidebarGroupContent>

                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter/>
            </Sidebar>
        </>
    );
};
