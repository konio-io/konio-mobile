import { FlatList, View } from 'react-native';
import { useI18n } from '../hooks';
import { ListItem, Text, Screen } from '../components';
import { Themes } from '../themes';
import { OS_THEME } from '../lib/Constants';
import { SettingStore } from '../stores';
import { useHookstate } from '@hookstate/core';

export default () => {
  const data = [OS_THEME, ...Object.keys(Themes)];

  return (
    <Screen>

      <FlatList
        data={data}
        renderItem={({ item }) => <ThemeListItem name={item} />}
      />

    </Screen>
  );
}

export const ThemeListItem = (props: {
  name: string
}) => {

  const i18n = useI18n();
  const theme = useHookstate(SettingStore.state.theme).get();
  const selected = (theme === props.name);

  const changeTheme = () => {
    SettingStore.actions.setTheme(props.name);
  }

  return <ListItem
    content={(
      <View>
        <Text>{i18n.t(props.name)}</Text>
      </View>
    )}
    selected={selected}
    onPress={changeTheme}
  />
}
