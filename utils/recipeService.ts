import {Recipe, RecipeType} from '../types';
import {loadRecipes, saveRecipes} from './storage';
import recipeTypesData from '../assets/data/recipeTypes.json';

export const getRecipeTypes = (): RecipeType[] => {
  return recipeTypesData as RecipeType[];
};

export const fetchAllRecipes = async (): Promise<Recipe[]> => {
  return await loadRecipes();
};

export const saveAllRecipes = async (recipes: Recipe[]): Promise<void> => {
  await saveRecipes(recipes);
};
