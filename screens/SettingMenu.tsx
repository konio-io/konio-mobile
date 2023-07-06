import { useNavigation } from '@react-navigation/native';
import { SettingMenuNavigationProp } from '../types/navigation';
import { useI18n } from '../hooks';
import { Screen } from '../components';
import ListItem from '../components/ListItem';

export default () => {
  const navigation = useNavigation<SettingMenuNavigationProp>();
  const i18n = useI18n();

  return (
    <Screen>

      <ListItem
        title={i18n.t('network')}
        name={i18n.t('network')}
        description={i18n.t('choose_network')}
        onPress={() => navigation.navigate('ChangeNetwork')}
      />

      <ListItem
        title={i18n.t('theme')}
        name={i18n.t('theme')}
        description={i18n.t('change_theme_desc')}
        onPress={() => navigation.navigate('ChangeTheme')}
      />

      <ListItem
        title={i18n.t('locale')}
        name={i18n.t('locale')}
        description={i18n.t('change_locale_desc')}
        onPress={() => navigation.navigate('ChangeLocale')}
      />

      <ListItem
        title={i18n.t('security')}
        name={i18n.t('security')}
        description={i18n.t('security_desc')}
        onPress={() => navigation.navigate('Security')}
      />

      <ListItem
        title={i18n.t('advanced')}
        name={i18n.t('advanced')}
        description={i18n.t('advanced_desc')}
        onPress={() => navigation.navigate('Advanced')}
      />

    </Screen>
  );
}
