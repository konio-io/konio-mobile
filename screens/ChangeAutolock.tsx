import { FlatList, View } from 'react-native';
import { useI18n, useAutolock } from '../hooks';
import { ListItem, Text, Screen } from '../components';
import { SettingStore } from '../stores';

export default () => {

  const data = [
    -1,
    0,
    5000,
    15000,
    30000,
    60000,
    300000,
    600000,
  ];

  return (
    <Screen>

      <FlatList
        data={data}
        renderItem={({ item }) => <AutolockListItem item={item} />}
      />

    </Screen>
  );
}

export const AutolockListItem = (props: {
  item: number
}) => {

  const i18n = useI18n();
  const autolock = useAutolock();

  const convertMils = (ms: number): string => {
    if (ms === -1) {
      return i18n.t('never');
    }
    else if (ms === 0) {
      return i18n.t('immediately');
    }

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return i18n.t('after') + ' ' + minutes + (minutes === 1 ? ' ' + i18n.t('minute') : ' ' + i18n.t('minutes'));
    } else {
      return i18n.t('after') + ' ' + seconds + (seconds === 1 ? ' ' + i18n.t('second') : ' ' + i18n.t('seconds'));
    }
  }

  const selected = autolock === props.item;

  const changeAutolock = () => {
    SettingStore.actions.setAutolock(props.item);
  }

  return <ListItem
    content={(
      <View>
        <Text>{convertMils(props.item)}</Text>
      </View>
    )}
    selected={selected}
    onPress={changeAutolock}
  />
}
