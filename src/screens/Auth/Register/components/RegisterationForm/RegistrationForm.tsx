import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, HelperText, TextInput} from 'react-native-paper';
import {useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firebaseService from '../../../../../services/firebaseService';
import {
  RegisterationFormValues,
  registrationFormValidationScheme,
} from './registerationValidationScheme';
import {RegisterScreenProps} from '../../../../../navigation/types';

const RegisterationForm = () => {
  const navigation = useNavigation<RegisterScreenProps['navigation']>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    values,
    handleChange: _handleChange,
    errors,
    isSubmitting,
    handleSubmit,
  } = useFormik<RegisterationFormValues>({
    validationSchema: registrationFormValidationScheme,
    validateOnChange: false,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        const registeredUser = await auth().createUserWithEmailAndPassword(
          values.email,
          values.password,
        );

        await registeredUser.user.updateProfile({
          displayName: values.firstName + ' ' + values.lastName,
        });

        // Send email verification
        await registeredUser.user.sendEmailVerification();

        // Create user profile in Firestore
        await firebaseService.createUserProfile({
          displayName: values.firstName + ' ' + values.lastName,
          email: values.email,
        });

        // Navigate to email verification screen
        navigation.navigate('EmailVerification', { email: values.email });
      } catch (error) {
        console.error('Registration error:', error);
        formikHelpers.setSubmitting(false);
      }
    },
  });

  const handleChange = useCallback(
    <T extends keyof RegisterationFormValues>(field: T) => _handleChange(field),
    [_handleChange],
  );

  return (
    <View style={styles.formContainer}>
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <TextInput
            error={!!errors.firstName}
            mode="outlined"
            label="First Name"
            onChangeText={handleChange('firstName')}
            value={values.firstName}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.firstName}>
            {errors.firstName}
          </HelperText>
        </View>

        <View style={styles.halfWidth}>
          <TextInput
            error={!!errors.lastName}
            mode="outlined"
            label="Last Name"
            onChangeText={handleChange('lastName')}
            value={values.lastName}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.lastName}>
            {errors.lastName}
          </HelperText>
        </View>
      </View>

      <TextInput
        error={!!errors.email}
        mode="outlined"
        label="Email"
        onChangeText={handleChange('email')}
        value={values.email}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      <TextInput
        error={!!errors.confirmEmail}
        mode="outlined"
        label="Confirm Email"
        onChangeText={handleChange('confirmEmail')}
        value={values.confirmEmail}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.confirmEmail}>
        {errors.confirmEmail}
      </HelperText>

      <TextInput
        error={!!errors.password}
        mode="outlined"
        label="Password"
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(prev => !prev)}
          />
        }
        onChangeText={handleChange('password')}
        value={values.password}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      <TextInput
        error={!!errors.confirmPassword}
        mode="outlined"
        label="Confirm Password"
        secureTextEntry={!showConfirmPassword}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirmPassword(prev => !prev)}
          />
        }
        onChangeText={handleChange('confirmPassword')}
        value={values.confirmPassword}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.confirmPassword}>
        {errors.confirmPassword}
      </HelperText>

      <Button
        mode="contained"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit as () => void}
        style={styles.registerButton}>
        {isSubmitting ? 'Registering' : 'Register'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    width: '100%',
  },
  registerButton: {
    width: '100%',
    marginBottom: 16,
  },
});

export default RegisterationForm;
