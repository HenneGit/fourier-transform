import { useState, useEffect, useRef } from "react";
import { HslStringColorPicker } from "react-colorful";

export const ColorPicker = ({ color, setColor }: { color: string; setColor: (color: string) => void }) => {
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
        <div className="relative inline-block" ref={pickerRef}>
            <div
                className="w-5 h-5 border border-gray-400 cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <div className="absolute bottom-full mb-2 p-2 bg-white shadow-lg border rounded">
                    <HslStringColorPicker color={color} onChange={setColor} />
                </div>
            )}
        </div>
    );
};
