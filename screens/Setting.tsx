import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { SettingNavigationProp } from '../types/navigation';
import type { FlatListItem } from '../types/ui';
import { useTheme } from '../hooks';
import i18n from '../locales';
import { Wrapper } from '../components';
import ListItem from '../components/ListItem';

export default () => {
  const navigation = useNavigation<SettingNavigationProp>();

  const items: Array<FlatListItem> = [
    {
      title: i18n.t('network'),
      name: i18n.t('network'),
      description: i18n.t('choose_network'),
      onPress: (name: string) => { navigation.push('Network') }
    },
    {
      title: i18n.t('add_account'),
      name: 'NewWalletAccount',
      description: i18n.t('add_account_desc'),
      onPress: (name: string) => { navigation.push('NewWalletAccount') }
    },
    {
      title: i18n.t('reset_password'),
      name: 'ResetPassword',
      description: i18n.t('reset_password_desc'),
      onPress: (name: string) => { navigation.push('ResetPassword') }
    },
    {
      title: i18n.t('show_seed'),
      name: 'ShowSeed',
      description: i18n.t('show_seed_desc'),
      onPress: (name: string) => { navigation.push('ShowSeed') }
    },
    {
      title: i18n.t('about'),
      name: i18n.t('about'),
      description: i18n.t('show_app_info'),
      onPress: (name: string) => { navigation.push('About') }
    },
  ];

  const theme = useTheme().get();
  const styles = theme.styles;

  return (
    <Wrapper type='full'>
      <FlatList
        data={items}
        renderItem={({ item }) =>
          <ListItem
            title={item.title}
            name={item.name}
            description={item.description}
            onPress={item.onPress}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Wrapper>
  );
}
