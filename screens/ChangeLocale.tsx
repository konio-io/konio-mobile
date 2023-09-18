import { FlatList, View } from 'react-native';
import { setLocale } from '../actions';
import { ListItemSelected, Text, Screen } from '../components';
import { OS_LOCALE } from '../lib/Constants';
import { LocaleIndex } from '../lib/Locales';
import { useLocale } from '../hooks';

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

  const locale = useLocale();
  const selected = (locale === props.code);

  const changeLocale = () => {
    setLocale(props.code);
  }

  return <ListItemSelected
    ItemComponent={(
      <View>
        <Text>{props.label}</Text>
      </View>
    )}
    selected={selected}
    onPress={changeLocale}
  />
}
