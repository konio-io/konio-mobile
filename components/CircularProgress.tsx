import { View } from "react-native";
import { Svg, Circle, Text as SVGText } from 'react-native-svg'
import { useTheme } from "../hooks";

const CircularProgress = (props: {
    size: number,
    strokeWidth: number,
    text?: string,
    progressPercent: number,
    bgColor?: string,
    pgColor?: string
    textSize?: number,
    textColor?: string
}) => {
  const { size, strokeWidth, text } = props;
  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;
  const svgProgress = 100 - props.progressPercent;

  const theme = useTheme();
  const { FontFamily } = theme.vars;

  return (
    <View style={{margin: 10}}>
      <Svg width={size} height={size}>
        
        {/* Background Circle */}
        <Circle 
          stroke={props.bgColor ? props.bgColor : "#f2f2f2"}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          {...{strokeWidth}}
        />
        
        {/* Progress Circle */}
        <Circle 
          stroke={props.pgColor ? props.pgColor : "#3b5998"}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={radius * Math.PI * 2 * (svgProgress/100)}
          strokeLinecap="round"
          transform={`rotate(-90, ${size/2}, ${size/2})`}
          {...{strokeWidth}}
        />

        {/* Text */}
        <SVGText
          fontSize={props.textSize ? props.textSize : "10"}
          fontFamily={FontFamily.sans}
          x={size / 2}
          y={size / 2 + (props.textSize ?  (props.textSize / 2) - 1 : 5)}
          textAnchor="middle"
          fill={props.textColor ? props.textColor : "#333333"}
        >
          {text}
        </SVGText>
      </Svg>
    </View>
  )
}

export default CircularProgress;