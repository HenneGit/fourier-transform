import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,} from "@/components/ui/sidebar.tsx";
import {Preset, presets} from "@/presets.ts";
import {IFourierColorSettings, IFourierProperties, IFourierStrokeSettings, Point, ViewPort} from "@/model/model.ts";
import {useEffect, useState} from "react";
import Papa from "papaparse";
import StaticSVGPath from "@/components/fourier/StaticSVGPath.tsx";
import {transFormPathToDimensions} from "@/components/menu/csv.helper.ts";


export const SvgMenu = ({
                            setProperties,
                            setStrokes,
                            setColors,
                            colors,
                            strokes,
                            properties,
                            setKey,
                            setIsUploading
                        }: {
    colors: IFourierColorSettings;
    strokes: IFourierStrokeSettings;
    properties: IFourierProperties;
    setProperties: React.Dispatch<React.SetStateAction<IFourierProperties>>;
    setStrokes: React.Dispatch<React.SetStateAction<IFourierStrokeSettings>>;
    setColors: React.Dispatch<React.SetStateAction<IFourierColorSettings>>;
    height: number
    width: number
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
    setKey: React.Dispatch<React.SetStateAction<number>>
}) => {
    const width = 400;
    const height = 200
    const fileNames = ['butterfly.csv', 'chess.csv', 'star.csv']
    const [viewPort, setViewPort] = useState<ViewPort>()
    const [pathArray, setPathArray] = useState<Point[][]>([]);


    useEffect(() => {
        setViewPort({
            minX: -width / 2,
            minY: -height / 2,
            height: height,
            width: width
        })
    }, []);

    const fetchCSV = async (fileName: string) => {
        const response = await fetch('/csv/' + fileName);
        const text = await response.text();
        return text;
    };

    useEffect(() => {
        if (pathArray.length > 0) {
            return;
        }
        fileNames.forEach(fileName => {
            fetchCSV(fileName)
                .then((text) => {
                    const parsed = Papa.parse(text, {
                        delimiter: ";",
                        header: false,
                        skipEmptyLines: true,
                        dynamicTyping: true
                    });
                    const transformedPath = transFormPathToDimensions(parsed.data, 200, 100);
                    if (transformedPath) {
                        setPathArray(prevState => [...prevState, transformedPath]);
                    }
                });
        });
    }, []);


    return (
        <>
            <Sidebar side={'right'}>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <div className={'flex flex-col gap-2.5 h-full w-full'}>
                                {viewPort && pathArray ? pathArray.map((path, index) => (
                                    <div key={index} className={'w-full h-[15vh]'}>
                                        <StaticSVGPath viewPort={viewPort} key={index} properties={properties} colors={colors}
                                                       strokes={strokes}
                                                       inputPath={path}/>
                                    </div>
                                )) : null}
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </>
    );
};
