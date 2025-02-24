import React from "react";
import Papa from "papaparse";
import {Point} from "@/model/model.ts";
import {transFormPathToDimensions} from "@/components/menu/csv.helper.ts";

interface CsvRow {
    [key: string]: string;
}

const CsvUploader = ({setPath, height, width, setIsUploading, setKey }: {
    setPath: (path: Point[]) => void;
    height: number;
    width: number;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
    setKey: React.Dispatch<React.SetStateAction<number>>
}) => {


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        Papa.parse<CsvRow>(file, {
            delimiter: ";",
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
                const inputPathData: [number, number][] = result.data
                const transformedPath = transFormPathToDimensions(inputPathData, width, height);
                if (transformedPath) {
                    setPath(transformedPath);
                    setIsUploading(false);
                    setKey(prevKey => prevKey + 1);
                    sessionStorage.setItem('path', JSON.stringify(transformedPath))
                }
            },
        });
    };


    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileUpload}/>
        </div>
    );
};

export default CsvUploader;
