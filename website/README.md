# HueDo Website

Official website for HueDo - A beautiful, customizable Material 3 todo list app.

## Features

- 🏠 **Landing Page**: App overview and features
- 📋 **Privacy Policy**: Comprehensive privacy policy for HueDo app
- 📜 **Terms of Service**: Legal terms and conditions  
- 🗑️ **Account Deletion**: Self-service account deletion with Firebase integration

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for consistent design system
- **Firebase** for authentication and database operations
- **React Router** for navigation

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration values:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Firebase Configuration

The website uses the same Firebase project as the HueDo mobile app:
- **Project ID**: huedo-5bdf2
- **Authentication**: Email/Password
- **Firestore**: Tasks and user data storage

## Account Deletion Flow

The account deletion feature provides users with a secure way to delete their accounts:

1. **Authentication**: Users must verify their identity with email/password
2. **Confirmation**: Clear warning about permanent data deletion
3. **Data Removal**: 
   - Deletes all user tasks from Firestore
   - Removes user profile data
   - Deletes Firebase Auth account
4. **Completion**: Success confirmation with no recovery option

## Security Features

- ✅ Email/password verification before deletion
- ✅ Multiple confirmation steps
- ✅ Complete data removal from Firebase
- ✅ Environment variables for sensitive config
- ✅ Proper error handling and user feedback

## Legal Pages

- **Privacy Policy**: Detailed data collection and usage practices
- **Terms of Service**: App usage terms and user responsibilities

## Deployment

The website can be deployed to any static hosting service:
- Vercel
- Netlify  
- GitHub Pages
- Firebase Hosting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── pages/              # Route pages
│   ├── HomePage.tsx
│   ├── PrivacyPolicy.tsx
│   ├── TermsOfService.tsx
│   └── AccountDeletion.tsx
├── firebase/           # Firebase configuration
│   └── config.ts
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Contributing

This website is part of the HueDo project. When updating legal documents or adding features, ensure consistency with the mobile app experience.
```
