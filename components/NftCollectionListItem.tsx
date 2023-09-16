import { useNftCollection, useTheme } from "../hooks";
import { View } from 'react-native';
import Text from "./Text";

export default (props: {
  contractId: string
  renderItem: Function
}) => {
  const theme = useTheme();
  const styles = theme.styles;
  const collection = useNftCollection(props.contractId);
  if (!collection) {
    return <></>;
  }

  return (
    <View style={{
      width: 330,
      ...styles.rowGapSmall
    }}>
      <Text style={{ ...styles.textMedium, ...styles.textBold }}>
        {collection.name}
      </Text>

      <View style={{
        ...styles.directionRow,
        ...styles.columnGapBase,
        ...styles.rowGapBase,
        flexWrap: 'wrap'
      }}>
        {
          Object.keys(collection.tokens).map(item => props.renderItem(item))
        }
      </View>
    </View>
  )
}