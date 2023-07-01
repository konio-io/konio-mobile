import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useI18n, useLocker, useTheme } from "../hooks";
import Unavailable from "../screens/Unavailable";
import AccountStack from "./AccountStack";
import OperationsStack from "./OperationsStack";
import SettingStack from "./SettingStack";
import { SheetManager } from "react-native-actions-sheet";
import { AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
export default () => {
  const theme = useTheme();
  const { Color, FontFamily, Border } = theme.vars;
  const styles = theme.styles;
  const insets = useSafeAreaInsets();
  const i18n = useI18n();

  useLocker({ key: 'app', initialValue: true });

  return (
    <View
      style={{
        ...styles.wrapperFull,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
      }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Color.primary,
          tabBarInactiveTintColor: Color.baseContrast,
          tabBarLabelStyle: { fontFamily: FontFamily.sans },
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: Color.base,
            borderTopColor: Border.color,
            borderTopWidth: Border.width
          },
          headerStyle: {
            backgroundColor: Color.base,
            borderBottomColor: Border.color,
            borderBottomWidth: Border.width
          },
          headerTitleStyle: {
            fontFamily: FontFamily.sans,
            color: Color.baseContrast
          },
          headerTintColor: Color.primary,
          unmountOnBlur: true
        }}
      >
        <Tab.Screen
          name="AccountStack"
          component={AccountStack}
          options={{
            title: i18n.t('account'),
            header: () => (<View />),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="wallet" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="OperationsStack"
          component={OperationsStack}
          options={{
            title: i18n.t('operations'),
            header: () => (<View />),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="swap" size={size} color={color} />
            ),
            tabBarButton: (props) => {
              props.onPress = () => SheetManager.show('operations');
              return <TouchableOpacity {...props} />
            }
          }}
        />
        <Tab.Screen
          name="Dapps"
          component={Unavailable}
          options={{
            title: i18n.t('dapps'),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="appstore-o" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="SettingStack"
          component={SettingStack}
          options={{
            title: i18n.t('Settings'),
            header: () => (<View />),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  );
}