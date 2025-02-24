import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,} from "@/components/ui/sidebar.tsx";
import {Preset, presets} from "@/presets.ts";
import {IFourierColorSettings, IFourierProperties, IFourierStrokeSettings, Point} from "@/model/model.ts";


const presetMap: Record<string, Preset> = {lilaGreenPreset: presets[0], pinkSolarSystem: presets[1], blueWorms: presets[2], windyTree: presets[3], slowGreenCircles:presets[4]};

export const SvgMenu = ({setProperties, height, width, setStrokes, setColors, colors, strokes, properties, setKey, setIsUploading}: {
    colors: IFourierColorSettings;
    strokes: IFourierStrokeSettings;
    properties: IFourierProperties;
    setProperties: React.Dispatch<React.SetStateAction<IFourierProperties>>;
    setStrokes: React.Dispatch<React.SetStateAction<IFourierStrokeSettings>>;
    setColors: React.Dispatch<React.SetStateAction<IFourierColorSettings>>;
    height: number
    width: number
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
    setKey: React.Dispatch<React.SetStateAction<number>>
}) => {




    return (
        <>
            <Sidebar side={'right'}>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>


                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </>
    );
};
