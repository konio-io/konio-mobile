import { useNavigation } from '@react-navigation/native';
import { SettingMenuNavigationProp } from '../types/navigation';
import { useI18n, useTheme } from '../hooks';
import { Screen, Text } from '../components';
import ListItem from '../components/ListItem';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default () => {
  const navigation = useNavigation<SettingMenuNavigationProp>();
  const i18n = useI18n();
  const { styles } = useTheme();

  return (
    <Screen>

      <ListItem
        content={(
          <View>
            <Text>{i18n.t('network')}</Text>
            <Text style={styles.textSmall}>{i18n.t('choose_network')}</Text>
          </View>
        )}
        onPress={() => navigation.navigate('ChangeNetwork')}
        icon={(<AntDesign name="API" />)}
      />

      <ListItem
        content={(
          <View>
            <Text>{i18n.t('theme')}</Text>
            <Text style={styles.textSmall}>{i18n.t('change_theme_desc')}</Text>
          </View>
        )}
        onPress={() => navigation.navigate('ChangeTheme')}
        icon={(<Ionicons name="color-palette-outline" />)}
      />

      <ListItem
        content={(
          <View>
            <Text>{i18n.t('locale')}</Text>
            <Text style={styles.textSmall}>{i18n.t('change_locale_desc')}</Text>
          </View>
        )}
        onPress={() => navigation.navigate('ChangeLocale')}
        icon={(<Ionicons name="ios-language-outline" />)}
      />

      <ListItem
        content={(
          <View>
            <Text>{i18n.t('security')}</Text>
            <Text style={styles.textSmall}>{i18n.t('security_desc')}</Text>
          </View>
        )}
        onPress={() => navigation.navigate('Security')}
        icon={(<Feather name="shield" />)}
      />

      <ListItem
        content={(
          <View>
            <Text>{i18n.t('advanced')}</Text>
            <Text style={styles.textSmall}>{i18n.t('advanced_desc')}</Text>
          </View>
        )}
        onPress={() => navigation.navigate('Advanced')}
        icon={(<AntDesign name="warning" />)}
      />

      <ListItem
        content={(
          <View>
            <Text>{i18n.t('logs')}</Text>
            <Text style={styles.textSmall}>{i18n.t('logs_desc')}</Text>
          </View>
        )}
        onPress={() => navigation.navigate('Logs')}
        icon={(<AntDesign name="exception1" />)}
      />

    </Screen>
  );
}
