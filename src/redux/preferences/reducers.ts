import {createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {UserPreferences} from '../../types/appTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_PREFERENCES} from '../../constants/localStorageKeys';
import {Appearance} from 'react-native';
import {Material3Theme} from '@pchmn/expo-material3-theme';
const localPreferencesErrorMessage =
  'An error ocurred while trying to fetch user preferences';

interface UpdateThemeParams {
  theme: Material3Theme;
  dark: boolean;
}

interface GetLocalPreferences {
  fallbackTheme: Material3Theme;
}

interface LocalPreferencesError {
  message: string;
  fallbackTheme: Material3Theme;
  dark: boolean;
}
export const updateTheme = createAsyncThunk<
  UserPreferences,
  UpdateThemeParams,
  {state: RootState; rejectValue: LocalPreferencesError}
>('preferences/updateTheme', async (args, ThunkAPI) => {
  let updatedPreferencesData: UserPreferences;
  const state = ThunkAPI.getState();
  const isDark = state.performance.dark;
  try {
    const userPreferences = await AsyncStorage.getItem(USER_PREFERENCES);
    if (userPreferences != null) {
      const parsedPreferencesData = JSON.parse(
        userPreferences,
      ) as UserPreferences;
      updatedPreferencesData = {
        ...parsedPreferencesData,
        theme: args.theme,
      };
    } else {
      updatedPreferencesData = {
        theme: args.theme,
        dark: isDark,
      };
    }
    const JSON_data = JSON.stringify(updatedPreferencesData);
    await AsyncStorage.setItem(USER_PREFERENCES, JSON_data);
    return updatedPreferencesData as UserPreferences;
  } catch (err: any) {
    const errorValue: LocalPreferencesError = {
      fallbackTheme: args.theme,
      dark: isDark,
      message: localPreferencesErrorMessage,
    };
    return ThunkAPI.rejectWithValue(errorValue);
  }
});

export const getLocalPreferences = createAsyncThunk<
  UserPreferences,
  GetLocalPreferences,
  {
    state: RootState;
    rejectValue: LocalPreferencesError;
  }
>('preferences/getLocalTheme', async (args, ThunkAPI) => {
  let userPreferences: UserPreferences;
  const deviceColorScheme = Appearance.getColorScheme();
  let isDark = deviceColorScheme === 'dark' ? true : false;

  try {
    const localPreferences = await AsyncStorage.getItem(USER_PREFERENCES);

    if (localPreferences != null) {
      const parsedPreferencesData = JSON.parse(
        localPreferences,
      ) as UserPreferences;
      userPreferences = parsedPreferencesData;
    } else {
      userPreferences = {
        dark: isDark,
        theme: args.fallbackTheme,
      };
      await AsyncStorage.setItem(
        USER_PREFERENCES,
        JSON.stringify(userPreferences),
      );
    }
    return userPreferences;
  } catch (err: any) {
    const errorValue: LocalPreferencesError = {
      fallbackTheme: args.fallbackTheme,
      dark: isDark,
      message: localPreferencesErrorMessage,
    };
    return ThunkAPI.rejectWithValue(errorValue);
  }
});

export const toggleTheme = createAsyncThunk<
  undefined,
  undefined,
  {state: RootState}
>('preferences/toggleTheme', async (args, ThunkAPI) => {
  try {
    const localPreferences = await AsyncStorage.getItem(USER_PREFERENCES);
    if (localPreferences != null) {
      const parsedPreferencesData = JSON.parse(
        localPreferences,
      ) as UserPreferences;
      const updatedPreferences: UserPreferences = {
        ...parsedPreferencesData,
        dark: !parsedPreferencesData.dark,
      };
      await AsyncStorage.setItem(
        USER_PREFERENCES,
        JSON.stringify(updatedPreferences),
      );
    }
  } catch (error) {
    return ThunkAPI.rejectWithValue(localPreferencesErrorMessage);
  }
});
