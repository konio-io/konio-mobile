import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useI18n, useTheme } from "../hooks";
import Unavailable from "../screens/Unavailable";
import { SheetManager } from "react-native-actions-sheet";
import { AntDesign } from '@expo/vector-icons';
import Deposit from "../screens/Deposit";
import Dapps from "../screens/Dapps";
import Holdings from "./Holdings";
import Withdraw from "../screens/Withdraw";
import { rgba } from "../lib/utils";

const Tab = createBottomTabNavigator();
export default () => {
  const theme = useTheme();
  const { Color, FontFamily, Border, FontSize } = theme.vars;
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
          tabBarInactiveTintColor: rgba(Color.baseContrast, 0.5),
          tabBarLabelStyle: { fontFamily: FontFamily.sans, fontSize: FontSize.small },
          tabBarShowLabel: true,
          tabBarItemStyle: {
            
          },
          tabBarStyle: {
            backgroundColor: Color.base,
            borderTopColor: Border.color,
            borderTopWidth: 0,
            height: 60,
            shadowColor: 'transparent'
          },
          headerStyle: {
            backgroundColor: Color.base,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontFamily: FontFamily.sans,
            color: Color.baseContrast
          },
          headerTintColor: Color.primary,
          headerShadowVisible: false
        }}
      >
        <Tab.Screen
          name="Holdings"
          component={Holdings}
          options={{
            title: i18n.t('assets'),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="wallet" size={30} color={color} />
            ),
            unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="Operations"
          component={Unavailable}
          options={{
            title: i18n.t('operations'),
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