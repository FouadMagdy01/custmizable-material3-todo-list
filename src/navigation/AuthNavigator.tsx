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
import Login from '../screens/Auth/Login/LoginScreen';
import {AuthStackParamList, RootStackParamList} from './types';
import Register from '../screens/Auth/Register/RegisterScreen';
import auth from '@react-native-firebase/auth';
const Stack = createStackNavigator<AuthStackParamList>();
const cardStyleInterpolator =
  Platform.OS === 'android'
    ? CardStyleInterpolators.forFadeFromBottomAndroid
    : CardStyleInterpolators.forHorizontalIOS;

const AuthNavigator: React.FC<{}> = () => {
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
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
