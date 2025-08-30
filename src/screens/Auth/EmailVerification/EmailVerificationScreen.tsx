import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Text, Icon, Card} from 'react-native-paper';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../../navigation/types';
import auth from '@react-native-firebase/auth';

type Props = StackScreenProps<RootStackParamList, 'EmailVerification'>;

const EmailVerificationScreen = ({navigation, route}: Props) => {
  const email = route.params?.email || '';
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    if (isResending) return;

    setIsResending(true);
    try {
      const user = auth().currentUser;
      if (user && !user.emailVerified) {
        await user.sendEmailVerification();
        Alert.alert(
          'Email Sent',
          'A new verification email has been sent to your inbox.',
        );
      }
    } catch (error: any) {
      console.error('Error sending verification email:', error);

      let errorMessage = 'Failed to send verification email. Please try again.';

      if (error.code === 'auth/too-many-requests') {
        errorMessage =
          'Too many verification emails sent. Please wait a few minutes before trying again. Check your spam folder in the meantime.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User account not found. Please sign in again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage =
          'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please contact support.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      // Add a 30-second cooldown
      setTimeout(() => {
        setIsResending(false);
      }, 30000);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper withScrollView={false} style={styles.screenWrapper}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon source="email-check" size={80} />
          </View>

          <Text variant="headlineSmall" style={styles.title}>
            Verify Your Email
          </Text>

          <Card style={styles.infoCard}>
            <Card.Content style={styles.cardContent}>
              <Text variant="bodyMedium" style={styles.description}>
                We've sent a verification email to:
              </Text>
              <Text variant="bodyLarge" style={styles.email}>
                {email}
              </Text>
              <Text variant="bodyMedium" style={styles.instructions}>
                Please check your inbox and click the verification link to
                activate your account.
              </Text>
              <Text variant="bodySmall" style={styles.helpText}>
                Didn't receive the email? Check your spam folder first. If you
                still don't see it, you can request a new one below.
              </Text>
            </Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleResendEmail}
              style={styles.button}
              icon="email-send"
              loading={isResending}
              disabled={isResending}>
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>

            <Button
              mode="outlined"
              onPress={handleGoBack}
              style={styles.button}>
              Go Back
            </Button>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
  },
  title: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: '600',
  },
  infoCard: {
    width: '100%',
    marginBottom: 32,
    elevation: 2,
  },
  description: {
    textAlign: 'center',
    marginBottom: 12,
  },
  email: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1976d2',
  },
  instructions: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  helpText: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 8,
    gap: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 2,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  iconContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
});

export default EmailVerificationScreen;
