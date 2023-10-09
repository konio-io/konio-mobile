import * as React from "react";
import { View } from "react-native";
import Svg, { G, Path, LinearGradient, Stop } from "react-native-svg";
import { useTheme } from "../hooks";

export default (props: {
  width?: number,
  height?: number,
  showText?: boolean
}) => {
  const theme = useTheme();
  const { Color } = theme.vars;

  return (
    <View style={{
      width: props.width ?? 300,
      height: props.height ?? 300,
      justifyContent: 'center',
    }}
    >
      <View style={{ aspectRatio: 1 }}>

        <Svg
          x="0px"
          y="0px"
          width='100%'
          height='100%'
          viewBox="0 0 163.69701 148.06415"
        >
          <Path
            fill={Color.primary}
            d="M155.954 37.371a27.657 27.657 0 00-23.958-13.832H94.777a27.66 27.66 0 00-23.959 13.832L61.096 54.21l19.97 11.519 9.717-16.83a4.614 4.614 0 013.994-2.306h37.219c1.646 0 3.168.879 3.99 2.306l18.611 32.233a4.617 4.617 0 010 4.61l-53.191 92.131a4.611 4.611 0 01-3.993 2.307H78.804v23.053h18.608a27.66 27.66 0 0023.958-13.832l53.191-92.131a27.673 27.673 0 000-27.667z"
            transform="matrix(.82289 0 0 .82398 -11.455 -19.396)"
            fillOpacity={1}
          />
          <Path
            fill={Color.primary}
            d="M166.578 203.233a27.666 27.666 0 0023.959-13.832l18.607-32.229a27.668 27.668 0 000-27.667l-9.305-16.118-19.966 11.528 9.305 16.117a4.612 4.612 0 010 4.607l-18.609 32.234a4.607 4.607 0 01-3.991 2.307h-37.219a4.61 4.61 0 01-3.995-2.307l-53.189-92.13a4.608 4.608 0 010-4.61l9.305-16.118-19.967-11.528-9.305 16.115a27.668 27.668 0 000 27.667L105.4 189.4a27.663 27.663 0 0023.959 13.832z"
            transform="matrix(.82289 0 0 .82398 -11.455 -19.396)"
            fillOpacity={1}
          />
          <Path
            fill={Color.primary}
            d="M17.626 129.503a27.673 27.673 0 000 27.667l18.608 32.23a27.665 27.665 0 0023.959 13.832h19.611V180.18H60.193a4.608 4.608 0 01-3.992-2.307l-18.61-32.234a4.607 4.607 0 010-4.607l18.61-32.234a4.61 4.61 0 013.992-2.305h106.385c1.646 0 3.169.878 3.991 2.305l9.573 16.581 20.313-10.928-9.918-17.181a27.665 27.665 0 00-23.959-13.833H60.193A27.664 27.664 0 0036.234 97.27z"
            transform="matrix(.82289 0 0 .82398 -11.455 -19.396)"
            fillOpacity={1}
          />
          <G opacity={0.18}>
            <Path
              d="M105.4 189.401l-5.681-9.839a4.61 4.61 0 01-2.307.618h-8.443l13.075 22.647a27.644 27.644 0 0011.335-4.693 27.606 27.606 0 01-7.979-8.733zM60.193 106.492c-.823 0-1.615.219-2.304.616l5.562 9.634h26.62l-5.917-10.25zM178.137 85.992a27.628 27.628 0 01-3.574 11.277l-5.682 9.84a4.616 4.616 0 011.688 1.688l5.276 9.138 13.228-22.911a27.643 27.643 0 00-10.936-9.032z"
              transform="matrix(.82289 0 0 .82398 -11.455 -19.396)"
            />
          </G>
          <G>
            <G opacity={0.6} transform="matrix(.82289 0 0 .82398 -11.455 -19.396)">
              <LinearGradient
                id="a"
                gradientUnits="userSpaceOnUse"
                x1={294.22729}
                y1={-230.5193}
                x2={294.22729}
                y2={-76.456802}
                gradientTransform="matrix(1 0 0 -1 -155.93 -52.917)"
              >
                <Stop offset={0.15} stopColor="#fff" stopOpacity={0} />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0.1} />
                <Stop offset={0.85} stopColor="#fff" stopOpacity={0} />
              </LinearGradient>
              <Path
                fill="url(#a)"
                d="M174.563 69.603l-18.608-32.231a27.657 27.657 0 00-23.958-13.832H98.323v23.054h33.673c1.646 0 3.168.879 3.99 2.306l18.611 32.233a4.617 4.617 0 010 4.61l-39.881 69.074 13.466 22.785 46.38-80.333a27.664 27.664 0 00.001-27.666z"
              />
            </G>
            <G opacity={0.6} transform="matrix(.82289 0 0 .82398 -11.455 -19.396)">
              <LinearGradient
                id="b"
                gradientUnits="userSpaceOnUse"
                x1={-248.3376}
                y1={71.518303}
                x2={-248.3376}
                y2={225.5847}
                gradientTransform="scale(-1 1) rotate(-60 -195.453 -13.884)"
              >
                <Stop offset={0.15} stopColor="#fff" stopOpacity={0} />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0.1} />
                <Stop offset={0.85} stopColor="#fff" stopOpacity={0} />
              </LinearGradient>
              <Path
                fill="url(#b)"
                d="M36.271 97.209l-18.609 32.23a27.667 27.667 0 000 27.664l16.836 29.162 19.965-11.527-16.837-29.16a4.613 4.613 0 01.002-4.609l18.609-32.234a4.612 4.612 0 013.993-2.305h79.761l13-23.054-92.761.001a27.66 27.66 0 00-23.959 13.832z"
              />
            </G>
            <G opacity={0.6} transform="matrix(.82289 0 0 .82398 -11.455 -19.396)">
              <LinearGradient
                id="c"
                gradientUnits="userSpaceOnUse"
                x1={285.0076}
                y1={390.5051}
                x2={285.0076}
                y2={544.57251}
                gradientTransform="scale(-1 1) rotate(60 351.745 -39.397)"
              >
                <Stop offset={0.15} stopColor="#fff" stopOpacity={0} />
                <Stop offset={0.5} stopColor="#fff" stopOpacity={0.1} />
                <Stop offset={0.85} stopColor="#fff" stopOpacity={0} />
              </LinearGradient>
              <Path
                fill="url(#c)"
                d="M129.323 203.169l37.218.001a27.661 27.661 0 0023.958-13.833l16.837-29.161-19.966-11.527-16.836 29.162a4.607 4.607 0 01-3.993 2.303l-37.221.002a4.613 4.613 0 01-3.992-2.306l-39.881-69.075-26.465.27 46.381 80.333a27.666 27.666 0 0023.96 13.831z"
              />
            </G>
          </G>
        </Svg>

      </View>
    </View>
  );
}
