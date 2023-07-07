import { useNavigation } from '@react-navigation/native';
import { SettingMenuNavigationProp } from '../types/navigation';
import { useI18n } from '../hooks';
import { Screen } from '../components';
import ListItem from '../components/ListItem';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';

export default () => {
  const navigation = useNavigation<SettingMenuNavigationProp>();
  const i18n = useI18n();

  return (
    <Screen>

      <ListItem
        content={i18n.t('network')}
        name={i18n.t('network')}
        description={i18n.t('choose_network')}
        onPress={() => navigation.navigate('ChangeNetwork')}
        icon={(<AntDesign name="API" />)}
      />

      <ListItem
        content={i18n.t('theme')}
        name={i18n.t('theme')}
        description={i18n.t('change_theme_desc')}
        onPress={() => navigation.navigate('ChangeTheme')}
        icon={(<Ionicons name="color-palette-outline"/>)}
      />

      <ListItem
        content={i18n.t('locale')}
        name={i18n.t('locale')}
        description={i18n.t('change_locale_desc')}
        onPress={() => navigation.navigate('ChangeLocale')}
        icon={(<Ionicons name="ios-language-outline"/>)}
      />

      <ListItem
        content={i18n.t('security')}
        name={i18n.t('security')}
        description={i18n.t('security_desc')}
        onPress={() => navigation.navigate('Security')}
        icon={(<Feather name="shield" />)}
      />

      <ListItem
        content={i18n.t('advanced')}
        name={i18n.t('advanced')}
        description={i18n.t('advanced_desc')}
        onPress={() => navigation.navigate('Advanced')}
        icon={(<AntDesign name="warning" />)}
      />

    </Screen>
  );
}
