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
import {loadRecipes} from '../utils/storage';
import recipeImgs from '../utils/recipeImgs';
import recipeTypeData from '../assets/data/recipeTypes.json';

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
          const loadedRecipes = await loadRecipes();

          setRecipes(loadedRecipes);
          setFilteredRecipes(loadedRecipes);
          setRecipeTypes(recipeTypeData as RecipeType[]);
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
  };

  const navigateToAddRecipe = () => {
    console.log('Navigate to Add Recipe Screen');

    navigation.navigate('AddRecipe', {});
  };

  const renderRecipeItem = ({item}: {item: Recipe}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToDetails(item.id)}>
      <Image source={recipeImgs[item.imageName]} style={styles.itemImage} />

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
    backgroundColor: '#f8f8f8', // Light background
  },
  pickerContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff', // White background for picker
  },
  picker: {
    height: 50,
    width: '100%',
  },
  listContentContainer: {
    paddingBottom: 80, // Add padding at the bottom so the add button doesn't overlap the last item
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 2, // Simple shadow for Android
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
    resizeMode: 'cover', // Ensure image covers the area
  },
  itemTextContainer: {
    flex: 1, // Allow text to take remaining space
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Darker text color
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ee', // Example primary color
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
    lineHeight: 30, // Adjust for vertical centering if needed
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50, // More margin top
    fontSize: 16,
    color: '#666',
  },
});

// 👇 Make sure this line exists at the bottom!
export default RecipeList;
