import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import React from 'react';
import {getHeaderTitle} from '@react-navigation/elements';
import {Platform} from 'react-native';
import {Appbar} from 'react-native-paper';
import Login from '../screens/Auth/Login/LoginScreen';
import {AuthStackParamList} from './types';
import RegisterScreen from '../screens/Auth/Register/RegisterScreen';
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
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
