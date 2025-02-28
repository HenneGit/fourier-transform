import React, {useEffect, useState} from "react";
import Papa from "papaparse";
import {Point, ViewPort} from "@/model/model.ts";
import {transformNumberArrayToDimensions} from "@/components/menu/csv.helper.ts";
import {useWindowSize} from "@/App.tsx";

interface CsvRow {
    [key: string]: string;
}


const CsvUploader = ({setPath}: {
    setPath: (path: Point[]) => void;
}) => {
    const {width, height} = useWindowSize();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse<CsvRow>(file, {
            delimiter: ";",
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
                let inputPathData: [number, number][] = result.data;

                if (result.data.length > 1000) {
                    let pathLength = result.data.length;
                    while (pathLength > 1000) {
                        inputPathData = shrinkPathData(inputPathData);
                        pathLength = inputPathData.length;
                    }
                }

                const path = transformNumberArrayToDimensions(inputPathData, width, height);
                if (path) {
                    setPath(path);
                }
            },
        });
    };

    const shrinkPathData = (inputPathData: [number, number][]) => {
        const newPath: [number, number][] = [];
        for (let i = 0; i < inputPathData.length; i++) {
            if (i % 2 === 0) {
                newPath.push(inputPathData[i]);
            }
        }
        return newPath;
    };



    return (
        <div className={' flex flex-col mt-3'}>
            <span className={'text-black'}>You can upload a .csv file with a ';' delimiter.</span>
            <input className={'cursor-pointer ml-20 mt-4'} type="file" accept=".csv" onChange={handleFileUpload}/>
        </div>
    );
};

export default CsvUploader;
