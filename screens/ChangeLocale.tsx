import { FlatList, View } from 'react-native';
import { useTheme, useI18n } from '../hooks';
import { UserStore } from '../stores';
import { setLocale, showToast } from '../actions';
import { ListItemSelected, Text, Wrapper } from '../components';
import { useHookstate } from '@hookstate/core';
import { OS_LOCALE } from '../lib/Constants';
import locales from '../locales';

export default () => {
  const data = [OS_LOCALE, ... Object.keys(locales)];
  const theme = useTheme();
  const styles = theme.styles;

  return (
    <Wrapper type="full">

      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem name={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

    </Wrapper>
  );
}

export const ListItem = (props: {
  name: string
}) => {

  const i18n = useI18n();
  const locale = useHookstate(UserStore.locale).get();

  const ItemComponent = () => (
    <View>
      <Text>{props.name}</Text>
    </View>
  );

  const selected = (locale === props.name);

  const changeLocale = () => {
    setLocale(props.name);
    showToast({
      type: 'info',
      text1: i18n.t('locale_changed', {name: props.name})
    });
  }

  return <ListItemSelected ItemComponent={ItemComponent} selected={selected} onPress={changeLocale}/>
}
