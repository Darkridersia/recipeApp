import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
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
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

  useEffect(() => {
    const types = recipeTypesData as RecipeType[];

    setRecipeTypes(types);

    if (types.length > 0 && !selectedTypeId) {
      setSelectedTypeId(types[0].id);
    }
  }, []);

  useEffect(() => {
    const recipeIdToEdit = route.params?.recipeId;

    if (recipeIdToEdit) {
      setEditingRecipeId(recipeIdToEdit);

      const loadRecipeToEdit = async () => {
        try {
          const allRecipes = await loadRecipes();
          const recipeToEdit = allRecipes.find(r => r.id === recipeIdToEdit);

          if (recipeToEdit) {
            setName(recipeToEdit.name);
            setSelectedTypeId(recipeToEdit.typeId);
            setIngredients(recipeToEdit.ingredients.join('\n'));
            setSteps(recipeToEdit.steps.join('\n'));
          } else {
            Alert.alert('Error', 'Recipe to edit not found');

            navigation.goBack();
          }
        } catch (error) {
          console.error('Error loading recipe to edit:', error);

          Alert.alert('Error', 'Failed to load recipe');
        }
      };
      loadRecipeToEdit();
    } else {
      setEditingRecipeId(null);
      setName('');
      setSelectedTypeId(recipeTypes.length > 0 ? recipeTypes[0].id : '');
      setIngredients('');
      setSteps('');
    }
  }, [route.params?.recipeId, navigation, recipeTypes]);

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

    try {
      const currentRecipes = await loadRecipes();

      let updatedRecipes: Recipe[];

      if (editingRecipeId) {
        updatedRecipes = currentRecipes.map(recipe => {
          if (recipe.id === editingRecipeId) {
            return {
              ...recipe,
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
            };
          }
          return recipe;
        });
        Alert.alert('Success', 'Recipe updated successfully!');

        navigation.navigate('RecipeList');
      } else {
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
          imageName: 'default.jpeg',
        };
        updatedRecipes = [...currentRecipes, newRecipe];

        Alert.alert('Success', 'Recipe added successfully!');
      }

      await saveRecipes(updatedRecipes);
    } catch (error) {
      console.error('Error saving recipe:', error);

      Alert.alert(
        'Error',
        `Could not ${
          editingRecipeId ? 'update' : 'save'
        } recipe. Please try again.`,
      );
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
        style={styles.multilineInput}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Pasta, Eggs, Pancetta.. etc"
        multiline={true}
        numberOfLines={4}
      />

      <Text style={styles.label}>Steps:</Text>

      <TextInput
        style={styles.multilineStepsInput}
        value={steps}
        onChangeText={setSteps}
        placeholder="1. Boil pasta. 2. Cook pancetta.. etc"
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
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  multilineStepsInput: {
    height: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
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
