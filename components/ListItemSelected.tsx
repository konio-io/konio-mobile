import { TouchableHighlight, View } from "react-native";
import { useTheme } from "../hooks";
import { JSXElementConstructor } from "react";
import { AntDesign } from '@expo/vector-icons';

export default (props: {
  ItemComponent: JSXElementConstructor<any>
  onPress: Function,
  onLongPress?: Function,
  selected: boolean
}) => {

  const ItemComponent = props.ItemComponent;
  const theme = useTheme();
  const { Color } = theme.vars;
  const styles = theme.styles;

  return (
    <TouchableHighlight
      onPress={() => {
        props.onPress();
      }}
      onLongPress={() => {
        if (props.onLongPress) {
          props.onLongPress();
        }
      }}
    >
      <View style={styles.listItemContainer}>

        <View style={{ flexGrow: 1 }}>
          <ItemComponent />
        </View>

        <View style={{ width: 30 }}>
          {props.selected &&
            <AntDesign name="check" size={24} color={Color.primary} />
          }
        </View>

      </View>
    </TouchableHighlight>
  );
}