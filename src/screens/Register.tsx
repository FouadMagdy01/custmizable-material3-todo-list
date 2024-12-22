import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Icon, Text, TextInput} from 'react-native-paper';
import {RegisterScreenProps} from '../navigation/types';
import ScreenWrapper from '../components/ScreenWrapper';

const Register = ({navigation}: RegisterScreenProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <ScreenWrapper
      withScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon source="account-plus" size={80} />
        <Text style={{marginVertical: 8}} variant="headlineMedium">
          Sign up
        </Text>
      </View>
      <View
        style={{
          width: '90%',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            gap: 8,
          }}>
          <TextInput mode="outlined" label="First Name" style={{flex: 1}} />
          <TextInput mode="outlined" label="Last Name" style={{flex: 1}} />
        </View>
        <TextInput
          mode="outlined"
          label="Email"
          style={{width: '100%', marginTop: 8}}
        />
        <TextInput
          mode="outlined"
          right={<TextInput.Icon icon="eye" />}
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
            marginBottom: 16,
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
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Register;
