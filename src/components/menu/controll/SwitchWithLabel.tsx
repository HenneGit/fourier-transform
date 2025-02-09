import {Label} from "@radix-ui/react-label";
import {Switch} from "@/components/ui/switch.tsx";

export const SwitchWithLabel = ({setValue, value, lable}: {
    setValue: (value: boolean) => void;
    value: boolean;
    lable: string;
}) => {

    return (
        <div className={"flex flex-col gap-[.5em] items-center justify-center"}>
            <div className={"flex w-full justify-between items-center"}>
                <Label htmlFor="delete-path" className="font-sans text-xs font-medium text-black">{lable}</Label>
                <Switch id="delete-path" checked={value}
                        onCheckedChange={setValue}/>
            </div>
        </div>
    );
};
