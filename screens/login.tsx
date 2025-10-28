import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {loginUser} from '../utils/authService';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen = ({onLoginSuccess}: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both username and password.');

      return;
    }

    setIsAuthenticating(true);

    try {
      await loginUser();

      onLoginSuccess();
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');

      setIsAuthenticating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe App Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title={isAuthenticating ? 'Logging In...' : 'Login'}
          onPress={handleLogin}
          color="#6200ee"
          disabled={isAuthenticating}
        />
      </View>
      {isAuthenticating && (
        <ActivityIndicator
          size="small"
          color="#6200ee"
          style={{marginTop: 15}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },
});

export default LoginScreen;