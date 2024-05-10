import {StatusBar, useColorScheme} from 'react-native';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {useAppDispatch, useAppSelector} from './src/hooks/reduxHooks';
import {getLocalPreferences} from './src/redux/preferences/reducers';

function App() {
  const preferences = useAppSelector(state => state.preferences);
  const dispatch = useAppDispatch();
  const isDark = useColorScheme() === 'dark';
  const {theme} = useMaterial3Theme({
    fallbackSourceColor: '#63876c',
  });

  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialLight: {
      ...MD3LightTheme,
      colors: preferences.theme.light,
    },
    materialDark: {
      ...MD3DarkTheme,
      colors: preferences.theme.dark,
    },
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
      <PaperProvider theme={combinedTheme}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle={preferences.dark ? 'light-content' : 'dark-content'}
        />
        <RootNavigator />
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
