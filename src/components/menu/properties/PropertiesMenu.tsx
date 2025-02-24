import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "@/components/ui/sidebar.tsx";

import {ColorPicker} from "@/components/menu/properties/controll/ColorPicker.tsx";
import {SliderWithNumber} from "@/components/menu/properties/controll/SliderWithNumber.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {SwitchWithLabel} from "@/components/menu/properties/controll/SwitchWithLabel.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Preset, presets} from "@/presets.ts";
import {ColorSettings, RandomCirclesSettings, StrokeSettings, Point} from "@/model/model.ts";
import CsvUploader from "@/components/menu/properties/controll/CsvUploader.tsx";


const presetMap: Record<string, Preset> = {lilaGreenPreset: presets[0], pinkSolarSystem: presets[1], blueWorms: presets[2], windyTree: presets[3], slowGreenCircles:presets[4]};

export const PropertiesMenu = ({setProperties, height, width, setStrokes, setColors, colors, strokes, properties, setKey, setIsUploading, setPath}: {
    colors: ColorSettings;
    strokes: StrokeSettings;
    properties: RandomCirclesSettings;
    setProperties: React.Dispatch<React.SetStateAction<RandomCirclesSettings>>;
    setPath: React.Dispatch<React.SetStateAction<Point[]>>;
    setStrokes: React.Dispatch<React.SetStateAction<StrokeSettings>>;
    setColors: React.Dispatch<React.SetStateAction<ColorSettings>>;
    height: number
    width: number
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
    setKey: React.Dispatch<React.SetStateAction<number>>
}) => {


    const onSelectChange = (value: string) => {
        const preset: Preset = presetMap[value];
        setProperties(preset.properties);
        setColors(preset.colors);
        setStrokes(preset.strokes);
    };

    const setPathProperties = (path: Point[]) => {
        setProperties((prev) => ({
            ...prev,
            path: path
        }));
        setPath(path);
    }


    return (
        <>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <Select onValueChange={onSelectChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Try a preset!"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(presetMap).map(([key]) => (
                                        <SelectItem key={key} value={key}>
                                            {key}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <CsvUploader setIsUploading={setIsUploading} setKey={setKey} height={height} setPath={setPathProperties} width={width}/>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Properties</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div style={{width: '100%'}} className={"flex flex-col items-center"}>
                                <div style={{width: '90%'}} className={"flex flex-col gap-3.5"}>
                                    <SwitchWithLabel value={properties.addViewPortZoom} lable={"addViewPortZoom"}
                                                     setValue={(checked) => setProperties((prev) => ({
                                                         ...prev,
                                                         addViewPortZoom: checked
                                                     }))}/>
                                    <SliderWithNumber number={properties.numberOfCircles} min={1} max={200} steps={1}
                                                      lable={'numberOfCircles'}
                                                      setNumber={(number) => setProperties((prev) => ({
                                                          ...prev,
                                                          numberOfCircles: number[0]
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
                                    <SliderWithNumber number={properties.speedDelta} min={0} max={5} steps={0.1}
                                                      lable={'deltaSpeed'}
                                                      setNumber={(number) => setProperties((prev) => ({
                                                          ...prev,
                                                          speedDelta: number[0]
                                                      }))}/>
                                    <Separator className="my-2" orientation="horizontal"/>
                                    <SliderWithNumber number={properties.maxRadius} min={0.1} max={100} steps={0.1}
                                                      lable={'maxRadius'}
                                                      setNumber={(number) => setProperties((prev) => ({
                                                          ...prev,
                                                          maxRadius: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={properties.radiusDelta} min={0} max={200} steps={0.1}
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
                                    <SwitchWithLabel value={strokes.deletePath} lable={"deletePath"}
                                                     setValue={(checked) => setStrokes((prev) => ({
                                                         ...prev,
                                                         deletePath: checked
                                                     }))}/>
                                    {strokes.deletePath ?
                                        <SliderWithNumber number={strokes.deletePathDelay} min={1} max={150} steps={1}
                                                          lable={'deletePathDelay'}
                                                          setNumber={(number) => setStrokes((prev) => ({
                                                              ...prev,
                                                              deletePathDelay: number[0]
                                                          }))}/>

                                        : null}
                                    <SliderWithNumber number={strokes.circleStroke} min={0.000} max={1}
                                                      steps={0.001}
                                                      lable={'circleStroke'}
                                                      setNumber={(number) => setStrokes((prev) => ({
                                                          ...prev,
                                                          circleStroke: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={strokes.radiusStroke} min={0.000} max={1}
                                                      steps={0.001}
                                                      lable={'radiusStroke'}
                                                      setNumber={(number) => setStrokes((prev) => ({
                                                          ...prev,
                                                          radiusStroke: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={strokes.jointPointStroke} min={0.000} max={5}
                                                      steps={0.01}
                                                      lable={'jointPointStroke'}
                                                      setNumber={(number) => setStrokes((prev) => ({
                                                          ...prev,
                                                          jointPointStroke: number[0]
                                                      }))}/>
                                    <SliderWithNumber number={strokes.pathStroke} min={0.000} max={20} steps={0.001}
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
                                                 circleColor: [color.h, color.s, color.l]
                                             })))}/>
                                <ColorPicker lable={'radiusColor'} color={colors.radiusColor}
                                             setColor={((color) => setColors((prev) => ({
                                                 ...prev,
                                                 radiusColor: [color.h, color.s, color.l]
                                             })))}/>
                                <ColorPicker lable={'jointPointColor'} color={colors.jointPointColor}
                                             setColor={((color) => setColors((prev) => ({
                                                 ...prev,
                                                 jointPointColor: [color.h, color.s, color.l]
                                             })))}/>
                                <ColorPicker lable={'backgroundColor'} color={colors.backgroundColor}
                                             setColor={((color) => setColors((prev) => ({
                                                 ...prev,
                                                 backgroundColor: [color.h, color.s, color.l]
                                             })))}/>
                                <ColorPicker lable={'pathColor'} color={colors.pathColor}
                                             setColor={((color) => setColors((prev) => ({
                                                 ...prev,
                                                 pathColor: [color.h, color.s, color.l]
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
                                                         gradientColor: [color.h, color.s, color.l]
                                                     })))}/>
                                        <ColorPicker lable={'gradientColor1'} color={colors.gradientColor1}
                                                     setColor={((color) => setColors((prev) => ({
                                                         ...prev,
                                                         gradientColor1: [color.h, color.s, color.l]
                                                     })))}/>
                                        <ColorPicker lable={'gradientColor2'} color={colors.gradientColor2}
                                                     setColor={((color) => setColors((prev) => ({
                                                         ...prev,
                                                         gradientColor2: [color.h, color.s, color.l]
                                                     })))}/></> : null

                                }

                            </div>
                        </div>
                        <SidebarGroupContent>

                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <span className="font-sans text-xs font-medium text-gray-400">v0.1.0</span>
                </SidebarFooter>
            </Sidebar>
        </>
    );
};
