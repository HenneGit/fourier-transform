import {Drawer, DrawerContent, Tab, Tabs} from "@heroui/react";
import {useEffect} from "react";
import StrokeControl from "@/components/menu/properties/control/StrokeControl.tsx";

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
            <Drawer className={'w-1/3'} autoFocus={false} isDismissable={false} hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} placement={'right'}  size={'xs'} backdrop={'transparent'}>
                <DrawerContent>
                    <>
                        <div className={'w-full h-full p-6 z-[800]'}>
                            <StrokeControl/>
                        </div>
                    </>
                </DrawerContent>
            </Drawer>
        </>
    );
}
