import React, {useState} from 'react';
import {View, StyleSheet, PixelRatio, Alert} from 'react-native';
import {
  Button,
  Divider,
  List,
  Switch,
  Text,
  Avatar,
  Card,
  IconButton,
} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../hooks/reduxHooks';
import {toggleTheme, updateTheme} from '../../redux/preferences/reducers';
import ScreenWrapper from '../../components/ScreenWrapper';
import auth from '@react-native-firebase/auth';
import ColorSelectionDialog from '../../components/Dialogs/ColorSelectionDialog/ColorSelectionDialog';

const Settings = () => {
  const [showColorSelectionModal, setShowColorSelectionModal] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const prefsState = useAppSelector(state => state.preferences);
  const dispatch = useAppDispatch();

  // Get current user from Firebase Auth
  const currentUser = auth().currentUser;
  const isAnonymous = currentUser?.isAnonymous || false;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // TODO: Add logout logic
          console.log('Logout pressed');
        },
      },
    ]);
  };

  const handleAccountDeletion = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Add account deletion logic
            console.log('Account deletion pressed');
          },
        },
      ],
    );
  };

  return (
    <ScreenWrapper withScrollView style={styles.container}>
      <ColorSelectionDialog
        visible={showColorSelectionModal}
        onClose={() => {
          setShowColorSelectionModal(false);
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
                // TODO: Navigate to profile screen
                console.log('View Profile pressed');
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
                  onPress={() => {
                    // TODO: Navigate to register screen
                    console.log('Create Account pressed');
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
              onPress={() => {
                // TODO: Navigate to profile screen
                console.log('View/Edit Profile pressed');
              }}
              style={styles.listItemCentered}
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
          right={props => (
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
          right={props => (
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
          )}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Daily Summary"
          description="Receive daily summary of your tasks via email"
          left={props => <List.Icon {...props} icon="email-newsletter" />}
          right={props => (
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
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
                // TODO: Navigate to change password screen
                console.log('Change Password pressed');
              }}
              style={styles.listItemCentered}
            />
            <Divider />
            <List.Item
              title="Two Factor Authentication"
              description="Add an extra layer of security"
              left={props => <List.Icon {...props} icon="shield-check" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // TODO: Navigate to 2FA setup screen
                console.log('Two Factor Authentication pressed');
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
          onPress={() => {
            // TODO: Navigate to data export options
            console.log('Data Export pressed');
          }}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          description="Read our privacy policy"
          left={props => <List.Icon {...props} icon="shield-account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            // TODO: Navigate to privacy policy screen
            console.log('Privacy Policy pressed');
          }}
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
          description="Set default priority for new tasks"
          left={props => <List.Icon {...props} icon="flag" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            // TODO: Navigate to priority selection
            console.log('Default Task Priority pressed');
          }}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Auto Delete Completed"
          description="Automatically delete completed tasks after 7 days"
          left={props => <List.Icon {...props} icon="delete-clock" />}
          right={props => (
            <Switch
              value={true} // TODO: Connect to actual state
              onValueChange={value => {
                // TODO: Handle auto delete toggle
                console.log('Auto Delete toggled:', value);
              }}
            />
          )}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Task Sorting"
          description="Choose how tasks are sorted by default"
          left={props => <List.Icon {...props} icon="sort" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            // TODO: Navigate to sorting options
            console.log('Task Sorting pressed');
          }}
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
          onPress={() => {
            // TODO: Navigate to help & support screen
            console.log('Help & Support pressed');
          }}
          style={styles.listItemCentered}
        />
        <Divider />
        <List.Item
          title="Rate The App"
          description="Help us improve by rating the app"
          left={props => <List.Icon {...props} icon="star" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            // TODO: Navigate to app store rating
            console.log('Rate The App pressed');
          }}
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
});

export default Settings;
