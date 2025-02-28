import {Drawer, DrawerContent, Tab, Tabs} from "@heroui/react";
import {useEffect, useState} from "react";
import StrokeControl from "@/components/menu/properties/control/StrokeControl.tsx";
import ColorControl from "@/components/menu/properties/control/ColorControl.tsx";
import RNGControl from "@/components/menu/properties/control/RNGControl.tsx";

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
                        <div className={'w-full h-full p-6'}>
                            <Tabs variant={'underlined'} size={'md'} className={'w-full flex flex-row justify-center'}  selectedKey={selected} onSelectionChange={setSelected} aria-label="Options">
                                <Tab key="stroke" title="Strokes ">
                                    <StrokeControl/>
                                </Tab>
                                <Tab key="color" title="Color ">
                                    <ColorControl/>
                                </Tab>
                                <Tab key="rng" title="RNG">
                                    <RNGControl/>
                                </Tab>
                            </Tabs>
                        </div>
                    </>
                </DrawerContent>
            </Drawer>
        </>
    );
}
