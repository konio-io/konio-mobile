import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useI18n, useTheme } from "../hooks";
import Unavailable from "../screens/Unavailable";
import { SheetManager } from "react-native-actions-sheet";
import { AntDesign, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import Deposit from "../screens/Deposit";
import Browser from "../screens/Browser";
import Holdings from "./Holdings";
import Withdraw from "../screens/Withdraw";
import { rgba } from "../lib/utils";
import Discovery from "../screens/Discovery";

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
          tabBarShowLabel: false,
          tabBarItemStyle: {
            
          },
          tabBarStyle: {
            backgroundColor: Color.base,
            borderTopColor: Border.color,
            borderTopWidth: 0,
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
              <AntDesign name="wallet" size={25} color={color} />
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
              <AntDesign name="swap" size={30} color={color} />
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
          name="Browser"
          component={Browser}
          options={{
            title: i18n.t('browser'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass-outline" size={30} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Discovery"
          component={Discovery}
          options={{
            title: i18n.t('discovery'),
            headerTitleAlign: 'center',
            tabBarIcon: ({ color, size }) => (
              <SimpleLineIcons name="feed" size={22} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  );
}