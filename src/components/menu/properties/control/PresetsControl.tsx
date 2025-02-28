import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Preset, presets} from "@/presets.ts";
import StaticRNGCirclesRenderer from "@/components/fourier/StaticRNGCirclesRenderer.tsx";
import {useSettings} from "@/context/SettingsContext.tsx";
import {useRNGSettings} from "@/context/RNGSettingsContext.tsx";

const PresetsControl = () => {

    const {setCurrentStrokeSettings, setCurrentColorSettings} = useSettings();
    const {setCurrentRNGSettings} = useRNGSettings();


    const setPreset = (setting: Preset) => {
        setCurrentStrokeSettings(setting.strokes);
        setCurrentColorSettings(setting.colors);
        setCurrentRNGSettings(setting.rngSettings)
    }

    return (
        <div className={'mt-20 z-[999]'}>
            <Carousel
                opts={{
                    align: "start",
                }}
                orientation="vertical"
                className="w-full max-w-xs"
            >
                <CarouselContent className="-mt-1 h-[170px]">
                    {presets.map((setting, index) => (
                        <CarouselItem key={index} className="pt-1 md:basis-1/2">
                            <div onClick={() => setPreset(setting)} className="p-1 cursor-pointer">
                                <Card>
                                    <CardContent className="flex items-center justify-center p-6">
                                        <StaticRNGCirclesRenderer properties={setting.rngSettings} colors={setting.colors} strokes={setting.strokes} viewPort={{minY: -100, minX: -200, height: 200, width: 400 }}/>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

export default PresetsControl;
