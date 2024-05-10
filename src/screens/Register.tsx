import React from 'react';
import {View, StyleSheet, Appearance} from 'react-native';
import {Button, Text} from 'react-native-paper';
const Register = () => {
  return (
    <View style={styles.container}>
      <Text>Sign Up</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Register;
