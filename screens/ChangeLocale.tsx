import { FlatList, View } from 'react-native';
import { ListItemSelected, Text, Screen } from '../components';
import { OS_LOCALE } from '../lib/Constants';
import { LocaleIndex } from '../lib/Locales';
import { useHookstate } from '@hookstate/core';
import { SettingStore } from '../stores';

export default () => {
  const data: Array<{ code: string, label: string }> = [
    { code: OS_LOCALE, label: 'auto' },
  ];

  for (const code in LocaleIndex) {
    data.push({ code, label: LocaleIndex[code] });
  }

  return (
    <Screen>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem code={item.code} label={item.label} />}
      />
    </Screen>
  );
}

export const ListItem = (props: {
  code: string,
  label: string
}) => {

  const locale = useHookstate(SettingStore.state.locale).get();
  const selected = (locale === props.code);

  return <ListItemSelected
    ItemComponent={(
      <View>
        <Text>{props.label}</Text>
      </View>
    )}
    selected={selected}
    onPress={() => SettingStore.actions.setLocale(props.code)}
  />
}
