import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import React from 'react';
import BottomTabNavigator from './BottomTabs';
import {getHeaderTitle} from '@react-navigation/elements';
import {Platform} from 'react-native';
import {Appbar} from 'react-native-paper';
import {RootStackParamList} from './types';
import AuthNavigator from './AuthNavigator';
import EditCreateTodo from '../screens/Edit+CreateTask/Edit+Create.Todo.Screen';

const Stack = createStackNavigator<RootStackParamList>();
const cardStyleInterpolator =
  Platform.OS === 'android'
    ? CardStyleInterpolators.forFadeFromBottomAndroid
    : CardStyleInterpolators.forHorizontalIOS;

const RootNavigator: React.FC<{}> = () => {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => {
        return {
          headerShown: false,
          detachPreviousScreen: !navigation.isFocused(),
          cardStyleInterpolator,
          header: ({navigation, route, options, back}) => {
            const title = getHeaderTitle(options, route.name);
            return (
              <Appbar.Header elevated>
                {back ? (
                  <Appbar.BackAction onPress={() => navigation.goBack()} />
                ) : null}
                <Appbar.Content title={title} />
              </Appbar.Header>
            );
          },
        };
      }}>
      {/* <Stack.Screen name="Auth" component={AuthNavigator} /> */}
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="Task"
        options={{
          headerShown: true,
          headerTitle: 'New Task',
        }}
        component={EditCreateTodo}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
