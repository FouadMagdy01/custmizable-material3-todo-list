import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  EmailVerification: { email: string };
  Task: {
    todo?: import('../types/appTypes').TaskItem;
    mode?: 'create' | 'edit';
  } | undefined;
};
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  EmailVerification: { email: string };
  ForgetPassword: undefined;
  ConfirmOtp: undefined;
  ResetPassword: undefined;
};
export type TabsParamList = {
  Home: undefined;
  Settings: undefined;
};

export type TaskScreenProps = StackScreenProps<RootStackParamList, 'Task'>;
export type HomeScreenParams = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Home'>,
  StackScreenProps<RootStackParamList>
>;

export type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Settings'>,
  StackScreenProps<RootStackParamList>
>;

export type LoginScreenProps = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, 'Login'>,
  StackScreenProps<RootStackParamList>
>;

export type RegisterScreenProps = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, 'Register'>,
  StackScreenProps<RootStackParamList>
>;

export type EmailVerificationScreenProps = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, 'EmailVerification'>,
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
