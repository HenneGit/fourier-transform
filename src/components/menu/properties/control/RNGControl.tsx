import {SliderWithNumber} from "@/components/menu/properties/control/components/SliderWithNumber.tsx";
import {useRNGSettings} from "@/context/RNGSettingsContext.tsx";

const RNGControl = () => {

    const {currentRNGSettings, updateRNGSettings} = useRNGSettings();

    const setNumberOfCircles = (value: number) => {
        updateRNGSettings({numberOfCircles: value});
    };

    const setMaxRadius = (value: number) => {
        updateRNGSettings({maxRadius: value});
    };

    const setRadiusDelta = (value: number) => {
        updateRNGSettings({radiusDelta: value});
    };

    const setMaxSpeed = (value: number) => {
        updateRNGSettings({maxSpeed: value});
    };

    const setMinSpeed = (value: number) => {
        updateRNGSettings({minSpeed: value});
    };

    const setSpeedDelta = (value: number) => {
        updateRNGSettings({speedDelta: value});
    };

    return (
        <>
            {currentRNGSettings ?
                <div>
                    <SliderWithNumber defaultValue={currentRNGSettings.numberOfCircles} setNumber={setNumberOfCircles}
                                      min={0} max={200}
                                      steps={1} label={'numberOfCircles'}/>
                    <SliderWithNumber defaultValue={currentRNGSettings.maxRadius} setNumber={setMaxRadius}
                                      min={0} max={300}
                                      steps={1} label={'maxRadius'}/>
                    <SliderWithNumber defaultValue={currentRNGSettings.radiusDelta} setNumber={setRadiusDelta}
                                      min={0} max={300}
                                      steps={1} label={'radiusDelta'}/>
                    <SliderWithNumber defaultValue={currentRNGSettings.maxSpeed} setNumber={setMaxSpeed}
                                      min={0} max={0.499}
                                      steps={0.001} label={'maxSpeed'}/>
                    <SliderWithNumber defaultValue={currentRNGSettings.minSpeed} setNumber={setMinSpeed}
                                      min={-0.499} max={0}
                                      steps={0.001} label={'minSpeed'}/>
                    <SliderWithNumber defaultValue={currentRNGSettings.speedDelta} setNumber={setSpeedDelta}
                                      min={0} max={5}
                                      steps={1} label={'speedDelta'}/>

                </div> : null
            }
        </>
    );
}

export default RNGControl;