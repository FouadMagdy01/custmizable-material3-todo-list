import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Icon, Text, TextInput} from 'react-native-paper';

import {LoginScreenProps} from '../navigation/types';
import ScreenWrapper from '../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {useFormik} from 'formik';
import {object, string, InferType} from 'yup';

const validationScheme = object({
  email: string()
    .required('Email is required')
    .email('Please enter valid email address'),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    ),
});
const Login = ({navigation}: LoginScreenProps) => {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const {} = useFormik<InferType<typeof validationScheme>>({
    validationSchema: validationScheme,
    initialValues: {email: '', password: ''},

    onSubmit(values, formikHelpers) {},
  });
  return (
    <ScreenWrapper
      withScrollView
      contentContainerStyle={styles.contentContainerStyle}>
      <View style={styles.wrapper}>
        <Icon source="login" size={80} />
        <Text style={styles.signInTitle} variant="headlineMedium">
          Sign in
        </Text>
      </View>
      <View style={styles.signInFormWrapper}>
        <TextInput mode="outlined" label="Email" style={styles.textInput} />
        <TextInput
          mode="outlined"
          label="Password"
          style={[styles.textInput, styles.passwordInput]}
        />
        <Button
          style={styles.forgotPasswordButton}
          mode="text"
          onPress={() => {}}>
          Forget password?
        </Button>
        <Button
          disabled={loading}
          loading={loading}
          style={styles.signInButton}
          onPress={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigation.navigate('Tabs', {
                screen: 'Home',
              });
            }, 3000);
          }}
          mode="contained">
          Sign In
        </Button>
        <Button
          disabled={loading}
          style={styles.googleSignInButton}
          mode="elevated"
          icon="google"
          onPress={() => {}}>
          Sign In with Google
        </Button>
      </View>
      <View style={[styles.footer, {marginBottom: insets.bottom}]}>
        <Button
          disabled={loading}
          style={styles.createAccountButton}
          mode="outlined"
          onPress={async () => {
            const {user} = await auth().createUserWithEmailAndPassword(
              'fouad.magdy772@gmail.com',
              'Foush100%',
            );
            await firebase.auth().currentUser?.sendEmailVerification();
          }}>
          Create new account
        </Button>
        <Button
          disabled={loading}
          style={[styles.guestButton, {marginBottom: insets.bottom}]}
          mode="text"
          onPress={() => {}}>
          Continue as a guest
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInTitle: {
    marginTop: 8,
  },
  signInFormWrapper: {
    width: '90%',
  },
  textInput: {
    width: '100%',
  },
  passwordInput: {
    marginTop: 8,
  },
  forgotPasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  signInButton: {
    width: '100%',
    marginTop: 24,
  },
  googleSignInButton: {
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 16,
  },
  createAccountButton: {
    width: '100%',
  },
  guestButton: {
    marginTop: 8,
    width: '100%',
  },
});

export default Login;
