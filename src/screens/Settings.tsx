import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
const Settings = () => {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
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

export default Settings;
