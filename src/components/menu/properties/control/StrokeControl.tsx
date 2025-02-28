import {SliderWithNumber} from "@/components/menu/properties/control/components/SliderWithNumber.tsx";
import {useSettings} from "@/context/SettingsContext.tsx";
import {Switch} from "@heroui/switch";
import {Label} from "@/components/ui/label.tsx";


const StrokeControl = () => {

    const {updateStrokeSettings, currentStrokeSettings} = useSettings();

    const setCircleStroke = (value: number[]) => {
        updateStrokeSettings({circleStroke: value[0]});
    };

    const setPathStroke = (value: number[]) => {
        updateStrokeSettings({pathStroke: value[0]});
    };

    const setRadiusStroke = (value: number[]) => {
        updateStrokeSettings({radiusStroke: value[0]});
    };

    const setJointPointStroke = (value: number[]) => {
        updateStrokeSettings({jointPointStroke: value[0]});
    };

    const setDeletePathDelay = (value: number[]) => {
        updateStrokeSettings({deletePathDelay: value[0]});
    };

    const setDeletePath = (value: boolean) => {
        updateStrokeSettings({deletePath: value});
    };

    return (
        <>
            {currentStrokeSettings ?
                <div className={'flex flex-col gap-2.5'}>
                    <SliderWithNumber number={currentStrokeSettings.circleStroke} setNumber={setCircleStroke}
                                      min={0} max={5}
                                      steps={0.1} label={'Circle stroke'} toolTipText={undefined}/>
                    <SliderWithNumber number={currentStrokeSettings.pathStroke} setNumber={setPathStroke} min={0}
                                      max={5}
                                      steps={0.1} label={'Path stroke'} toolTipText={undefined}/>
                    <SliderWithNumber number={currentStrokeSettings.radiusStroke} setNumber={setRadiusStroke}
                                      min={0} max={5}
                                      steps={0.1} label={'Radius stroke'} toolTipText={undefined}/>
                    <SliderWithNumber number={currentStrokeSettings.jointPointStroke}
                                      setNumber={setJointPointStroke} min={0} max={5}
                                      steps={0.1} label={'Joint point stroke'} toolTipText={undefined}/>
                    <Switch size="sm" className={'mt-2 mb-2'} color={'default'} onValueChange={setDeletePath} isSelected={currentStrokeSettings.deletePath}>
                       <Label>Delete Path</Label>
                    </Switch>
                    {currentStrokeSettings.deletePath ?
                        <SliderWithNumber toolTipText={'number of seconds after which the end of the path will be deleted.'} number={currentStrokeSettings.deletePathDelay}
                                          setNumber={setDeletePathDelay} min={0} max={20}
                                          steps={1} label={'Joint point stroke'}/> : null}
                </div>
                : null
            }
        </>
    );
}

export default StrokeControl;