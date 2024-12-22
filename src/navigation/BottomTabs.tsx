import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Text, BottomNavigation, Menu, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CommonActions} from '@react-navigation/native';
import {getHeaderTitle} from '@react-navigation/elements';
import {Appbar} from 'react-native-paper';
import Home from '../screens/Home/Home';
import Settings from '../screens/Settings';
import {TabsParamList} from './types';

const Tab = createBottomTabNavigator<TabsParamList>();

export default function BottomTabNavigator() {
  const [visible, setVisible] = useState(false);
  return (
    <Tab.Navigator
      screenOptions={({navigation}) => {
        return {
          headerShown: false,
          header: ({route, options}) => {
            const title = getHeaderTitle(options, route.name);
            return (
              <Appbar.Header elevated>
                <Appbar.Content title={title} />
                <Appbar.Action icon="magnify" onPress={() => {}} />
                <Appbar.Action icon="calendar" onPress={() => {}} />
              </Appbar.Header>
            );
          },
        };
      }}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }
            return null;
          }}
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;
            return label.toString();
          }}
        />
      )}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({color, size}) => {
            return <Icon name="menu" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
