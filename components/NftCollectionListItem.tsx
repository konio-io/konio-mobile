import { useNftCollection, useTheme } from "../hooks";
import { View, TouchableOpacity } from 'react-native';
import Text from "./Text";
import NftListItem from "./NftListItem";

export default (props: {
  contractId: string
  renderItem: Function
}) => {
  const theme = useTheme();
  const styles = theme.styles;
  const collection = useNftCollection(props.contractId);
  if (!collection.ornull) {
    return <></>;
  }

  return (
    <View style={{
      width: 330,
      ...styles.rowGapSmall
    }}>
      <Text style={{ ...styles.textMedium, ...styles.textBold }}>
        {collection.name.get()}
      </Text>

      <View style={{
        ...styles.directionRow,
        ...styles.columnGapBase,
        ...styles.rowGapBase,
        flexWrap: 'wrap'
      }}>
        {
          Object.keys(collection.tokens.get()).map(item => props.renderItem(item))
        }
      </View>
    </View>
  )
}