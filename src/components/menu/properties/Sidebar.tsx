import {Drawer, DrawerContent, Tab, Tabs} from "@heroui/react";
import {useState} from "react";
import StrokeControl from "@/components/menu/properties/control/StrokeControl.tsx";
import ColorControl from "@/components/menu/properties/control/ColorControl.tsx";
import RNGControl from "@/components/menu/properties/control/RNGControl.tsx";
import PresetsControl from "@/components/menu/properties/control/PresetsControl.tsx";
import {SvgMenu} from "@/components/menu/svg/SvgMenu.tsx";
import {Point} from "@/model/model.ts";
import CSVUpload from "@/components/menu/properties/control/components/CSVUpload.tsx";
import DrawPath from "@/components/menu/properties/control/components/DrawPath.tsx";

interface DrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    setPath: (path: Point[]) => void;

}

export default function Sidebar({isOpen, onOpenChange, setPath}: DrawerProps) {

    const [selectedSetting, setSelectedSetting] = useState("presets");
    const [selected, setSelected] = useState("presets");

    return (
        <>
            <Drawer className={'z-20'} autoFocus={false} isDismissable={false} hideCloseButton isOpen={isOpen}
                    onOpenChange={onOpenChange} placement={'left'} size={'xs'} backdrop={'transparent'}>
                <DrawerContent className={'z-20'}>
                    <>
                        <div className={'w-full h-1/2 p-6 flex flex-col items-center '}>
                            <Tabs variant={'underlined'} size={'md'} selectedKey={selectedSetting}
                                  onSelectionChange={setSelectedSetting} aria-label="Options">
                                <Tab className={'w-full'} key="stroke" title="Strokes ">
                                    <StrokeControl/>
                                </Tab>
                                <Tab className={'w-full'} key="color" title="Color ">
                                    <ColorControl/>
                                </Tab>
                                <Tab className={'w-full'} key="rng" title="RNG">
                                    <RNGControl/>
                                </Tab>
                                <Tab className={'w-full'} key="presets" title="Presets">
                                    <PresetsControl/>
                                </Tab>
                            </Tabs>
                        </div>
                        <div className={'w-full h-1/2 p-6 flex flex-col items-center '}>
                            <Tabs variant={'underlined'} size={'md'} selectedKey={selected}
                                  onSelectionChange={setSelected} aria-label="Options">
                                <Tab className={'w-full'} key="stroke" title="Upload ">
                                    <CSVUpload setPath={setPath}/>
                                </Tab>
                                <Tab className={'w-full'} key="draw" title="Draw">
                                    <DrawPath setPath={setPath}/>
                                </Tab>
                                <Tab className={'w-full'} key="presets" title="Pictures">
                                    <SvgMenu setPath={setPath}/>
                                </Tab>

                            </Tabs>

                        </div>
                    </>
                </DrawerContent>
            </Drawer>
        </>
    );
}
