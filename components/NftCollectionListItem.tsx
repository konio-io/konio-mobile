import { useTheme } from "../hooks";
import { View } from 'react-native';
import Text from "./Text";
import { useHookstate } from "@hookstate/core";
import { NftCollectionStore, NftStore } from "../stores";

export default (props: {
  nftCollectionId: string
  renderItem: Function
}) => {
  const theme = useTheme();
  const styles = theme.styles;
  const collection = useHookstate(NftCollectionStore.state.nested(props.nftCollectionId)).get();
  const nfts = useHookstate(NftStore.state).get();
  const data = Object.values(nfts).filter(nft => nft.nftCollectionId === collection.id);

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
          data.map(item => props.renderItem(item.id))
        }
      </View>
    </View>
  )
}