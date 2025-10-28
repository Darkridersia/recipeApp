import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';
import {Recipe, RecipeType} from '../types';
import {RootStackParamList} from '../App';
// import {loadRecipes} from '../utils/storage';
import recipeImgs from '../utils/recipeImgs';
// import recipeTypeData from '../assets/data/recipeTypes.json';

import { fetchAllRecipes, getRecipeTypes } from '../utils/recipeService';

type RecipeListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecipeList'
>;

const RecipeList = () => {
  const navigation = useNavigation<RecipeListNavigationProp>();

  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = React.useState<Recipe[]>([]);
  const [recipeTypes, setRecipeTypes] = React.useState<RecipeType[]>([]);
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);

        try {
          const loadedRecipes = await fetchAllRecipes();

          setRecipes(loadedRecipes);
          setFilteredRecipes(loadedRecipes);
          setRecipeTypes(getRecipeTypes());
        } catch (error) {
          console.error('Failed to fetch data', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, []),
  );

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(
        recipes.filter(recipe => recipe.typeId === selectedType),
      );
    }
  }, [selectedType, recipes]);

  const navigateToDetails = (recipeId: string) => {
    console.log('Navigate to details for recipe: ', recipeId);

    navigation.navigate('RecipeDetails', {recipeId});
  };

  const navigateToAddRecipe = () => {
    console.log('Navigate to Add Recipe Screen');

    navigation.navigate('AddRecipe', {});
  };

  const renderRecipeItem = ({item}: {item: Recipe}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToDetails(item.id)}>

      <Image source={recipeImgs[item.imageName] ? recipeImgs[item.imageName] : require('../assets/img/default.jpeg')} style={styles.itemImage} />

      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedType}
          onValueChange={itemValue => setSelectedType(itemValue)}
          style={styles.picker}
          mode="dropdown">
          <Picker.Item label="All Types" value="all" />

          {recipeTypes.map(type => (
            <Picker.Item key={type.id} label={type.name} value={type.id} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Recipes found for this type</Text>
        }
        contentContainerStyle={styles.listContentContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={navigateToAddRecipe}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  pickerContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  listContentContainer: {
    paddingBottom: 80,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
    resizeMode: 'cover',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default RecipeList;
