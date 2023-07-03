import { useNavigation } from '@react-navigation/native';
import { SettingNavigationProp } from '../types/navigation';
import { useI18n } from '../hooks';
import { Separator, Screen } from '../components';
import ListItem from '../components/ListItem';

export default () => {
  const navigation = useNavigation<SettingNavigationProp>();
  const i18n = useI18n();

  return (
    <Screen>

      <ListItem
        title={i18n.t('network')}
        name={i18n.t('network')}
        description={i18n.t('choose_network')}
        onPress={() => navigation.navigate('ChangeNetwork')}
      />

      <Separator/>

      <ListItem
        title={i18n.t('theme')}
        name={i18n.t('theme')}
        description={i18n.t('change_theme_desc')}
        onPress={() => navigation.navigate('ChangeTheme')}
      />

      <Separator/>

      <ListItem
        title={i18n.t('locale')}
        name={i18n.t('locale')}
        description={i18n.t('change_locale_desc')}
        onPress={() => navigation.navigate('ChangeLocale')}
      />

      <Separator/>

      <ListItem
        title={i18n.t('security')}
        name={i18n.t('security')}
        description={i18n.t('security_desc')}
        onPress={() => navigation.navigate('Security')}
      />

      <Separator/>

      <ListItem
        title={i18n.t('advanced')}
        name={i18n.t('advanced')}
        description={i18n.t('advanced_desc')}
        onPress={() => navigation.navigate('Advanced')}
      />

      <Separator/>

      <ListItem
        title={i18n.t('about')}
        name={i18n.t('about')}
        description={i18n.t('show_app_info')}
        onPress={() => navigation.navigate('About')}
      />

    </Screen>
  );
}
