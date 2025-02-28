import {SliderWithNumber} from "@/components/menu/properties/control/components/SliderWithNumber.tsx";
import {useRNGSettings} from "@/context/RNGSettingsContext.tsx";

const RNGControl = () => {

    const {currentRNGSettings, updateRNGSettings} = useRNGSettings();

    const setNumberOfCircles = (value: number[]) => {
        updateRNGSettings({numberOfCircles: value[0]});
    };

    const setMaxRadius = (value: number[]) => {
        updateRNGSettings({maxRadius: value[0]});
    };

    const setRadiusDelta = (value: number[]) => {
        updateRNGSettings({radiusDelta: value[0]});
    };

    const setMaxSpeed = (value: number[]) => {
        updateRNGSettings({maxSpeed: value[0]});
    };

    const setMinSpeed = (value: number[]) => {
        updateRNGSettings({minSpeed: value[0]});
    };

    const setSpeedDelta = (value: number[]) => {
        updateRNGSettings({speedDelta: value[0]});
    };

    return (
        <>
            {currentRNGSettings ?
                <div className={'flex flex-col gap-3'}>
                    <SliderWithNumber number={currentRNGSettings.numberOfCircles} setNumber={setNumberOfCircles}
                                      min={0} max={200}
                                      steps={1} label={'numberOfCircles'}/>
                    <SliderWithNumber number={currentRNGSettings.maxRadius} setNumber={setMaxRadius}
                                      min={0} max={300}
                                      steps={1} label={'maxRadius'}/>
                    <SliderWithNumber number={currentRNGSettings.radiusDelta} setNumber={setRadiusDelta}
                                      min={0} max={300}
                                      steps={1} label={'radiusDelta'}/>
                    <SliderWithNumber number={currentRNGSettings.maxSpeed} setNumber={setMaxSpeed}
                                      min={0} max={0.499}
                                      steps={0.001} label={'maxSpeed'}/>
                    <SliderWithNumber number={currentRNGSettings.minSpeed} setNumber={setMinSpeed}
                                      min={-0.499} max={0}
                                      steps={0.001} label={'minSpeed'}/>
                    <SliderWithNumber number={currentRNGSettings.speedDelta} setNumber={setSpeedDelta}
                                      min={0} max={5}
                                      steps={1} label={'speedDelta'}/>

                </div> : null
            }
        </>
    );
}

export default RNGControl;