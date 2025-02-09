import {useEffect, useRef, useState} from "react";
import {HslStringColorPicker} from "react-colorful";
import {Label} from "@/components/ui/label.tsx";

export const ColorPicker = ({color, setColor, lable}: { color: string; setColor: (color: string) => void; lable:string }) => {
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

    return (
        <div>
            <div className=" flex w-full justify-between items-center" ref={pickerRef}>
                <Label className="font-sans text-xs font-medium text-black" >{lable}</Label>
                <div
                    className="w-5 h-5 border border-gray-400 cursor-pointer"
                    style={{backgroundColor: color}}
                    onClick={() => setIsOpen(!isOpen)}
                />
                {isOpen && (
                    <div className="absolute bottom-full mb-2 p-2 bg-white shadow-lg border rounded">
                        <HslStringColorPicker color={color} onChange={setColor}/>
                    </div>
                )}
            </div>
        </div>
    );
};
