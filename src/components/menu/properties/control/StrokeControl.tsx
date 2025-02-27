import {SliderWithNumber} from "@/components/menu/properties/control/components/SliderWithNumber.tsx";
import {useSettings} from "@/context/SettingsContext.tsx";


const StrokeControl = () => {

    const {updateStrokeSettings, currentStrokeSettings} = useSettings();


    const setNumber = (value: number) => {
        updateStrokeSettings({circleStroke: value});
    };


    return (

        <>
            <SliderWithNumber defaultValue={currentStrokeSettings.circleStroke} setNumber={setNumber} min={0} max={1}
                              steps={0.1} label={'hallo'}/>
        </>
    );
}

export default StrokeControl;