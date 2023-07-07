import { FlatList, View } from 'react-native';
import { useI18n } from '../hooks';
import { UserStore } from '../stores';
import { setTheme } from '../actions';
import { ListItemSelected, Separator, Text, Screen } from '../components';
import { Themes } from '../themes';
import { useHookstate } from '@hookstate/core';
import { OS_THEME } from '../lib/Constants';

export default () => {
  const data = [OS_THEME, ...Object.keys(Themes)];

  return (
    <Screen>

      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem name={item} />}
      />

    </Screen>
  );
}

export const ListItem = (props: {
  name: string
}) => {

  const i18n = useI18n();
  const theme = useHookstate(UserStore.theme).get();
  const selected = (theme === props.name);

  const changeTheme = () => {
    setTheme(props.name);
  }

  return <ListItemSelected
    ItemComponent={(
      <View>
        <Text>{i18n.t(props.name)}</Text>
      </View>
    )}
    selected={selected}
    onPress={changeTheme}
  />
}
