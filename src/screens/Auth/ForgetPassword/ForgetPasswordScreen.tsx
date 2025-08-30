import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Icon, Text, TextInput, HelperText, Card} from 'react-native-paper';
import {useFormik} from 'formik';
import {object, string, InferType} from 'yup';
import auth from '@react-native-firebase/auth';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {ForgetPasswordScreenPassword} from '../../../navigation/types';

const validationSchema = object({
  email: string()
    .trim()
    .required('Email is required')
    .email('Enter a valid email address'),
});

type FormValues = InferType<typeof validationSchema>;

const ForgetPasswordScreen = ({navigation}: ForgetPasswordScreenPassword) => {
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');

  const {values, errors, handleChange, handleSubmit, isSubmitting, touched, handleBlur} =
    useFormik<FormValues>({
      validationSchema,
      validateOnBlur: true,
      validateOnChange: false,
      initialValues: {
        email: '',
      },
      onSubmit: async (values, formikHelpers) => {
        try {
          await auth().sendPasswordResetEmail(values.email);
          setSentToEmail(values.email);
          setEmailSent(true);
        } catch (error: any) {
          console.error('Password reset error:', error);
          
          let errorMessage = 'Failed to send password reset email. Please try again.';
          
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email address.';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many password reset attempts. Please wait a few minutes before trying again.';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          }
          
          Alert.alert('Password Reset Failed', errorMessage);
          formikHelpers.setSubmitting(false);
        }
      },
    });

  const handleResendEmail = async () => {
    try {
      await auth().sendPasswordResetEmail(sentToEmail);
      Alert.alert('Email Sent', 'A new password reset email has been sent to your inbox.');
    } catch (error: any) {
      console.error('Resend password reset error:', error);
      Alert.alert('Error', 'Failed to resend email. Please try again.');
    }
  };

  if (emailSent) {
    return (
      <ScreenWrapper style={styles.screenWrapper}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon source="email-check-outline" size={80} />
            </View>
            
            <Text variant="headlineSmall" style={styles.title}>
              Check Your Email
            </Text>
            
            <Card style={styles.infoCard}>
              <Card.Content style={styles.cardContent}>
                <Text variant="bodyMedium" style={styles.description}>
                  We've sent password reset instructions to:
                </Text>
                <Text variant="bodyLarge" style={styles.email}>
                  {sentToEmail}
                </Text>
                <Text variant="bodyMedium" style={styles.instructions}>
                  Please check your inbox and click the reset link to create a new password.
                </Text>
                <Text variant="bodySmall" style={styles.helpText}>
                  Didn't receive the email? Check your spam folder or request a new one below.
                </Text>
              </Card.Content>
            </Card>

            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={handleResendEmail}
                style={styles.button}
                icon="email-send">
                Resend Email
              </Button>
              
              <Button 
                mode="outlined" 
                onPress={() => navigation.navigate('Login')}
                style={styles.button}>
                Back to Login
              </Button>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      withScrollView
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Icon source="lock-reset" size={80} />
        <Text style={styles.title} variant="headlineMedium">
          Reset Password
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Email Address"
          value={values.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          error={!!(touched.email && errors.email)}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />
        <HelperText type="error" visible={!!(touched.email && errors.email)}>
          {errors.email}
        </HelperText>

        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          style={styles.resetButton}
          mode="contained"
          onPress={() => handleSubmit()}
          icon="send">
          {isSubmitting ? 'Sending...' : 'Send Reset Email'}
        </Button>
      </View>

      <View style={styles.footer}>
        <Button
          style={styles.backButton}
          mode="outlined"
          onPress={() => navigation.goBack()}
          icon="arrow-left">
          Back to Login
        </Button>
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    width: '100%',
    marginBottom: 8,
  },
  resetButton: {
    width: '100%',
    marginTop: 16,
    paddingVertical: 2,
  },
  footer: {
    marginTop: 32,
    width: '100%',
    maxWidth: 400,
  },
  backButton: {
    width: '100%',
  },
  iconContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  infoCard: {
    width: '100%',
    marginBottom: 32,
    elevation: 2,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
});

export default ForgetPasswordScreen;