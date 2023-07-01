import { FlatList, View } from 'react-native';
import { useI18n } from '../hooks';
import { UserStore } from '../stores';
import { setTheme, showToast } from '../actions';
import { ListItemSelected, Separator, Text, Screen } from '../components';
import { Themes } from '../themes';
import { useHookstate } from '@hookstate/core';
import { OS_THEME } from '../lib/Constants';

export default () => {
  const data = [OS_THEME, ... Object.keys(Themes)];

  return (
    <Screen>

      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem name={item} />}
        ItemSeparatorComponent={() => <Separator/>}
      />

    </Screen>
  );
}

export const ListItem = (props: {
  name: string
}) => {

  const i18n = useI18n();
  const theme = useHookstate(UserStore.theme).get();

  const ItemComponent = () => (
    <View>
      <Text>{i18n.t(props.name)}</Text>
    </View>
  );

  const selected = (theme === props.name);

  const changeTheme = () => {
    setTheme(props.name);
    showToast({
      type: 'info',
      text1: i18n.t('theme_changed', {name: props.name})
    });
  }

  return <ListItemSelected ItemComponent={ItemComponent} selected={selected} onPress={changeTheme}/>
}
