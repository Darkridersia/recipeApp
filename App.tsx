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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import recipeListScreen from './screens/recipeList';
import recipeDetailScreen from './screens/recipeDetails';
import addRecipeScreen from './screens/addRecipe';

export type RootStackParamList = {
  RecipeList: undefined;
  RecipeDetails: {recipeId: string};
  AddRecipe: {recipeId?: string};
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RecipeList">
          <Stack.Screen
            name="RecipeList"
            component={recipeListScreen}
            options={{title: 'My Recipes'}}
          />

          <Stack.Screen
            name="RecipeDetails"
            component={recipeDetailScreen}
            options={{title: 'Recipe Details'}}
          />

          <Stack.Screen
            name="AddRecipe"
            component={addRecipeScreen}
            options={{title: 'Add / Edit Recipe'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
