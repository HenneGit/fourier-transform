import {Point} from "@/model/model.ts";
import {useEffect, useRef, useState} from "react";
import Papa from "papaparse";
import StaticSVGPathRenderer from "@/components/fourier/StaticSVGPathRenderer.tsx";
import {transformNumberArrayToDimensions} from "@/components/menu/csv.helper.ts";
import {useSettings} from "@/context/SettingsContext.tsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";


export const SvgMenu = ({
                            setPath
                        }: {
    setPath: (path: Point[]) => void;
}) => {
    const fileNames = ['butterfly.csv', 'chess.csv', 'star.csv', 'wildForm.csv'];
    const [pathArray, setPathArray] = useState<Point[][]>([]);
    const {currentColorSettings, currentStrokeSettings} = useSettings();
    const dataFetched = useRef(false);


    const fetchCSV = async (fileName: string) => {
        const response = await fetch('/csv/' + fileName);
        return await response.text();
    };

    useEffect(() => {
        if (dataFetched.current) return;
        dataFetched.current = true;

        Promise.all(fileNames.map(fetchCSV))
            .then((texts) => {
                const parsedPaths = texts.map(text => {
                    const parsed = Papa.parse(text, {
                        delimiter: ";",
                        header: false,
                        skipEmptyLines: true,
                        dynamicTyping: true
                    });
                    return transformNumberArrayToDimensions(parsed.data, 400, 200);
                });
                if (parsedPaths) {
                    setPathArray(parsedPaths as Point[][]);
                }
            });
    }, []);

    return (
        <>
            <div className={'mt-20 z-[999]'}>
                {pathArray && pathArray.length > 0 ?
                    <Carousel
                        id={'path-carousel'}
                        opts={{
                            align: "start",
                        }}
                        orientation="vertical"
                        className="w-full max-w-xs"
                    >
                        <CarouselContent className="-mt-1 h-[170px]">
                            {pathArray.map((path, index) => (
                                <CarouselItem key={index} className="pt-1 md:basis-1/2">
                                    <div onClick={() => setPath(path)} className="p-1 cursor-pointer ">
                                        <Card>
                                            <CardContent className="flex items-center justify-center p-6 h-full w-full">
                                                {currentStrokeSettings && currentColorSettings ?
                                                    <StaticSVGPathRenderer colors={currentColorSettings}
                                                                           inputPath={path}
                                                                           strokes={currentStrokeSettings} viewPort={{
                                                        minY: -100,
                                                        minX: -200,
                                                        height: 200,
                                                        width: 400
                                                    }}/> : null
                                                }
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent >
                        <CarouselPrevious  id={'path-carousel'}/>
                        <CarouselNext/>
                    </Carousel> : null
                }
            </div>
        </>
    );
};
