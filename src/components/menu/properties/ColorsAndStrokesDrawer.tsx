import {Drawer, DrawerContent} from "@heroui/react";
import StrokeControl from "@/components/menu/properties/control/StrokeControl.tsx";

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
                    <div className={'w-full h-full p-6 z-[800]'}>
                        <StrokeControl/>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default ColorsAndStrokesDrawer;