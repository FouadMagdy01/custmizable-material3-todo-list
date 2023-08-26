import {Button, StatusBar, View, useColorScheme} from 'react-native';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';

import {
  PaperProvider,
  MD3DarkTheme,
  BottomNavigation,
  Text,
  MD3LightTheme,
  adaptNavigationTheme,
  configureFonts,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import T from './src/navigation/BottomTabs';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import React, {useMemo} from 'react';
import StackNavigator from './src/navigation/StackNavigator';

let isDarkMode = false;
export default function () {
  const {theme, updateTheme} = useMaterial3Theme();
  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  const paperTheme = useMemo(() => {
    return {...MD3LightTheme, colors: theme.light};
  }, [theme]);

  React.useEffect(() => {
    console.log('theme changed ');
  }, [theme]);
  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  const configuredFontTheme = {
    ...combinedTheme,
    fonts: configureFonts({
      config: {
        fontFamily: 'NotoSans',
      },
    }),
  };

  return (
    <PaperProvider
      settings={{
        rippleEffectEnabled: false,
      }}
      theme={configuredFontTheme}>
      <NavigationContainer theme={combinedTheme}>
        <StatusBar translucent={true} backgroundColor="transparent" />
        <StackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
