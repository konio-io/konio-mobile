import { TouchableHighlight, View } from 'react-native';
import Text from './Text';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import { useTheme } from '../hooks';


export default (props: {
    selected: string,
    onChange: Function
  }) => {
  
    const theme = useTheme();
    const styles = theme.styles;
    const { Color, Border } = theme.vars;
  
    return (
      <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.alignCenterRow }}>
  
        <TouchableHighlight onPress={() => props.onChange(CATEGORY_COINS)} style={{
          borderTopLeftRadius: Border.radius,
          borderBottomLeftRadius: Border.radius,
          width: 100
        }}>
          <View style={{
            ...styles.paddingSmall,
            ...styles.alignCenterColumn,
            borderTopLeftRadius: Border.radius,
            borderBottomLeftRadius: Border.radius,
            backgroundColor: props.selected === CATEGORY_COINS ? Color.primary : Border.color,
          }}>
            <Text style={{
              ...styles.text,
              color: props.selected === CATEGORY_COINS ? Color.primaryContrast : Color.baseContrast,
            }}>COINS</Text>
          </View>
        </TouchableHighlight>
  
        <TouchableHighlight onPress={() => props.onChange(CATEGORY_NFTS)} style={{
          borderTopRightRadius: Border.radius,
          borderBottomRightRadius: Border.radius,
          width: 100,
        }}>
          <View style={{
            ...styles.paddingSmall,
            ...styles.alignCenterColumn,
            backgroundColor: props.selected === CATEGORY_NFTS ? Color.primary : Border.color,
            borderTopRightRadius: Border.radius,
            borderBottomRightRadius: Border.radius
          }}>
            <Text style={{
              ...styles.text,
              color: props.selected === CATEGORY_NFTS ? Color.primaryContrast : Color.baseContrast,
            }}>NFTs</Text>
          </View>
        </TouchableHighlight>
  
      </View>
    );
  }