import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Appearance,
  ScrollView,
  useWindowDimensions,
  Animated,
  Keyboard,
  KeyboardEvent,
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

const Login = ({navigation}: LoginScreenProps) => {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const materialTheme = useTheme();
  const keyboardHeight = useKeyboardHeight();
  const containerHeight = useRef(
    new Animated.Value(dimensions.height - insets.top),
  ).current;

  const handleKeyboardWillShow = (event: KeyboardEvent) => {
    Animated.timing(containerHeight, {
      toValue: dimensions.height - (event.endCoordinates.height + insets.top),
      duration: event.duration,
      useNativeDriver: false,
    }).start();
  };

  const handleKeyboardWillHide = () => {
    Animated.timing(containerHeight, {
      toValue: dimensions.height - insets.top,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  React.useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardWillShow,
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardWillHide,
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <Animated.ScrollView
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
          maxHeight: containerHeight,
        },
      ]}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
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
          marginTop: 16,
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
            marginBottom: insets.bottom,
          }}
          mode="text"
          onPress={() => {}}>
          Continue as a guest
        </Button>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Login;
