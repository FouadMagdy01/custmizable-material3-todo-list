import {Material3Theme} from '@pchmn/expo-material3-theme';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {getLocalPreferences, toggleTheme, updateTheme} from './reducers';
import {Appearance} from 'react-native';
import {initialTheme} from '../../constants/themes';
import {TodoPriority, TodoSortBy, SortOrder} from '../../types/appTypes';

const colorScheme = Appearance.getColorScheme();
const isDark = colorScheme === 'dark';
type Theme = Material3Theme;

interface PreferencesState {
  theme: Theme;
  dark: boolean;
  loading: boolean;
  defaultPriority: TodoPriority;
  defaultSortBy: TodoSortBy;
  defaultSortOrder: SortOrder;
  autoDeleteCompleted: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

const initialState: PreferencesState = {
  theme: initialTheme,
  dark: isDark,
  loading: true,
  defaultPriority: 'medium',
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
  autoDeleteCompleted: false,
  pushNotifications: true,
  emailNotifications: false,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setDefaultPriority: (state, action: PayloadAction<TodoPriority>) => {
      state.defaultPriority = action.payload;
    },
    setDefaultSorting: (state, action: PayloadAction<{sortBy: TodoSortBy; sortOrder: SortOrder}>) => {
      state.defaultSortBy = action.payload.sortBy;
      state.defaultSortOrder = action.payload.sortOrder;
    },
    setAutoDeleteCompleted: (state, action: PayloadAction<boolean>) => {
      state.autoDeleteCompleted = action.payload;
    },
    setPushNotifications: (state, action: PayloadAction<boolean>) => {
      state.pushNotifications = action.payload;
    },
    setEmailNotifications: (state, action: PayloadAction<boolean>) => {
      state.emailNotifications = action.payload;
    },
  },
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
      state.defaultPriority = payload.defaultPriority || 'medium';
      state.defaultSortBy = payload.defaultSortBy || 'createdAt';
      state.defaultSortOrder = payload.defaultSortOrder || 'desc';
      state.autoDeleteCompleted = payload.autoDeleteCompleted || false;
      state.pushNotifications = payload.pushNotifications !== undefined ? payload.pushNotifications : true;
      state.emailNotifications = payload.emailNotifications || false;
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

export const {
  setDefaultPriority,
  setDefaultSorting,
  setAutoDeleteCompleted,
  setPushNotifications,
  setEmailNotifications,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
