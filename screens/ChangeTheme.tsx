import { FlatList, View } from 'react-native';
import { useI18n, useTheme } from '../hooks';
import { ListItemSelected, Text, Screen } from '../components';
import { Themes } from '../themes';
import { OS_THEME } from '../lib/Constants';
import { useStore } from '../stores';

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
  const theme = useTheme();
  const selected = (theme.name === props.name);
  const { Setting } = useStore();

  const changeTheme = () => {
    Setting.actions.setTheme(props.name);
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
