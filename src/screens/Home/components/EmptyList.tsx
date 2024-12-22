import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Text} from 'react-native-paper';

const EmptyList: React.FC = () => {
  return (
    <View style={styles.container}>
      <Icon source="playlist-plus" size={124} />
      <Text variant="headlineSmall">You Don't have any tasks</Text>
    </View>
  );
};

export default EmptyList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
