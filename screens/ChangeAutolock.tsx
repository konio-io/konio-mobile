import { FlatList, View } from 'react-native';
import { useTheme, useI18n, useAutolock } from '../hooks';
import { setAutolock, showToast } from '../actions';
import { ListItemSelected, Text, Wrapper } from '../components';

export default () => {
  const theme = useTheme();
  const styles = theme.styles;
  const data = [
    0,
    5000,
    15000,
    30000,
    60000,
    300000,
    600000,
  ];

  return (
    <Wrapper type="full">

      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

    </Wrapper>
  );
}

export const ListItem = (props: {
  item: number
}) => {

  const i18n = useI18n();
  const autolock = useAutolock().get();

  const convertMils = (ms: number) : string => {
    if (ms === 0) {
      return 'never';
    }

    var seconds = Math.floor(ms / 1000);
    var minutes = Math.floor(seconds / 60);
  
    if (minutes > 0) {
      return minutes + (minutes === 1 ? ' ' + i18n.t('minute') : ' ' + i18n.t('minutes'));
    } else {
      return seconds + (seconds === 1 ? ' ' + i18n.t('second') : ' ' + i18n.t('seconds'));
    } 
  }

  const ItemComponent = () => (
    <View>
      <Text>{convertMils(props.item)}</Text>
    </View>
  );

  const selected = autolock === props.item;

  const changeAutolock = () => {
    setAutolock(props.item);
    showToast({
      type: 'info',
      text1: i18n.t('autolock_changed', {autolock: convertMils(props.item)})
    });
  }

  return <ListItemSelected ItemComponent={ItemComponent} selected={selected} onPress={changeAutolock}/>
}
