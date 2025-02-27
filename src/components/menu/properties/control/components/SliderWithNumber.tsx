import {Slider} from "@heroui/react";

export const SliderWithNumber = ({label, setNumber, min, max, steps, defaultValue}: {
    defaultValue: number;
    setNumber: (value: number) => void;
    min: number;
    max: number;
    steps: number;
    label: string;
}) => {


    const handleWheel = (event: React.WheelEvent) => {
        console.log('de');
        const delta = event.deltaY > 0 ? -steps : steps;
        let newValue = Math.min(max, Math.max(min, defaultValue + delta));
        newValue = parseFloat(newValue.toFixed(3));
        setNumber(newValue);
    };

    const onNumberChange = (value: number | number[]) => {
        console.log(value);
        setNumber(value as  number)
    }


    return (
        <>
            <Slider
                className="max-w-md text-black z-[800]"
                color="foreground"
                label={label}
                maxValue={max}
                minValue={min}
                value={defaultValue}
                showSteps={true}
                size="lg"
                onChange={onNumberChange}
                onWheel={handleWheel}
                step={steps}
            />
        </>
    );
};
