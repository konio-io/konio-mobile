import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SettingNavigationProp } from '../types/navigation';
import { useTheme, useI18n } from '../hooks';
import { Wrapper } from '../components';
import ListItem from '../components/ListItem';

export default () => {
  const navigation = useNavigation<SettingNavigationProp>();
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;

  return (
    <Wrapper type='full'>

      <ListItem
        title={i18n.t('network')}
        name={i18n.t('network')}
        description={i18n.t('choose_network')}
        onPress={() => navigation.push('ChangeNetwork')}
      />

      <View style={styles.separator}/>

      <ListItem
        title={i18n.t('theme')}
        name={i18n.t('theme')}
        description={i18n.t('change_theme_desc')}
        onPress={() => navigation.push('ChangeTheme')}
      />

      <View style={styles.separator}/>

      <ListItem
        title={i18n.t('locale')}
        name={i18n.t('locale')}
        description={i18n.t('change_locale_desc')}
        onPress={() => navigation.push('ChangeLocale')}
      />

      <View style={styles.separator}/>

      <ListItem
        title={i18n.t('security')}
        name={i18n.t('security')}
        description={i18n.t('security_desc')}
        onPress={() => navigation.push('Security')}
      />

      <View style={styles.separator}/>

      <ListItem
        title={i18n.t('about')}
        name={i18n.t('about')}
        description={i18n.t('show_app_info')}
        onPress={() => navigation.push('About')}
      />

    </Wrapper>
  );
}
