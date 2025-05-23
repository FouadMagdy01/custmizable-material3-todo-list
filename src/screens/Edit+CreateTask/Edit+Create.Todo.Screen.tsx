import React, {Component} from 'react';
import {View} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import {TextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {TaskScreenProps} from '../../navigation/types';
import TaskForm from './components/TaskForm/TaskForm';

const EditCreateTodo: React.FC<TaskScreenProps> = ({navigation}) => {
  return (
    <ScreenWrapper
      withScrollView
      contentContainerStyle={styles.contentContainerStyle}>
      <TaskForm />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
  },
});

export default EditCreateTodo;
