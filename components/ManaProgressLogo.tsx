import { View } from "react-native";
import { Svg, Circle } from 'react-native-svg'
import { useTheme } from "../hooks";
import Text from './Text';

export default (props: {
    size: number,
    strokeWidth: number,
    progressPercent: number,
}) => {
    const { size, strokeWidth } = props;
    const radius = (size - strokeWidth) / 2;
    const circum = radius * 2 * Math.PI;
    const svgProgress = 100 - props.progressPercent;

    const theme = useTheme();
    const { Color, Border } = theme.vars;
    const UnloadedColor = Border.color;
    const LoadedColor = Color.success;

    return (
        <View>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    stroke={UnloadedColor}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    {...{ strokeWidth }}
                />

                {/* Progress Circle */}
                <Circle
                    stroke={LoadedColor}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeDasharray={`${circum} ${circum}`}
                    strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
                    strokeLinecap="round"
                    transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                    {...{ strokeWidth }}
                />
            </Svg>

            <View style={{position: 'absolute', width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{...theme.styles.text, color: LoadedColor, fontSize: 10, lineHeight: 12}}>MANA</Text>
                <View style={{...theme.styles.directionRow}}>
                    <Text style={{...theme.styles.text, color: LoadedColor, fontSize: 14, lineHeight: 16}}> {props.progressPercent}</Text>
                    <Text style={{...theme.styles.text, color: LoadedColor, fontSize: 10, lineHeight: 16}}>%</Text>
                </View>
                
            </View>

        </View>
    )
}