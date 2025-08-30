# Firebase Setup Instructions

This guide will help you set up Firebase for your HueDo Todo App.

## Prerequisites

- Firebase account
- Node.js installed
- Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `huedo-todo-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In the Firebase console, go to Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - Email/Password
   - Google (optional but recommended)
   - Anonymous (for guest users)

## Step 3: Set up Firestore Database

1. Go to Firestore Database in the Firebase console
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select your preferred location

## Step 4: Add Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the existing rules with the contents of `firestore.rules` file from this project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User profile document
      match /profile/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Todo documents under each user
      match /todos/{todoId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        // Validation for todo documents
        allow create: if request.auth != null 
          && request.auth.uid == userId
          && request.resource.data.keys().hasAll(['id', 'title', 'description', 'isCompleted', 'priority', 'createdAt', 'updatedAt', 'userId'])
          && request.resource.data.title is string
          && request.resource.data.title.size() >= 1 
          && request.resource.data.title.size() <= 255
          && request.resource.data.description is string
          && request.resource.data.description.size() <= 1000
          && request.resource.data.isCompleted is bool
          && request.resource.data.priority in ['low', 'medium', 'high']
          && request.resource.data.userId == userId
          && request.resource.data.createdAt is timestamp
          && request.resource.data.updatedAt is timestamp;
          
        allow update: if request.auth != null 
          && request.auth.uid == userId
          && resource.data.userId == userId
          && request.resource.data.userId == userId
          && request.resource.data.updatedAt is timestamp;
          
        allow delete: if request.auth != null 
          && request.auth.uid == userId
          && resource.data.userId == userId;
      }
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click "Publish"

## Step 5: Add Firebase to your React Native app

1. In the Firebase console, click the gear icon and go to "Project settings"
2. Scroll down to "Your apps" and click the Android icon
3. Register your Android app:
   - Android package name: `com.huedo` (or your app's package name)
   - App nickname: `HueDo Android`
   - Download `google-services.json`
   - Place the file in `android/app/`

4. Click the iOS icon to register iOS app:
   - iOS bundle ID: `com.huedo` (or your app's bundle ID)
   - App nickname: `HueDo iOS`
   - Download `GoogleService-Info.plist`
   - Place the file in `ios/`

## Step 6: Configure React Native Firebase

The app already has the necessary Firebase packages installed:
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/firestore`

Follow the [React Native Firebase installation guide](https://rnfirebase.io/) for platform-specific setup.

### Android Configuration

Add to `android/build.gradle`:
```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
}
```

Add to `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

### iOS Configuration

1. Open `ios/YourApp.xcworkspace` in Xcode
2. Add `GoogleService-Info.plist` to your Xcode project
3. Run `cd ios && pod install`

## Step 7: Initialize Firebase in your app

The app is already configured to use Firebase. The main configuration is in:
- `src/services/firebaseService.ts` - Firebase service layer
- `src/redux/tasks/tasksSlice.ts` - Redux integration with Firebase
- `src/redux/auth/authSlice.ts` - Authentication state management

## Step 8: Test the setup

1. Build and run your app
2. Try creating an account or signing in
3. Create some todos
4. Check the Firestore console to see if data is being saved

## Data Structure

The app uses the following Firestore data structure:

```
/users/{userId}
  /profile/data - User profile information
  /todos/{todoId} - Individual todo documents
```

Each todo document contains:
- `id`: Unique todo identifier
- `title`: Todo title (1-255 characters)
- `description`: Todo description (max 1000 characters)
- `isCompleted`: Boolean completion status
- `priority`: 'low' | 'medium' | 'high'
- `createdAt`: Timestamp when created
- `updatedAt`: Timestamp when last updated
- `userId`: Owner's user ID
- `dueDate`: Optional due date
- `tags`: Optional array of tags
- `category`: Optional category

## Security Features

- **User isolation**: Users can only access their own data
- **Data validation**: Strict validation on todo creation/updates
- **Authentication required**: All operations require authentication
- **Anonymous support**: Guest users can use the app temporarily

## Troubleshooting

1. **Build errors**: Make sure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are correctly placed
2. **Authentication issues**: Check that the sign-in methods are enabled in Firebase console
3. **Firestore permissions**: Verify that the security rules are published correctly
4. **Real-time updates not working**: Check network connectivity and Firebase project configuration

## Additional Features

The app includes:
- **Real-time synchronization**: Changes are synced across devices instantly
- **Offline support**: Works offline with automatic sync when back online
- **Material 3 Design**: Modern, consistent UI following Material Design principles
- **Advanced filtering**: Filter by status, priority, due date
- **Search functionality**: Full-text search across todos
- **Dark/Light themes**: Customizable appearance
- **Priority management**: Visual priority indicators and sorting

## Next Steps

- Set up Firebase Analytics (optional)
- Configure Firebase Cloud Messaging for push notifications
- Set up Firebase Crashlytics for error reporting
- Consider implementing Firebase Cloud Functions for advanced features