import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView, // To allow scrolling if content is long
  Alert,
  Platform, // For platform-specific styles if needed
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';

import {Recipe, RecipeType} from '../types';
import {loadRecipes, saveRecipes} from '../utils/storage';
import recipeTypesData from '../assets/data/recipeTypes.json';
import {RootStackParamList} from '../App';

type AddRecipeNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddRecipe'
>;
type AddRecipeRouteProp = RouteProp<RootStackParamList, 'AddRecipe'>;

const AddRecipe = () => {
  const navigation = useNavigation<AddRecipeNavigationProp>();
  const route = useRoute<AddRecipeRouteProp>();

  const [name, setName] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [recipeTypes, setRecipeTypes] = useState<RecipeType[]>([]);

  useEffect(() => {
    const types = recipeTypesData as RecipeType[];

    setRecipeTypes(types);

    if (types.length > 0 && !selectedTypeId) {
      setSelectedTypeId(types[0].id);
    }
  }, []);

  const handleSaveRecipe = async () => {
    if (
      !name.trim() ||
      !selectedTypeId ||
      !ingredients.trim() ||
      !steps.trim()
    ) {
      Alert.alert('Missing Information', 'Pls fill in all fields.');

      return;
    }

    const newRecipe: Recipe = {
      id: `Recipe_${Date.now()}`,
      name: name.trim(),
      typeId: selectedTypeId,
      ingredients: ingredients
        .split('\n')
        .map(ing => ing.trim())
        .filter(ing => ing),
      steps: steps
        .split('\n')
        .map(line => line.trim())
        .filter(line => line),
      imageName: 'default.jpg',
    };

    try {
      const currentRecipes = await loadRecipes();
      const updatedRecipes = [...currentRecipes, newRecipe];

      await saveRecipes(updatedRecipes);

      Alert.alert('Success', 'Recipe saved successfully!');

      navigation.goBack();
    } catch (error) {
      console.error('Error saving recipe:', error);

      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Recipe Name:</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Recipe Name"
      />

      <Text style={styles.label}>Recipe Type:</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTypeId}
          onValueChange={itemValue => setSelectedTypeId(itemValue)}
          style={styles.picker}
          mode="dropdown">
          <Picker.Item
            label="Select Type"
            value=""
            enabled={false}
            style={{color: '#999'}}
          />

          {recipeTypes.map(type => (
            <Picker.Item key={type.id} label={type.name} value={type.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Ingredients:</Text>

      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Pasta, Eggs, Pancetta"
        multiline={true}
        numberOfLines={4}
      />

      <Text style={styles.label}>Steps:</Text>

      <TextInput
        style={styles.input}
        value={steps}
        onChangeText={setSteps}
        placeholder="1. Boil pasta. 2. Cook pancetta..."
        multiline={true}
        numberOfLines={6}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Save Recipe"
          onPress={handleSaveRecipe}
          color="#6200ee"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8', // Consistent background
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15, // Add more space between fields
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10, // Slightly more padding
    fontSize: 16,
    backgroundColor: '#fff', // White input background
    marginBottom: 10,
  },
  multilineInput: {
    height: 120, // Make ingredients taller
    textAlignVertical: 'top', // Start text from the top on Android
  },
  multilineStepsInput: {
    height: 150, // Make steps even taller
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 25,
    marginBottom: 50,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default AddRecipe;
