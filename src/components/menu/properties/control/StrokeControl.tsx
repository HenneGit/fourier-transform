import {SliderWithNumber} from "@/components/menu/properties/control/components/SliderWithNumber.tsx";
import {useSettings} from "@/context/SettingsContext.tsx";
import {Switch} from "@heroui/switch";


const StrokeControl = () => {

    const {updateStrokeSettings, currentStrokeSettings} = useSettings();

    const setCircleStroke = (value: number) => {
        updateStrokeSettings({circleStroke: value});
    };

    const setPathStroke = (value: number) => {
        updateStrokeSettings({pathStroke: value});
    };

    const setRadiusStroke = (value: number) => {
        updateStrokeSettings({radiusStroke: value});
    };

    const setJointPointStroke = (value: number) => {
        updateStrokeSettings({jointPointStroke: value});
    };

    const setDeletePathDelay = (value: number) => {
        updateStrokeSettings({deletePathDelay: value});
    };

    const setDeletePath = (value: boolean) => {
        updateStrokeSettings({deletePath: value});
    };

    return (
        <>
            {currentStrokeSettings ?
                <div>
                    <SliderWithNumber defaultValue={currentStrokeSettings.circleStroke} setNumber={setCircleStroke}
                                      min={0} max={1}
                                      steps={0.1} label={'Circle stroke'}/>
                    <SliderWithNumber defaultValue={currentStrokeSettings.pathStroke} setNumber={setPathStroke} min={0}
                                      max={1}
                                      steps={0.1} label={'Path stroke'}/>
                    <SliderWithNumber defaultValue={currentStrokeSettings.radiusStroke} setNumber={setRadiusStroke}
                                      min={0} max={1}
                                      steps={0.1} label={'Radius stroke'}/>
                    <SliderWithNumber defaultValue={currentStrokeSettings.jointPointStroke}
                                      setNumber={setJointPointStroke} min={0} max={1}
                                      steps={0.1} label={'Joint point stroke'}/>
                    <Switch size="sm" onValueChange={setDeletePath} isSelected={currentStrokeSettings.deletePath}>
                        Delete path
                    </Switch>
                    {currentStrokeSettings.deletePath ?
                        <SliderWithNumber defaultValue={currentStrokeSettings.deletePathDelay}
                                          setNumber={setDeletePathDelay} min={0} max={20}
                                          steps={1} label={'Joint point stroke'}/> : null}
                </div>
                : null
            }
        </>
    );
}

export default StrokeControl;