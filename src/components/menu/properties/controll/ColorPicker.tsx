import {useEffect, useRef, useState} from "react";
import {HslColor, HslColorPicker} from "react-colorful";
import {Label} from "@/components/ui/label.tsx";

export const ColorPicker = ({color, setColor, lable}: { color: number[]; setColor: (color: HslColor) => void; lable:string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getHslString = (hsl: number[]): string => {
        return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
    }
    return (
        <div>
            <div className=" flex w-full justify-between items-center" ref={pickerRef}>
                <Label className="font-sans text-xs font-medium text-black" >{lable}</Label>
                <div
                    className="w-5 h-5 border border-gray-400 cursor-pointer"
                    style={{backgroundColor: getHslString(color)}}
                    onClick={() => setIsOpen(!isOpen)}
                />
                {isOpen && (
                    <div className="absolute bottom-full mb-2 p-2 bg-white shadow-lg border rounded">
                        <HslColorPicker color={{h:color[0], s:color[1], l:color[2] }} onChange={setColor}/>
                    </div>
                )}
            </div>
        </div>
    );
};
