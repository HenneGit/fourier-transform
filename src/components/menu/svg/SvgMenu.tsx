import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,} from "@/components/ui/sidebar.tsx";
import {ColorSettings, RandomCirclesSettings, StrokeSettings, Point, ViewPort} from "@/model/model.ts";
import {useEffect, useState} from "react";
import Papa from "papaparse";
import StaticSVGPath from "@/components/fourier/StaticSVGPath.tsx";
import {transformNumberArrayToDimensions} from "@/components/menu/csv.helper.ts";


export const SvgMenu = ({
                            colors,
                            strokes,
                            properties,
                            setPath
                        }: {
    colors: ColorSettings;
    strokes: StrokeSettings;
    properties: RandomCirclesSettings;
    setPath: (path: Point[])=> void;
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
                    const transformedPath = transformNumberArrayToDimensions(parsed.data, 200, 100);
                    if (transformedPath) {
                        setPathArray(prevState => [...prevState, transformedPath]);
                    }
                });
        });
    }, []);

    const onSVGClick = (path: Point[]) => {
        setPath(path);
    }


    return (
        <>
            <Sidebar side={'right'}>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <div className={'flex flex-col gap-2.5 h-full w-full'}>
                                {viewPort && pathArray ? pathArray.map((path, index) => (
                                    <div key={index} className={'w-full h-[15vh] cursor-pointer'}
                                         onClick={() => onSVGClick(path)}>
                                        <StaticSVGPath viewPort={viewPort} key={index} properties={properties}
                                                       colors={colors}
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
