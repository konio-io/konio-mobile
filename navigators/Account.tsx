import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useI18n, useTheme } from "../hooks";
import Unavailable from "../screens/Unavailable";
import Assets from "./Assets";
import { SheetManager } from "react-native-actions-sheet";
import { AntDesign } from '@expo/vector-icons';
import Withdraw from "./Withdraw";
import Deposit from "../screens/Deposit";
import Dapps from "../screens/Dapps";

const Tab = createBottomTabNavigator();
export default () => {
  const theme = useTheme();
  const { Color, FontFamily, Border } = theme.vars;
  const styles = theme.styles;
  const i18n = useI18n();

  return (
    <View
      style={{
        ...styles.wrapperFull,
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
          headerTintColor: Color.primary
        }}
      >
        <Tab.Screen
          name="Assets"
          component={Assets}
          options={{
            title: i18n.t('assets'),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="wallet" size={size} color={color} />
            ),
            unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="Operations"
          component={Unavailable}
          options={{
            headerShown: false,
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
          name="Withdraw"
          component={Withdraw}
          options={{
            title: i18n.t('send'),
            headerShown: false,
            tabBarButton: () => null
          }}
        />
        <Tab.Screen
          name="Deposit"
          component={Deposit}
          options={{
            title: i18n.t('deposit'),
            tabBarButton: () => null
          }}
        />
        <Tab.Screen
          name="Dapps"
          component={Dapps}
          options={{
            title: i18n.t('dapps'),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="appstore-o" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  );
}