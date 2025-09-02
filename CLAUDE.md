# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HueDo is a customizable Material Design 3 todo list app built with React Native and Firebase. The app supports both mobile (React Native) and web (React/Vite) platforms, featuring real-time synchronization, offline support, and customizable theming.

## Development Commands

### Mobile App (React Native)
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (iPhone 15 Pro Max by default)
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

### Website (React/Vite)
- `cd website && npm run dev` - Start development server
- `cd website && npm run build` - Build for production (TypeScript + Vite)
- `cd website && npm run lint` - Run ESLint
- `cd website && npm run preview` - Preview production build

### Android Build Requirements
- Build Tools: 34.0.0
- Compile SDK: 35
- Target SDK: 35
- Min SDK: 23
- NDK: 25.1.8937393
- Kotlin: 1.8.0

## Architecture

### State Management
- **Redux Toolkit** for global state management
- Store located at `src/redux/store.ts` with three main slices:
  - `preferences` - Theme customization and app preferences
  - `todos` - Task management with Firebase integration
  - `auth` - Authentication state management

### Navigation Structure
- **Root Navigator** (`src/navigation/RootNavigator.tsx`): Conditional rendering based on auth state
- **Auth Navigator** (`src/navigation/AuthNavigator.tsx`): Login, register, forgot password flows
- **Bottom Tabs** (`src/navigation/BottomTabs.tsx`): Main app navigation (Home, Settings)
- **Task Screen**: Modal-style screen for creating/editing todos

### Firebase Integration
- **Authentication**: Email/password, Google, Anonymous sign-in
- **Firestore**: Real-time todo synchronization with user isolation
- **Security Rules**: Users can only access their own data (`/users/{userId}`)
- Service layer at `src/services/firebaseService.ts`

### Theming System
- **Material 3 Dynamic Color**: Using `@pchmn/expo-material3-theme`
- **Customizable Themes**: Users can select custom colors for light/dark modes
- **Theme Persistence**: Preferences stored locally and synced to Redux
- **Adaptive Navigation**: Theme colors adapt both Paper and Navigation components

### Data Structure
```
Firestore:
/users/{userId}
  /profile/data - User profile information  
  /todos/{todoId} - Individual todo documents
    - id, title, description, isCompleted, priority
    - createdAt, updatedAt, userId, dueDate, tags, category
```

### Key Dependencies
- **React Native Paper**: Material 3 UI components
- **React Navigation**: Stack and Tab navigation
- **Firebase**: Auth, Firestore for real-time data
- **Redux Toolkit**: State management
- **Formik + Yup**: Form handling and validation
- **Reanimated Color Picker**: Custom color selection

### Screen Organization
- `src/screens/Home/`: Main todo list with filtering and search
- `src/screens/Edit+CreateTask/`: Todo creation/editing with form validation
- `src/screens/Auth/`: Authentication flows (Login, Register, etc.)
- `src/screens/Settings/`: App preferences and theme customization

### Testing
- Jest configuration at `jest.config.js`
- Run tests with `npm test`

### Platform-Specific Notes
- iOS uses iPhone 15 Pro Max simulator by default
- Android requires Google Services configuration (`google-services.json`)
- Firebase setup instructions available in `FIREBASE_SETUP.md`