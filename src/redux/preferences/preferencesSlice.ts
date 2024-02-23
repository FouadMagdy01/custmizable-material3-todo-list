import {Material3Theme} from '@pchmn/expo-material3-theme';
import {createSlice} from '@reduxjs/toolkit';

import {getLocalPreferences, toggleTheme, updateTheme} from './reducers';
import {Appearance} from 'react-native';
import {initialTheme} from '../../constants/themes';

const colorScheme = Appearance.getColorScheme();
const isDark = colorScheme === 'dark';
type Theme = Material3Theme;

interface PreferencesState {
  theme: Theme;
  dark: boolean;
  loading: boolean;
}

const initialState: PreferencesState = {
  theme: initialTheme,
  dark: isDark,
  loading: true,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(updateTheme.fulfilled, (state, {payload}) => {
      state.theme = payload.theme;
    });
    builder.addCase(updateTheme.rejected, (state, {payload}) => {
      if (payload) {
        state.theme = payload.fallbackTheme;
      }
    });
    builder.addCase(getLocalPreferences.fulfilled, (state, {payload}) => {
      state.loading = false;
      state.dark = payload.dark;
      state.theme = payload.theme;
    });
    builder.addCase(getLocalPreferences.pending, (state, {payload}) => {
      state.loading = true;
    });
    builder.addCase(getLocalPreferences.rejected, (state, {payload}) => {
      state.loading = false;
      if (payload) {
        state.dark = payload.dark;
        state.theme = payload.fallbackTheme;
      }
    });
    builder.addCase(toggleTheme.fulfilled, (state, action) => {
      state.dark = !state.dark;
    });
  },
});

export default preferencesSlice.reducer;
