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
import {ColorPicker} from "@/components/menu/controll/ColorPicker.tsx";
import {SliderWithNumber} from "@/components/menu/controll/SliderWithNumber.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {SwitchWithLabel} from "@/components/menu/controll/SwitchWithLabel.tsx";


const getHslString = (h: number, s: number, l: number): string => {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export const MenuBar = () => {

    const [strokes, setStrokes] = useState<IFourierStrokeSettings>({
        circleStroke: 0.01,
        radiusStroke: 0.01,
        pathStroke: 0.09,
        jointPointStroke: 0.01,
    });
    const [colors, setColors] = useState<IFourierColorSettings>({
        hslBase: [140, 5, 9],
        rotateCircleColor: false,
        rotateCircleColorDelay: 30,
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
        viewPort: "0 0 5800 5800"
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

                            <div style={{width: '100%'}} className={"flex flex-col items-center"}>
                                <div style={{width: '90%'}} className={"flex flex-col gap-3.5"}>
                                    <SwitchWithLabel value={properties.deletePath} lable={"Delete Path"}
                                                     setValue={(checked) => setProperties((prev) => ({
                                                         ...prev,
                                                         deletePath: checked
                                                     }))}/>

                                    <SliderWithNumber number={properties.maxSpeed} min={0.000} max={0.499} steps={0.001}
                                                      lable={'maxSpeed'}
                                                      setNumber={(number) => setProperties((prev) => ({
                                                          ...prev,
                                                          maxSpeed: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={properties.minSpeed} min={-0.499} max={0.000}
                                                      steps={0.001}
                                                      lable={'minSpeed'}
                                                      setNumber={(number) => setProperties((prev) => ({
                                                          ...prev,
                                                          minSpeed: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={properties.speedDelta} min={2} max={8} steps={1}
                                                      lable={'deltaSpeed'}
                                                      setNumber={(number) => setProperties((prev) => ({
                                                          ...prev,
                                                          speedDelta: number[0]
                                                      }))}/>
                                    <Separator className="my-2" orientation="horizontal"/>
                                    <SliderWithNumber number={properties.maxRadius} min={1} max={300} steps={1}
                                                      lable={'maxRadius'}
                                                      setNumber={(number) => setProperties((prev) => ({
                                                          ...prev,
                                                          maxRadius: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={properties.radiusDelta} min={0} max={300} steps={1}
                                                      lable={'deltaRadius'}
                                                      setNumber={(number) => setProperties((prev) => ({
                                                          ...prev,
                                                          radiusDelta: number[0]
                                                      }))}/>
                                </div>
                            </div>

                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Stroke</SidebarGroupLabel>
                        <SidebarGroupContent>

                            <div style={{width: '100%'}} className={"flex flex-col items-center"}>
                                <div style={{width: '90%'}} className={"flex flex-col gap-3.5"}>
                                    <SliderWithNumber number={strokes.circleStroke} min={0.000} max={0.499}
                                                      steps={0.001}
                                                      lable={'circleStroke'}
                                                      setNumber={(number) => setStrokes((prev) => ({
                                                          ...prev,
                                                          circleStroke: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={strokes.radiusStroke} min={0.000} max={0.499}
                                                      steps={0.001}
                                                      lable={'radiusStroke'}
                                                      setNumber={(number) => setStrokes((prev) => ({
                                                          ...prev,
                                                          radiusStroke: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={strokes.jointPointStroke} min={0.000} max={0.499}
                                                      steps={0.001}
                                                      lable={'jointPointStroke'}
                                                      setNumber={(number) => setStrokes((prev) => ({
                                                          ...prev,
                                                          jointPointStroke: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={strokes.pathStroke} min={0.000} max={0.499} steps={0.001}
                                                      lable={'pathStroke'}
                                                      setNumber={(number) => setStrokes((prev) => ({
                                                          ...prev,
                                                          pathStroke: number[0]
                                                      }))}/>
                                </div>
                            </div>

                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Colors</SidebarGroupLabel>
                        <div style={{width: '100%'}} className={"flex flex-col items-center"}>
                            <div style={{width: '90%'}} className={"flex flex-col gap-3.5"}>
                                <Separator/>
                                <SwitchWithLabel value={colors.rotateCircleColor} lable={"rotateCircleColor"}
                                                 setValue={(checked) => setColors((prev) => ({
                                                     ...prev,
                                                     rotateCircleColor: checked
                                                 }))}/>
                                {colors.rotateCircleColor ?
                                    <SliderWithNumber
                                                      number={colors.rotateCircleColorDelay} min={0} max={100} steps={1}
                                                      lable={'rotateCircleColorDelay'}
                                                      setNumber={(number) => setColors((prev) => ({
                                                          ...prev,
                                                          rotateCircleColorDelay: number[0]
                                                      }))}/> : null
                                }
                                <Separator/>
                                <ColorPicker lable={'circleColor'} color={colors.circleColor}
                                             setColor={((color) => setColors((prev) => ({
                                                 ...prev,
                                                 circleColor: color
                                             })))}/>
                                <ColorPicker lable={'radiusColor'} color={colors.radiusColor}
                                             setColor={((color) => setColors((prev) => ({
                                                 ...prev,
                                                 radiusColor: color
                                             })))}/>
                                <ColorPicker lable={'jointPointColor'} color={colors.jointPointColor}
                                             setColor={((color) => setColors((prev) => ({
                                                 ...prev,
                                                 jointPointColor: color
                                             })))}/>
                                <ColorPicker lable={'backgroundColor'} color={colors.backgroundColor}
                                             setColor={((color) => setColors((prev) => ({
                                                 ...prev,
                                                 backgroundColor: color
                                             })))}/>
                                <Separator className="my-2" orientation="horizontal"/>

                                <SwitchWithLabel value={colors.showPathGradient} lable={"showPathGradient"}
                                                 setValue={(checked) => setColors((prev) => ({
                                                     ...prev,
                                                     showPathGradient: checked
                                                 }))}/>
                                {colors.showPathGradient ?
                                    <>
                                        <ColorPicker lable={'gradientColor'} color={colors.gradientColor}
                                                     setColor={((color) => setColors((prev) => ({
                                                         ...prev,
                                                         gradientColor: color
                                                     })))}/>
                                        <ColorPicker lable={'gradientColor1'} color={colors.gradientColor1}
                                                     setColor={((color) => setColors((prev) => ({
                                                         ...prev,
                                                         gradientColor1: color
                                                     })))}/>
                                        <ColorPicker lable={'gradientColor2'} color={colors.gradientColor2}
                                                     setColor={((color) => setColors((prev) => ({
                                                         ...prev,
                                                         gradientColor2: color
                                                     })))}/></> : null

                                }

                            </div>
                        </div>
                        <SidebarGroupContent>

                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter/>
            </Sidebar>
        </>
    );
};
