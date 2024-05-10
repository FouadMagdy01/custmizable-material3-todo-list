import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Tabs: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  ConfirmOtp: undefined;
  ResetPassword: undefined;
};
export type TabsParamList = {
  Home: undefined;
  Settings: undefined;
};
export type HomeScreenParams = BottomTabScreenProps<TabsParamList, 'Home'>;
export type SettingsScreenProps = BottomTabScreenProps<
  TabsParamList,
  'Settings'
>;

export type LoginScreenProps = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, 'Login'>,
  StackScreenProps<RootStackParamList>
>;

export type RegisterScreenProps = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, 'Register'>,
  StackScreenProps<RootStackParamList>
>;

export type ForgetPasswordScreenPassword = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, 'ForgetPassword'>,
  StackScreenProps<RootStackParamList>
>;

export type ConfirmOtp = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, 'ConfirmOtp'>,
  StackScreenProps<RootStackParamList>
>;

export type ResetPasswordScreenProps = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, 'ResetPassword'>,
  StackScreenProps<RootStackParamList>
>;
