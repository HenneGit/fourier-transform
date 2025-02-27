import './App.css'
import {useEffect, useState} from "react";
import {HeroUIProvider, PopoverTrigger} from "@heroui/react";
import {SettingsProvider} from './context/SettingsContext';
import {RNGSettingsContext} from "@/context/RNGSettingsContext.tsx";
import {ActiveRendererIdProvider} from "@/context/ActiveRendererContext.tsx";
import Main from "@/components/main/Main.tsx";
import ColorsAndStrokesDrawer from "@/components/menu/properties/ColorsAndStrokesDrawer.tsx";
import CircleOverviewDrawer from "@/components/menu/properties/CircleOverviewDrawer.tsx";
import MouseTracker from "@/components/ui/MouseTracker.tsx";
import {useDisclosure} from "@heroui/modal";
import {Popover, PopoverContent} from "@heroui/popover";
import {Button} from "@heroui/button";
import {ColorPicker} from "@/components/menu/properties/control/components/ColorPicker.tsx";


const useWindowSize = () => {
    const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});

    useEffect(() => {
        const handleResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
        console.log('@sh');
    }, []);

    return size;
};

function App() {
    const {width, height} = useWindowSize();
    const {isOpen, onOpenChange} = useDisclosure();
    const [isPause, setPause] = useState(false);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            event.preventDefault();
            onPauseButtonClick();
        }
    };



    const onPauseButtonClick = () => {
        setPause(prevState => !prevState);
        onOpenChange();
    }

    return (
        <>
            <HeroUIProvider>
                <ActiveRendererIdProvider>
                    <SettingsProvider>
                        <RNGSettingsContext>
                            <CircleOverviewDrawer isOpen={isOpen} onOpenChange={onOpenChange}/>
                            <main>

                                <Main isPause={isPause} width={width} height={height} />
                            </main>
                            <MouseTracker isPaused={isPause} onClick={onPauseButtonClick}/>
                        </RNGSettingsContext>
                    </SettingsProvider>
                </ActiveRendererIdProvider>
            </HeroUIProvider>
        </>
    );
}

export default App
