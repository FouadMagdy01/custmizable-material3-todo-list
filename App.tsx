import {Button, StatusBar, View, useColorScheme} from 'react-native';
import {
  createMaterial3Theme,
  useMaterial3Theme,
} from '@pchmn/expo-material3-theme';

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
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {useAppDispatch, useAppSelector} from './src/hooks/reduxHooks';
import {
  getLocalPreferences,
  toggleTheme,
} from './src/redux/preferences/reducers';

function App() {
  const preferences = useAppSelector(state => state.performance);
  const dispatch = useAppDispatch();
  console.log(useColorScheme());
  const isDark = useColorScheme() === 'dark';
  const {theme} = useMaterial3Theme({
    fallbackSourceColor: '#63876c',
  });
  console.log(createMaterial3Theme('#63876c'));
  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  // React.useEffect(() => {
  //   dispatch(toggleTheme());
  // }, [isDark]);

  React.useEffect(() => {
    dispatch(
      getLocalPreferences({
        fallbackTheme: theme,
      }),
    );
  }, []);

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...preferences.theme.light,
      ...LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...preferences.theme.dark,
      ...DarkTheme.colors,
    },
  };

  const combinedTheme = preferences.dark
    ? CombinedDarkTheme
    : CombinedDefaultTheme;

  if (preferences.loading) {
    return null;
  }

  return (
    <NavigationContainer theme={combinedTheme}>
      <PaperProvider
        settings={{
          rippleEffectEnabled: false,
        }}
        theme={combinedTheme}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle={isDark ? 'light-content' : 'dark-content'}
        />
        <StackNavigator />
      </PaperProvider>
    </NavigationContainer>
  );
}

export default function () {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
