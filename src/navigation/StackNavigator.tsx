import {
  createStackNavigator,
  CardStyleInterpolators,
  StackScreenProps,
} from '@react-navigation/stack';
import React from 'react';
import BottomTabNavigator from './BottomTabs';
import {getHeaderTitle} from '@react-navigation/elements';
import {Button, Platform} from 'react-native';
import {Appbar} from 'react-native-paper';

type RootStackParamList = {
  Tabs: undefined;
  Test: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();
const cardStyleInterpolator =
  Platform.OS === 'android'
    ? CardStyleInterpolators.forFadeFromBottomAndroid
    : CardStyleInterpolators.forHorizontalIOS;

const StackNavigator: React.FC<{}> = () => {
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
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
