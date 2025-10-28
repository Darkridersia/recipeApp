/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import RecipeListScreen from './screens/recipeList';
import RecipeDetailScreen from './screens/recipeDetails';
import AddRecipeScreen from './screens/addRecipe';
import LoginScreen from './screens/login';

import {checkAuthStatus, logoutUser} from './utils/authService.ts';

export type RootStackParamList = {
  RecipeList: undefined;
  RecipeDetails: {recipeId: string};
  AddRecipe: {recipeId?: string};
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const MainAppNavigator = ({onLogout}: {onLogout: () => void}) => {
  return (
    <Stack.Navigator initialRouteName="RecipeList">
      <Stack.Screen
        name="RecipeList"
        component={RecipeListScreen}
        options={{
          title: 'My Recipes',
          headerRight: () => (
            <Button onPress={onLogout} title="Logout" color="#d32f2f" />
          ),
          headerRightContainerStyle: {paddingRight: 10},
        }}
      />
      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetailScreen}
        options={{title: 'Recipe Details'}}
      />
      <Stack.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{title: 'Add/Edit Recipe'}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  const checkSession = React.useCallback(async () => {
    const status = await checkAuthStatus();
    setIsAuthenticated(status);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logoutUser();

    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <MainAppNavigator onLogout={handleLogout} />
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
    centered: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fff'
    }
});