import React from 'react';
import {
  View,
  StyleSheet,
  Appearance,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import {Button, FAB, Icon, Portal, Text} from 'react-native-paper';
import {HomeScreenParams} from '../../navigation/types';
import EmptyList from './components/EmptyList';
import {useAppSelector} from '../../hooks/reduxHooks';
import TodoItem from './components/Task';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const Home: React.FC<HomeScreenParams> = ({navigation}) => {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {todos} = useAppSelector(state => state.todos);
  return (
    <>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        style={{
          marginTop: insets.top,
          flexGrow: 1,
        }}
        ListEmptyComponent={EmptyList}
        data={todos}
        renderItem={({item, index}) => {
          return (
            <TodoItem
              style={[styles.todoItem, {width: width * 0.9}]}
              todo={item}
            />
          );
        }}
      />
      <FAB
        icon="plus"
        onPress={() => {
          navigation.navigate('Task');
        }}
        visible={true}
        size="medium"
        variant="primary"
        style={styles.fab}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
  },
  todoItem: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});

export default Home;
