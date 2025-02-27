import {ColorPicker} from "@/components/menu/properties/control/components/ColorPicker.tsx";
import {useSettings} from "@/context/SettingsContext.tsx";
import {HslColor} from "react-colorful";
import {useState} from "react";

const ColorControl = () => {

    const {updateColorSettings, currentColorSettings} = useSettings();

    const [colorCopy, setColorCopy] = useState({
        h: currentColorSettings.circleColor[0],
        s: currentColorSettings.circleColor[1],
        l: currentColorSettings.circleColor[2]
    })

    const setCircleColor = (color: HslColor) => {
        updateColorSettings({circleColor: [color.h, color.s, color.l]});
    };

    const setRadiusColor = (color: HslColor) => {
        updateColorSettings({radiusColor: [color.h, color.s, color.l]});
    };

    const setJointPointColor = (color: HslColor) => {
        updateColorSettings({jointPointColor: [color.h, color.s, color.l]});
    };

    const setBackgroundColor = (color: HslColor) => {
        updateColorSettings({backgroundColor: [color.h, color.s, color.l]});
    };

    const setPathColor = (color: HslColor) => {
        updateColorSettings({pathColor: [color.h, color.s, color.l]});
    };


    return (
        <>
            {currentColorSettings ?
                <div>
                    <ColorPicker label={'Circle'} color={currentColorSettings.circleColor}
                                 setColor={(color) => setCircleColor(color)}/>
                    <ColorPicker label={'Radius'} color={currentColorSettings.radiusColor}
                                 setColor={setRadiusColor}/>
                    <ColorPicker label={'Joint point'} color={currentColorSettings.jointPointColor}
                                 setColor={setJointPointColor}/>
                    <ColorPicker label={'Background'} color={currentColorSettings.backgroundColor}
                                 setColor={setBackgroundColor}/>
                    <ColorPicker label={'Path'} color={currentColorSettings.pathColor}
                                 setColor={setPathColor}/>
                </div> : null
            }
        </>
    );
}

export default ColorControl;