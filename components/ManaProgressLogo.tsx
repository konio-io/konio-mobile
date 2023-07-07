import { View } from "react-native";
import { Svg, Circle, Text as SVGText, Path } from 'react-native-svg'
import { useTheme } from "../hooks";

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
    const StrokeColor = Color.primary;
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
                <Path
                    fill="none"
                    stroke={StrokeColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={10}
                    d="m141.229 35.929 92.127 52.114v106.042l-92.127 52.428-92.125-51.941V88.531z"
                    style={{
                        fill: StrokeColor,
                        fillOpacity: 1,
                        stroke: StrokeColor,
                        strokeOpacity: 1,
                    }}
                    transform="matrix(.17668 0 0 .17668 2.327 3.195)"
                />
                <Path
                    fill={StrokeColor}
                    d="M117.313 196.72h-26.45V87.868h32.384l17.633 58.157 17.634-58.157h32.384V196.72h-26.279v-69.177l-13.564 45.61h-20.346l-13.395-45.271v68.838z"
                    style={{
                        fill: StrokeColor,
                        fillOpacity: 1,
                    }}
                    transform="matrix(.17668 0 0 .17668 2.327 3.195)"
                />

            </Svg>
        </View>
    )
}