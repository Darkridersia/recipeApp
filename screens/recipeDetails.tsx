// screens/recipeDetails.tsx
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Recipe} from '../types';
import {RootStackParamList} from '../App';
import {loadRecipes, saveRecipes} from '../utils/storage';
import recipeImgs from '../utils/recipeImgs';

type RecipeDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecipeDetails'
>;
type RecipeDetailsRouteProp = RouteProp<RootStackParamList, 'RecipeDetails'>;

const RecipeDetails = () => {
  const navigation = useNavigation<RecipeDetailsNavigationProp>();
  const route = useRoute<RecipeDetailsRouteProp>();
  const {recipeId} = route.params;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const findRecipe = async () => {
      setIsLoading(true);

      try {
        // testing for loading
        console.log('Details: Calling loadRecipes...');

        const allRecipes = await loadRecipes();

        const foundRecipe = allRecipes.find(r => r.id === recipeId);

        if (isMounted) {
          if (foundRecipe) {
            setRecipe(foundRecipe);
          } else {
            Alert.alert('Error', 'Recipe not found', [
              {text: 'OK', onPress: () => navigation.goBack()},
            ]);
          }
        }
      } catch (error) {
        console.error('Error loading recipes: ', error);

        if (isMounted) {
          Alert.alert('Error', 'Could not load recipe details');

          navigation.goBack();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    findRecipe();

    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  const handleEdit = () => {
    if (recipe) {
      navigation.navigate('AddRecipe', {recipeId: recipe.id});
    }
  };

  const handleDelete = () => {
    if (!recipe) return;

    Alert.alert(
      'Confirm Delete',
      `You confirm want to delete this "${recipe.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentRecipes = await loadRecipes();
              const updatedRecipes = currentRecipes.filter(
                r => r.id !== recipe.id,
              );

              await saveRecipes(updatedRecipes);

              navigation.goBack();
            } catch (error) {
              console.error('Error deleting recipe: ', error);
              Alert.alert('Error', 'Could not delete recipe');
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={
          recipeImgs[recipe.imageName]
            ? recipeImgs[recipe.imageName]
            : recipeImgs['default.jpeg']
        }
        style={styles.image}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={`ing-${index}`} style={styles.listItem}>
            • {ingredient}
          </Text> // Added unique key prefix
        ))}

        <Text style={styles.sectionTitle}>Steps:</Text>
        {recipe.steps.map((step, index) => (
          <Text key={`step-${index}`} style={styles.listItem}>
            {index + 1}. {step}
          </Text> // Added unique key prefix
        ))}
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button title="Edit" onPress={handleEdit} color="#ffa000" />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Delete" onPress={handleDelete} color="#d32f2f" />
        </View>
      </View>
    </ScrollView>
  );
};

export default RecipeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
