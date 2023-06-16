import { View, FlatList, TouchableHighlight, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { SettingNavigationProp } from '../types/navigation';
import type { Theme } from '../types/store';
import type { FlatMenuItem } from '../types/ui';
import { reset } from '../stores';
import { useTheme } from '../hooks';
import { Text } from '../components';
import { Feather } from '@expo/vector-icons';

export default () => {
  const navigation = useNavigation<SettingNavigationProp>();

  const items: Array<FlatMenuItem> = [
    {
      title: 'Network',
      name: 'Network',
      description: 'Choose the network provider',
      onPress: (name: string) => { navigation.push('Network') }
    },
    {
      title: 'Add wallet account',
      name: 'NewWalletAccount',
      description: 'Add a new wallet account based on seed wallet',
      onPress: (name: string) => { navigation.push('NewWalletAccount') }
    },
    /*{
      title: 'Reset settings',
      name: 'Reset',
      description: 'Reset all application persistent data',
      onPress: (name: string) => {
        if (Platform.OS === 'web') {
          reset();
        } else {
          resetAlert();
        }
      }
    },*/
    {
      title: 'About',
      name: 'About',
      description: 'Show app info',
      onPress: (name: string) => { navigation.push('About') }
    },
  ];

  const theme = useTheme().get();
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={items}
        renderItem={({ item }) =>
          <MenuItem
            title={item.title}
            name={item.name}
            description={item.description}
            onPress={item.onPress}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const resetAlert = () =>
  Alert.alert('Wipe data', 'Are you sure you want to wipe all data?', [
    {
      text: 'No',
      style: 'cancel',
      onPress: () => { },
    },
    {
      text: 'Yes',
      onPress: () => { reset() }
    }
  ]);

const MenuItem = (props: {
  title: string,
  name: string,
  description: string,
  onPress: Function
}) => {

  const theme = useTheme().get();
  const { Color } = theme.vars;
  const styles = createStyles(theme);

  return (
    
    <TouchableHighlight onPress={() => props.onPress(props.name)}>
      <View style={styles.listItemContainer}>

        <View>
          <Text style={styles.menuItemTitle}>{props.title}</Text>
          <Text style={styles.textSmall}>{props.description}</Text>
        </View>

        <Feather name="arrow-right" size={24} color={Color.primary} />
        
      </View>
    </TouchableHighlight>
  )
};


const createStyles = (theme: Theme) => {
  const { Color, FontFamily, FontSize } = theme.vars;

  return StyleSheet.create({
    ...theme.styles,
    wrapper: {
      flex: 1,
      backgroundColor: Color.base
    },
    menuItemTitle: {
      color: Color.baseContrast,
      fontFamily: FontFamily.sans,
      fontSize: FontSize.medium
    }
  })
}