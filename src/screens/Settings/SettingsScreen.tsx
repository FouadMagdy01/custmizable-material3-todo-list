import React, {useState} from 'react';
import {View, StyleSheet, Alert, Linking, Share, Platform} from 'react-native';
import {
  Button,
  Divider,
  List,
  Switch,
  Text,
  Avatar,
  Card,
  Dialog,
  Portal,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../hooks/reduxHooks';
import {toggleTheme, updateTheme} from '../../redux/preferences/reducers';
import {toggleLoginState} from '../../redux/auth/authSlice';
import {
  setDefaultPriority,
  setDefaultSorting,
  setAutoDeleteCompleted,
  setPushNotifications,
  setEmailNotifications,
} from '../../redux/preferences/preferencesSlice';
import ScreenWrapper from '../../components/ScreenWrapper';
import auth from '@react-native-firebase/auth';
import ColorSelectionDialog from '../../components/Dialogs/ColorSelectionDialog/ColorSelectionDialog';
import {SettingsScreenProps} from '../../navigation/types';
import {deleteCompletedTodos, fetchTodos} from '../../redux/tasks/tasksSlice';
import {TodoPriority, TodoSortBy, SortOrder} from '../../types/appTypes';

const Settings: React.FC<SettingsScreenProps> = ({navigation}) => {
  const [showColorSelectionModal, setShowColorSelectionModal] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [deleteAccountDialogVisible, setDeleteAccountDialogVisible] = useState(false);
  const [priorityDialogVisible, setPriorityDialogVisible] = useState(false);
  const [sortingDialogVisible, setSortingDialogVisible] = useState(false);
  const [changePasswordDialogVisible, setChangePasswordDialogVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileDialogVisible, setProfileDialogVisible] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const prefsState = useAppSelector(state => state.preferences);
  const dispatch = useAppDispatch();

  // Use Redux state for settings
  const {
    defaultPriority,
    defaultSortBy,
    defaultSortOrder,
    autoDeleteCompleted,
    pushNotifications,
    emailNotifications,
  } = prefsState;

  // Get current user from Firebase Auth
  const currentUser = auth().currentUser;
  const isAnonymous = currentUser?.isAnonymous || false;

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await auth().signOut();
      dispatch(toggleLoginState(false));
      setLogoutDialogVisible(false);
      // Navigation will be handled automatically by the RootNavigator
      // based on the auth state change
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleAccountDeletion = () => {
    setDeleteAccountDialogVisible(true);
  };

  const confirmAccountDeletion = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        // First delete all user's todos
        await dispatch(deleteCompletedTodos()).unwrap();
        // Then delete the user account
        await user.delete();
        dispatch(toggleLoginState(false));
        setDeleteAccountDialogVisible(false);
        // Navigation will be handled automatically by the RootNavigator
        // based on the auth state change
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again or contact support.');
    }
  };

  // For guest users, show a message that they need to create an account
  // The actual navigation to auth is handled by the app structure

  // External actions
  const handleRateApp = () => {
    const storeUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/id123456789' // Replace with actual App Store URL
      : 'https://play.google.com/store/apps/details?id=com.yourapp'; // Replace with actual Play Store URL
    Linking.openURL(storeUrl).catch(() => {
      Alert.alert('Error', 'Could not open app store');
    });
  };

  const handleDataExport = async () => {
    try {
      const todos = await dispatch(fetchTodos({})).unwrap();
      const exportData = {
        todos: todos.todos,
        exportDate: new Date().toISOString(),
        version: '0.0.1',
      };
      
      await Share.share({
        title: 'My Tasks Export',
        message: `My Tasks Data Export\n\nExported on: ${new Date().toLocaleDateString()}\n\nData: ${JSON.stringify(exportData, null, 2)}`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handlePrivacyPolicy = () => {
    const privacyUrl = 'https://yourapp.com/privacy'; // Replace with actual privacy policy URL
    Linking.openURL(privacyUrl).catch(() => {
      Alert.alert('Error', 'Could not open privacy policy');
    });
  };

  const handleHelpSupport = () => {
    const supportEmail = 'support@yourapp.com'; // Replace with actual support email
    const subject = 'Help & Support Request';
    const body = `Hi Support Team,\n\nI need help with:\n\n[Please describe your issue here]\n\nDevice Info:\nVersion: 0.0.1\nPlatform: ${Platform.OS}\n\nThank you!`;
    
    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Error', 'Could not open email client');
    });
  };

  const handleChangePassword = async () => {
    try {
      // Validate inputs
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all password fields.');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New password and confirmation do not match.');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Error', 'New password must be at least 6 characters long.');
        return;
      }

      const user = auth().currentUser;
      if (!user || !user.email) {
        Alert.alert('Error', 'No user found. Please sign in again.');
        return;
      }

      // Re-authenticate the user with their current password
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);

      // Update the password
      await user.updatePassword(newPassword);

      // Clear form and close dialog
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangePasswordDialogVisible(false);

      Alert.alert('Success', 'Your password has been updated successfully.');
    } catch (error: any) {
      console.error('Password change error:', error);
      
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please wait a few minutes before trying again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign out and sign in again, then try changing your password.';
      }
      
      Alert.alert('Password Change Failed', errorMessage);
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleEditProfile = () => {
    const user = auth().currentUser;
    if (user) {
      setEditDisplayName(user.displayName || '');
      setEditEmail(user.email || '');
      setProfileDialogVisible(true);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      const user = auth().currentUser;
      
      if (!user) {
        Alert.alert('Error', 'No user found. Please sign in again.');
        return;
      }

      // Validate inputs
      if (!editDisplayName.trim()) {
        Alert.alert('Error', 'Display name cannot be empty.');
        return;
      }

      // Update display name if changed
      if (editDisplayName !== user.displayName) {
        await user.updateProfile({
          displayName: editDisplayName.trim(),
        });
      }

      // Update email if changed (requires re-authentication)
      if (editEmail !== user.email) {
        Alert.alert(
          'Email Change',
          'Important: Changing your email will reset your verification status. You\'ll need to verify your new email address before you can use all features. This will also sign you out for security.',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Continue',
              onPress: async () => {
                try {
                  // Update email (this automatically sets emailVerified to false)
                  await user.updateEmail(editEmail);
                  
                  // Send verification email to the new address
                  await user.sendEmailVerification();
                  
                  // Update user profile data in Firestore if you're using it
                  try {
                    // This would update the user profile in Firestore if needed
                    // await firebaseService.updateUserProfile({ email: editEmail });
                  } catch (firestoreError) {
                    console.warn('Failed to update Firestore profile:', firestoreError);
                  }
                  
                  Alert.alert(
                    'Email Updated', 
                    `Your email has been changed to ${editEmail}. A verification email has been sent to your new address. You must verify this email before you can use all features.\n\nYou will be signed out now for security.`,
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          setProfileDialogVisible(false);
                          resetProfileForm();
                          auth().signOut();
                          dispatch(toggleLoginState(false));
                        }
                      }
                    ]
                  );
                } catch (emailError: any) {
                  console.error('Email update error:', emailError);
                  let errorMessage = 'Failed to update email. Please try again.';
                  
                  if (emailError.code === 'auth/email-already-in-use') {
                    errorMessage = 'This email is already in use by another account.';
                  } else if (emailError.code === 'auth/invalid-email') {
                    errorMessage = 'Please enter a valid email address.';
                  } else if (emailError.code === 'auth/requires-recent-login') {
                    errorMessage = 'Please sign out and sign in again, then try changing your email.';
                  } else if (emailError.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
                  } else if (emailError.code === 'auth/network-request-failed') {
                    errorMessage = 'Network error. Please check your internet connection and try again.';
                  }
                  
                  Alert.alert('Email Update Failed', errorMessage);
                }
              }
            }
          ]
        );
        return; // Don't close dialog yet if email update is pending
      }

      // If we get here, only display name was updated
      setProfileDialogVisible(false);
      Alert.alert('Success', 'Your profile has been updated successfully.');

    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const resetProfileForm = () => {
    setEditDisplayName('');
    setEditEmail('');
  };

  return (
    <ScreenWrapper withScrollView style={styles.container}>
      <ColorSelectionDialog
        visible={showColorSelectionModal}
        onClose={() => {
          setShowColorSelectionModal(false);
        }}
        onApply={async (initialColor: string, finalColor: string) => {
          try {
            // Import the createMaterial3Theme function
            const { createMaterial3Theme } = require('@pchmn/expo-material3-theme');
            const newTheme = createMaterial3Theme(finalColor);
            
            // Dispatch the updateTheme action with the new theme
            await dispatch(updateTheme({
              theme: newTheme,
              dark: prefsState.dark
            }));
          } catch (error) {
            console.error('Error updating theme:', error);
          }
        }}
      />

      {/* Account/Profile Section */}
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        {isAnonymous ? (
          <>
            <List.Item
              title="Guest User"
              description="You're browsing as a guest"
              left={props => <Avatar.Text {...props} size={36} label="G" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                Alert.alert(
                  'Guest Profile', 
                  'To edit your profile, you need to create an account first. This will allow you to save your information and sync across devices.',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    },
                    {
                      text: 'Create Account',
                      onPress: async () => {
                        try {
                          // Sign out guest user first
                          await auth().signOut();
                          dispatch(toggleLoginState(false));
                          // Wait a brief moment for navigation to update, then navigate to Register
                          setTimeout(() => {
                            navigation.navigate('Auth', { screen: 'Register' });
                          }, 100);
                        } catch (error) {
                          console.error('Error signing out guest user:', error);
                        }
                      }
                    }
                  ]
                );
              }}
              style={styles.listItemCentered}
            />
            <Divider />
            <Card style={styles.guestCard}>
              <Card.Content style={styles.guestCardContent}>
                <Avatar.Icon
                  size={40}
                  icon="account-plus"
                  style={styles.cardIcon}
                />
                <View style={styles.guestTextContainer}>
                  <Text variant="titleMedium" style={styles.guestTitle}>
                    Create an Account
                  </Text>
                  <Text variant="bodyMedium" style={styles.guestDescription}>
                    Sign up to save your todos, sync across devices, and never
                    lose your tasks
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button
                  mode="contained"
                  onPress={async () => {
                    try {
                      // Sign out guest user first
                      await auth().signOut();
                      dispatch(toggleLoginState(false));
                      // Wait a brief moment for navigation to update, then navigate to Register
                      setTimeout(() => {
                        navigation.navigate('Auth', { screen: 'Register' });
                      }, 100);
                    } catch (error) {
                      console.error('Error signing out guest user:', error);
                    }
                  }}
                  style={styles.createAccountButton}>
                  Create Account
                </Button>
              </Card.Actions>
            </Card>
          </>
        ) : (
          <>
            <List.Item
              title={currentUser?.displayName || 'John Doe'}
              description={currentUser?.email || 'john.doe@example.com'}
              left={props =>
                currentUser?.photoURL ? (
                  <Avatar.Image
                    {...props}
                    size={48}
                    source={{uri: currentUser.photoURL}}
                  />
                ) : (
                  <Avatar.Text
                    {...props}
                    size={48}
                    label={(currentUser?.displayName || 'John Doe')
                      .charAt(0)
                      .toUpperCase()}
                  />
                )
              }
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleEditProfile}
              style={styles.listItemCentered}
            />
            <Divider />
            
            {/* Account Verification Status */}
            <List.Item
              title="Account Status"
              description={currentUser?.emailVerified ? "Email verified" : "Email not verified"}
              left={props => (
                <List.Icon 
                  {...props} 
                  icon={currentUser?.emailVerified ? "check-circle" : "alert-circle"} 
                />
              )}
              right={props => (
                !currentUser?.emailVerified ? (
                  <Button
                    mode="outlined"
                    compact
                    onPress={async () => {
                      try {
                        await currentUser?.sendEmailVerification();
                        // Navigate to verification screen
                        navigation.navigate('EmailVerification', { email: currentUser?.email || '' });
                      } catch (error: any) {
                        console.error('Error sending verification email:', error);
                        
                        let errorMessage = 'Failed to send verification email. Please try again.';
                        
                        if (error.code === 'auth/too-many-requests') {
                          errorMessage = 'Too many verification emails sent. Please wait a few minutes before trying again.';
                        } else if (error.code === 'auth/user-not-found') {
                          errorMessage = 'User account not found. Please sign in again.';
                        } else if (error.code === 'auth/network-request-failed') {
                          errorMessage = 'Network error. Please check your internet connection and try again.';
                        } else if (error.code === 'auth/invalid-email') {
                          errorMessage = 'Invalid email address. Please contact support.';
                        }
                        
                        Alert.alert('Verification Email Error', errorMessage);
                      }
                    }}>
                    Verify
                  </Button>
                ) : (
                  <List.Icon {...props} icon="check-circle" />
                )
              )}
              style={[
                styles.listItemCentered,
                currentUser?.emailVerified ? styles.verifiedItem : styles.unverifiedItem
              ]}
            />
            <Divider />
          </>
        )}
      </List.Section>

      {/* Appearance Section */}
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          description="Switch between light and dark theme"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={prefsState.dark}
              onValueChange={() => {
                dispatch(toggleTheme());
              }}
            />
          )}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Theme Color"
          description="Customize your app's accent color"
          left={props => <List.Icon {...props} icon="palette" />}
          onPress={() => {
            setShowColorSelectionModal(true);
          }}
          right={() => (
            <View
              style={[
                styles.themeColorCircle,
                {
                  backgroundColor: prefsState.dark
                    ? prefsState.theme.dark.primary
                    : prefsState.theme.light.primary,
                  borderColor: prefsState.dark
                    ? prefsState.theme.dark.outline
                    : prefsState.theme.light.outline,
                },
              ]}
            />
          )}
          style={styles.listItemCentered}
        />
      </List.Section>

      {/* Notifications Section */}
      <List.Section>
        <List.Subheader>Notifications</List.Subheader>
        <List.Item
          title="Reminder Notifications"
          description="Get notified about upcoming task deadlines"
          left={props => <List.Icon {...props} icon="bell-ring" />}
          right={() => (
            <Switch
              value={pushNotifications}
              onValueChange={(value) => { dispatch(setPushNotifications(value)); }}
            />
          )}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Daily Summary"
          description="Receive daily summary of your tasks via email"
          left={props => <List.Icon {...props} icon="email-newsletter" />}
          right={() => (
            <Switch
              value={emailNotifications}
              onValueChange={(value) => { dispatch(setEmailNotifications(value)); }}
            />
          )}
          style={styles.listItemCentered}
        />
      </List.Section>

      {/* Privacy and Security Section */}
      <List.Section>
        <List.Subheader>Privacy & Security</List.Subheader>
        {!isAnonymous && (
          <>
            <List.Item
              title="Change Password"
              description="Update your account password"
              left={props => <List.Icon {...props} icon="lock" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                setChangePasswordDialogVisible(true);
              }}
              style={styles.listItemCentered}
            />
            <Divider />
          </>
        )}
        <List.Item
          title="Data Export"
          description="Export your tasks and data"
          left={props => <List.Icon {...props} icon="export" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleDataExport}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          description="Read our privacy policy"
          left={props => <List.Icon {...props} icon="shield-account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handlePrivacyPolicy}
          style={styles.listItemCentered}
        />
        {!isAnonymous && (
          <>
            <Divider />
            <List.Item
              title="Delete Account"
              description="Permanently delete your account and data"
              left={props => <List.Icon {...props} icon="delete-forever" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleAccountDeletion}
              titleStyle={styles.dangerText}
              style={styles.listItemCentered}
            />
          </>
        )}
      </List.Section>

      {/* Task Management Section */}
      <List.Section>
        <List.Subheader>Task Management</List.Subheader>
        <List.Item
          title="Default Task Priority"
          description={`Current: ${defaultPriority.charAt(0).toUpperCase() + defaultPriority.slice(1)}`}
          left={props => <List.Icon {...props} icon="flag" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => setPriorityDialogVisible(true)}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Auto Delete Completed"
          description="Automatically delete completed tasks after 7 days"
          left={props => <List.Icon {...props} icon="delete-clock" />}
          right={() => (
            <Switch
              value={autoDeleteCompleted}
              onValueChange={(value) => { dispatch(setAutoDeleteCompleted(value)); }}
            />
          )}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Task Sorting"
          description={`Current: ${defaultSortBy.charAt(0).toUpperCase() + defaultSortBy.slice(1)} (${defaultSortOrder.toUpperCase()})`}
          left={props => <List.Icon {...props} icon="sort" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => setSortingDialogVisible(true)}
          style={styles.listItemCentered}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Version"
          description="0.0.1 (Beta)"
          left={props => <List.Icon {...props} icon="information" />}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Help & Support"
          description="Get help and contact support"
          left={props => <List.Icon {...props} icon="help-circle" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleHelpSupport}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Rate The App"
          description="Help us improve by rating the app"
          left={props => <List.Icon {...props} icon="star" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleRateApp}
          style={styles.listItemCentered}
        />
      </List.Section>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          icon="logout"
          buttonColor="transparent"
          textColor={
            prefsState.dark
              ? prefsState.theme.dark.error
              : prefsState.theme.light.error
          }
          style={[
            styles.logoutButton,
            {
              borderColor: prefsState.dark
                ? prefsState.theme.dark.error
                : prefsState.theme.light.error,
            },
          ]}>
          Logout
        </Button>
      </View>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog 
          visible={logoutDialogVisible} 
          onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Icon icon="logout" />
          <Dialog.Title style={{textAlign: 'center'}}>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{textAlign: 'center'}}>
              Are you sure you want to logout?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setLogoutDialogVisible(false)}
              mode="outlined">
              Cancel
            </Button>
            <Button 
              onPress={confirmLogout}
              mode="contained"
              buttonColor={prefsState.dark ? prefsState.theme.dark.error : prefsState.theme.light.error}>
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Account Confirmation Dialog */}
      <Portal>
        <Dialog 
          visible={deleteAccountDialogVisible} 
          onDismiss={() => setDeleteAccountDialogVisible(false)}>
          <Dialog.Icon icon="delete-forever" />
          <Dialog.Title style={{textAlign: 'center'}}>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{textAlign: 'center'}}>
              This action cannot be undone. All your data will be permanently deleted.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setDeleteAccountDialogVisible(false)}
              mode="outlined">
              Cancel
            </Button>
            <Button 
              onPress={confirmAccountDeletion}
              mode="contained"
              buttonColor={prefsState.dark ? prefsState.theme.dark.error : prefsState.theme.light.error}>
              Delete Account
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Priority Selection Dialog */}
      <Portal>
        <Dialog 
          visible={priorityDialogVisible} 
          onDismiss={() => setPriorityDialogVisible(false)}>
          <Dialog.Title>Default Task Priority</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{marginBottom: 16}}>
              Choose the default priority for new tasks:
            </Text>
            <RadioButton.Group 
              onValueChange={(value) => { dispatch(setDefaultPriority(value as TodoPriority)); }} 
              value={defaultPriority}>
              
              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="flag-variant" color="#f44336" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">High Priority</Text>
                    <Text variant="bodySmall" style={{opacity: 0.7}}>Urgent and important tasks</Text>
                  </View>
                  <RadioButton value="high" />
                </View>
              </View>

              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="flag" color="#ff9800" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">Medium Priority</Text>
                    <Text variant="bodySmall" style={{opacity: 0.7}}>Standard importance</Text>
                  </View>
                  <RadioButton value="medium" />
                </View>
              </View>

              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="flag-outline" color="#4caf50" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">Low Priority</Text>
                    <Text variant="bodySmall" style={{opacity: 0.7}}>Can wait if needed</Text>
                  </View>
                  <RadioButton value="low" />
                </View>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setPriorityDialogVisible(false)}
              mode="outlined">
              Cancel
            </Button>
            <Button 
              onPress={() => setPriorityDialogVisible(false)}
              mode="contained">
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Sorting Selection Dialog */}
      <Portal>
        <Dialog 
          visible={sortingDialogVisible} 
          onDismiss={() => setSortingDialogVisible(false)}>
          <Dialog.Title>Default Task Sorting</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{marginBottom: 16}}>
              Choose how tasks are sorted by default:
            </Text>
            
            <Text variant="titleSmall" style={{marginBottom: 8, fontWeight: '600'}}>
              Sort By:
            </Text>
            <RadioButton.Group 
              onValueChange={(value) => { dispatch(setDefaultSorting({sortBy: value as TodoSortBy, sortOrder: defaultSortOrder})); }} 
              value={defaultSortBy}>
              
              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="calendar-plus" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">Date Created</Text>
                  </View>
                  <RadioButton value="createdAt" />
                </View>
              </View>

              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="calendar-clock" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">Due Date</Text>
                  </View>
                  <RadioButton value="dueDate" />
                </View>
              </View>

              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="flag" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">Priority</Text>
                  </View>
                  <RadioButton value="priority" />
                </View>
              </View>

              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="format-title" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">Title</Text>
                  </View>
                  <RadioButton value="title" />
                </View>
              </View>
            </RadioButton.Group>

            <Text variant="titleSmall" style={{marginBottom: 8, marginTop: 16, fontWeight: '600'}}>
              Sort Order:
            </Text>
            <RadioButton.Group 
              onValueChange={(value) => { dispatch(setDefaultSorting({sortBy: defaultSortBy, sortOrder: value as SortOrder})); }} 
              value={defaultSortOrder}>
              
              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="sort-descending" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">Descending</Text>
                    <Text variant="bodySmall" style={{opacity: 0.7}}>Newest first / Z to A / High to Low</Text>
                  </View>
                  <RadioButton value="desc" />
                </View>
              </View>

              <View style={styles.radioOption}>
                <View style={styles.radioRow}>
                  <List.Icon icon="sort-ascending" />
                  <View style={styles.radioTextContainer}>
                    <Text variant="titleMedium">Ascending</Text>
                    <Text variant="bodySmall" style={{opacity: 0.7}}>Oldest first / A to Z / Low to High</Text>
                  </View>
                  <RadioButton value="asc" />
                </View>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setSortingDialogVisible(false)}
              mode="outlined">
              Cancel
            </Button>
            <Button 
              onPress={() => setSortingDialogVisible(false)}
              mode="contained">
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Change Password Dialog */}
      <Portal>
        <Dialog 
          visible={changePasswordDialogVisible} 
          onDismiss={() => {
            setChangePasswordDialogVisible(false);
            resetPasswordForm();
          }}>
          <Dialog.Title>Change Password</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{marginBottom: 16}}>
              Enter your current password and choose a new one:
            </Text>
            
            <TextInput
              mode="outlined"
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              right={
                <TextInput.Icon
                  icon={showCurrentPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              }
              style={{marginBottom: 12}}
            />

            <TextInput
              mode="outlined"
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              right={
                <TextInput.Icon
                  icon={showNewPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />
              }
              style={{marginBottom: 12}}
            />

            <TextInput
              mode="outlined"
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              style={{marginBottom: 8}}
            />

            <Text variant="bodySmall" style={{opacity: 0.7}}>
              Password must be at least 6 characters long.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => {
                setChangePasswordDialogVisible(false);
                resetPasswordForm();
              }}
              mode="outlined">
              Cancel
            </Button>
            <Button 
              onPress={handleChangePassword}
              mode="contained">
              Update Password
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Profile Edit Dialog */}
      <Portal>
        <Dialog 
          visible={profileDialogVisible} 
          onDismiss={() => {
            setProfileDialogVisible(false);
            resetProfileForm();
          }}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{marginBottom: 16}}>
              Update your profile information:
            </Text>
            
            <TextInput
              mode="outlined"
              label="Display Name"
              value={editDisplayName}
              onChangeText={setEditDisplayName}
              left={<TextInput.Icon icon="account" />}
              style={{marginBottom: 12}}
            />

            <TextInput
              mode="outlined"
              label="Email Address"
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              style={{marginBottom: 8}}
            />

            <Text variant="bodySmall" style={{opacity: 0.7, marginBottom: 4}}>
              Note: Changing your email will reset verification status, require re-verification, and sign you out for security.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => {
                setProfileDialogVisible(false);
                resetProfileForm();
              }}
              mode="outlined"
              disabled={isUpdatingProfile}>
              Cancel
            </Button>
            <Button 
              onPress={handleUpdateProfile}
              mode="contained"
              loading={isUpdatingProfile}
              disabled={isUpdatingProfile}>
              Update Profile
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginBottom: 0,
  },
  themeColorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  logoutContainer: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  logoutButton: {
    borderWidth: 1,
    marginBottom: 32,
  },
  dangerText: {
    color: '#d32f2f',
  },
  listItemCentered: {
    alignItems: 'center',
  },
  guestCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    elevation: 2,
  },
  guestCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  guestTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  guestTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  guestDescription: {
    opacity: 0.8,
    lineHeight: 20,
  },
  cardIcon: {
    marginTop: 4,
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 0,
  },
  createAccountButton: {
    flex: 1,
  },
  guestAvatar: {
    backgroundColor: '#6200ea',
  },
  radioOption: {
    marginVertical: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  radioTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  verifiedItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  unverifiedItem: {
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
  },
});

export default Settings;