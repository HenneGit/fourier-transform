import {Drawer, DrawerContent, Tab, Tabs} from "@heroui/react";
import {useEffect, useState} from "react";
import StrokeControl from "@/components/menu/properties/control/StrokeControl.tsx";
import ColorControl from "@/components/menu/properties/control/ColorControl.tsx";
import RNGControl from "@/components/menu/properties/control/RNGControl.tsx";
import PresetsControl from "@/components/menu/properties/control/PresetsControl.tsx";

interface DrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CircleOverviewDrawer({isOpen, onOpenChange}: DrawerProps) {

    const [selected, setSelected] = useState("color");

    return (
        <>
            <Drawer className={'z-20'} autoFocus={false} isDismissable={false} hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} placement={'left'}  size={'xs'} backdrop={'transparent'}>
                <DrawerContent className={'z-20'} >
                    <>
                        <div className={'w-full h-full p-6 flex flex-col items-center '}>
                            <Tabs variant={'underlined'} size={'md'}   selectedKey={selected} onSelectionChange={setSelected} aria-label="Options">
                                <Tab className={'w-full'} key="stroke" title="Strokes ">
                                    <StrokeControl/>
                                </Tab>
                                <Tab className={'w-full'} key="color" title="Color ">
                                    <ColorControl/>
                                </Tab>
                                <Tab  className={'w-full'} key="rng" title="RNG">
                                    <RNGControl/>
                                </Tab>
                                <Tab className={'w-full'} key="presets" title="Presets">
                                    <PresetsControl/>
                                </Tab>
                            </Tabs>
                        </div>
                    </>
                </DrawerContent>
            </Drawer>
        </>
    );
}
