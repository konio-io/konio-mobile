import { View } from "react-native";
import { useTheme } from "../hooks";
import { ReactElement } from "react";
import { Feather } from '@expo/vector-icons';
import ListItem from "./ListItem";

export default (props: {
  ItemComponent: ReactElement,
  onPress?: Function,
  onLongPress?: Function,
  selected: boolean
}) => {

  const ItemComponent = props.ItemComponent;
  const theme = useTheme();
  const { Color } = theme.vars;

  return (
    <ListItem
      content={(ItemComponent)}
      name=''
      onPress={() => {
        if (props.onPress) {
          props.onPress();
        }
      }}
      onLongPress={() => {
        if (props.onLongPress) {
          props.onLongPress();
        }
      }}
      right={(
        <View style={{ width: 30 }}>
          {props.selected &&
            <Feather name="check" size={24} color={Color.primary} />
          }
        </View>
      )}
    />
  )
}