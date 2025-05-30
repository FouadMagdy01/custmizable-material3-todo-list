import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, Text} from 'react-native-paper';
import {RegisterScreenProps} from '../../../navigation/types';
import ScreenWrapper from '../../../components/ScreenWrapper';
import RegisterationForm from './components/RegisterationForm/RegistrationForm';

const RegisterScreen = ({navigation}: RegisterScreenProps) => {
  return (
    <ScreenWrapper
      withScrollView
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.topSection}>
        <Icon source="account-plus" size={80} />
        <Text style={styles.signupTitle} variant="headlineMedium">
          Sign up
        </Text>
      </View>
      <RegisterationForm />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  signupTitle: {
    marginVertical: 8,
  },
});

export default RegisterScreen;
