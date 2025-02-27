import {Drawer, DrawerContent, Tab, Tabs} from "@heroui/react";
import {useEffect} from "react";
import StrokeControl from "@/components/menu/properties/control/StrokeControl.tsx";
import ColorControl from "@/components/menu/properties/control/ColorControl.tsx";

interface DrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CircleOverviewDrawer({isOpen, onOpenChange}: DrawerProps) {


    useEffect(() => {
        console.log('open');
    }, []);


    return (
        <>
            <Drawer className={'z-20'} autoFocus={false} isDismissable={false} hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} placement={'left'}  size={'xs'} backdrop={'transparent'}>
                <DrawerContent className={'z-20'} >
                    <>
                        <div className={'w-full h-full p-6'}>
                            <StrokeControl/>
                            <ColorControl/>
                        </div>
                    </>
                </DrawerContent>
            </Drawer>
        </>
    );
}
