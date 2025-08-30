import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Icon, Text, TextInput, HelperText} from 'react-native-paper';

import {LoginScreenProps} from '../../../navigation/types';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {useFormik} from 'formik';
import {object, string, InferType} from 'yup';
import auth from '@react-native-firebase/auth';
import firebaseService from '../../../services/firebaseService';
// ✅ Fixed and simplified validation schema
const validationSchema = object({
  email: string()
    .trim()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: string().required('Password is required'),
});

type FormValues = InferType<typeof validationSchema>;

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [signingInAnonymously, setSigningInAnonymously] = React.useState(false);
  const {values, errors, handleChange, handleSubmit, isSubmitting} =
    useFormik<FormValues>({
      validationSchema,
      validateOnBlur: true,
      initialValues: {
        email: '',
        password: '',
      },
      onSubmit: async (values, formikHelpers) => {
        try {
          await auth().signInWithEmailAndPassword(
            values.email,
            values.password,
          );
          // Navigate or handle success
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    });

  const signInAsGuest = async () => {
    try {
      setSigningInAnonymously(true);
      const registeredUser = await auth().signInAnonymously();
      console.log(registeredUser.user.uid);
      // Create user profile for anonymous user
      try {
        await firebaseService.createUserProfile({
          displayName: 'Guest User',
        });
      } catch (error) {
        console.log('Profile creation not required for anonymous users');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setSigningInAnonymously(false);
    }
  };
  return (
    <ScreenWrapper
      withScrollView
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Icon source="login" size={80} />
        <Text style={styles.title} variant="headlineMedium">
          Sign in
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Email"
          value={values.email}
          onChangeText={handleChange('email')}
          error={!!errors.email}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.email}>
          {errors.email}
        </HelperText>

        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry
          value={values.password}
          onChangeText={handleChange('password')}
          error={!!errors.password}
          style={[styles.input, styles.passwordInput]}
        />
        <HelperText type="error" visible={!!errors.password}>
          {errors.password}
        </HelperText>

        <Button 
          style={styles.forgotPassword} 
          mode="text" 
          onPress={() => navigation.navigate('ForgetPassword')}>
          Forget password?
        </Button>

        <Button
          disabled={isSubmitting || signingInAnonymously}
          loading={isSubmitting || signingInAnonymously}
          style={styles.signInButton}
          mode="contained"
          onPress={() => handleSubmit()}>
          Sign In
        </Button>
      </View>

      <View style={styles.footer}>
        <Button
          disabled={isSubmitting || signingInAnonymously}
          style={styles.createAccount}
          mode="outlined"
          onPress={() => navigation.navigate('Auth', {screen: 'Register'})}>
          Create new account
        </Button>

        <Button
          loading={signingInAnonymously || isSubmitting}
          disabled={signingInAnonymously || isSubmitting}
          style={styles.guest}
          mode="text"
          onPress={signInAsGuest}>
          Continue as a guest
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginTop: 8,
  },
  form: {
    width: '90%',
  },
  input: {
    width: '100%',
  },
  passwordInput: {
    marginTop: 8,
  },
  forgotPassword: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  signInButton: {
    width: '100%',
    marginTop: 24,
  },
  footer: {
    marginTop: 24,
    width: '90%',
  },
  createAccount: {
    width: '100%',
  },
  guest: {
    marginTop: 8,
    width: '100%',
  },
});

export default LoginScreen;
