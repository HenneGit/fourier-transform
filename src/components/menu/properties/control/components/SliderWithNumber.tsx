import {Slider} from "@/components/ui/slider.tsx";
import {Label} from "@radix-ui/react-label";
import {useState} from "react";

export const SliderWithNumber = ({number, setNumber, min, max, steps, label}: {
    number: number;
    setNumber: (value: number[]) => void;
    min: number;
    max: number;
    steps: number;
    label: string;
}) => {

    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(true);
        console.log('mouse down')

    };
    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (event: React.WheelEvent) => {
        const delta = event.deltaY > 0 ? -steps : steps;
        let newValue = Math.min(max, Math.max(min, number + delta));
        newValue = parseFloat(newValue.toFixed(3));
        setNumber([newValue]);
    };
    const handleChange = (value: number[]) => {
        setNumber([...value]);
    };



    return (
        <div className={"flex flex-col gap-[.5em] items-center justify-center"}>
            <div className={"flex w-full justify-between items-center"}>
                <Label
                    className="font-sans text-xs font-medium text-black"
                    htmlFor={"number-slider" + '-' + label}
                    aria-checked={"true"}
                >
                    {label}
                </Label>
                <span className="font-sans text-xs font-medium text-black">
      {number}
    </span>
            </div>
            <Slider
                className={isDragging ? "cursor-grabbing" : "cursor-pointer"}
                onPointerDown={handleMouseDown}
                onPointerUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheelCapture={handleWheel}
                value={[number]}
                max={max}
                min={min}
                step={steps}
                onValueChange={handleChange}
                id={"number-slider" + '-' + label}
            />
        </div>
    );
};
