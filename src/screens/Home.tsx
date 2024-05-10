import React from 'react';
import {View, StyleSheet, Appearance} from 'react-native';
import {Button, Text} from 'react-native-paper';
const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      {/* <Button
        onPress={() => {
          Appearance.setColorScheme('dark');
        }}>
        A
      </Button> */}
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

export default Home;
