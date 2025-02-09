import {Slider} from "@/components/ui/slider.tsx";
import {Label} from "@radix-ui/react-label";

export const SliderWithNumber = ({number, setNumber, min, max, steps}: {
    number: number;
    setNumber: (value: number[]) => void;
    min: number;
    max: number;
    steps: number
}) => {

    return (
        <div className={"flex flex-col gap-[.5em] items-center justify-center"}>
            <div className={"flex w-full justify-between items-center"}>
                <Label
                    className="font-sans text-sm font-medium text-black"
                    htmlFor={"number-slider"}
                    aria-checked={"true"}
                >
                    Circles
                </Label>
                <span className="font-sans text-sm font-medium text-black">
      {number}
    </span>
            </div>
            <Slider
                defaultValue={[number]}
                max={max}
                min={min}
                step={steps}
                onValueChange={setNumber}
                id={"number-slider"}
            />
        </div>
    );
};
