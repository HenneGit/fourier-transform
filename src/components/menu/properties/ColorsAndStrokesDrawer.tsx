import {Drawer, DrawerContent} from "@heroui/react";
import StrokeControl from "@/components/menu/properties/control/StrokeControl.tsx";
import ColorControl from "@/components/menu/properties/control/ColorControl.tsx";

interface DrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const ColorsAndStrokesDrawer: React.FC<DrawerProps> = ({isOpen, onOpenChange}: DrawerProps) => {

    return (
        <>
            <Drawer className={'w-[40em]'} autoFocus={false} isDismissable={false} hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} placement={'left'}
                    size={'xs'} backdrop={'transparent'}>
                <DrawerContent>
                    <div className={'w-full h-full p-6 z-[800] flex flex-col'}>
                        <StrokeControl/>
                        <ColorControl/>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default ColorsAndStrokesDrawer;