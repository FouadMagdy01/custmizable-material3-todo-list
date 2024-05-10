import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Appearance,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {
  Button,
  Icon,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboardHeight} from '../hooks/useKeyboard';
import {useNavigation} from '@react-navigation/native';
import {LoginScreenProps} from '../navigation/types';
let loading = true;
const Login = ({navigation}: LoginScreenProps) => {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const materialTheme = useTheme();
  const keyboardHeight = useKeyboardHeight();
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      style={[
        styles.container,
        {
          marginTop: insets.top,
          marginBottom: insets.bottom,
          maxHeight: dimensions.height - keyboardHeight,
        },
      ]}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon source="checkbox-marked-circle-outline" size={80} />
        <Text style={{marginTop: 8}} variant="headlineMedium">
          Sign in
        </Text>
      </View>
      <View
        style={{
          width: '90%',
        }}>
        <TextInput mode="outlined" label="Email" style={{width: '100%'}} />
        <TextInput
          mode="outlined"
          label="Password"
          style={{width: '100%', marginTop: 8}}
        />
        {/* <Text
          style={{
            marginTop: 8,
            color: materialTheme.colors.error,
          }}>
          Invalid email or password
        </Text> */}
        <Button
          style={{
            marginTop: 8,
            alignSelf: 'flex-end',
          }}
          mode="text"
          onPress={() => {}}>
          Forget password?
        </Button>
        <Button
          disabled={loading}
          loading={loading}
          style={{
            width: '100%',
            marginTop: 24,
          }}
          onPress={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigation.navigate('Tabs');
            }, 3000);
          }}
          mode="contained">
          Sign In
        </Button>
        <Button
          disabled={loading}
          style={{
            width: '100%',
            marginTop: 16,
          }}
          mode="elevated"
          icon="google"
          onPress={() => {}}>
          Sign In with google
        </Button>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          width: '90%',
        }}>
        <Button
          disabled={loading}
          style={{
            width: '100%',
          }}
          mode="outlined"
          onPress={() => {
            navigation.navigate('Register');
          }}>
          Create new account
        </Button>
        <Button
          disabled={loading}
          style={{
            marginTop: 8,
            width: '100%',
          }}
          mode="text"
          onPress={() => {}}>
          Continue as a guest
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Login;
