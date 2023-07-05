import { FlatList, View } from 'react-native';
import { useI18n } from '../hooks';
import { UserStore } from '../stores';
import { setLocale, showToast } from '../actions';
import { ListItemSelected, Separator, Text, Screen } from '../components';
import { useHookstate } from '@hookstate/core';
import { OS_LOCALE } from '../lib/Constants';
import {LocaleIndex} from '../lib/Locales';

export default () => {
  const data: Array<{code: string, label: string}> = [
    {code: OS_LOCALE, label: 'auto'},
  ];

  for (const code in LocaleIndex) {
    data.push({code, label: LocaleIndex[code]});
  }

  return (
    <Screen>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem code={item.code} label={item.label}/>}
        ItemSeparatorComponent={() => <Separator/>}
      />
    </Screen>
  );
}

export const ListItem = (props: {
    code: string,
    label: string
}) => {

  const i18n = useI18n();
  const locale = useHookstate(UserStore.locale).get();

  const ItemComponent = () => (
    <View>
      <Text>{props.label}</Text>
    </View>
  );

  const selected = (locale === props.code);

  const changeLocale = () => {
    setLocale(props.code);
  }

  return <ListItemSelected ItemComponent={ItemComponent} selected={selected} onPress={changeLocale}/>
}
