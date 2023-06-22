import { FlatList, View } from 'react-native';
import { useTheme, useI18n } from '../hooks';
import { UserStore } from '../stores';
import { setTheme, showToast } from '../actions';
import { ListItemSelected, Text, Wrapper } from '../components';
import { Themes } from '../themes';
import { useHookstate } from '@hookstate/core';
import { OS_THEME } from '../lib/Constants';

export default () => {
  const data = [OS_THEME, ... Object.keys(Themes)];
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
