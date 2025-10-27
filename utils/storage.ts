import AsyncStorage from "@react-native-async-storage/async-storage";
import {Recipe} from "../types";
import initialRecipesData from '../assets/data/recipes.json';

const recipes_storage_key = "@RecipeApp:recipes";

export const loadRecipes = async (): Promise<Recipe[]> => {
    try{
        const storedRecipes = await AsyncStorage.getItem(recipes_storage_key);

        if(storedRecipes !== null){
            return JSON.parse(storedRecipes) as Recipe[];
        } else {
            console.log("No recipes in AsyncStorage. Loading initial data...");

            const initialRecipes: Recipe[] = initialRecipesData as Recipe[];

            await saveRecipes(initialRecipes);

            return initialRecipes;
        }
    }catch (error){
        console.error("Error loading recipes:", error);

        return initialRecipesData as Recipe[];
    }
}

export const saveRecipes = async (recipes: Recipe[]): Promise<void> => {
    try{
        const jsonValue = JSON.stringify(recipes);

        await AsyncStorage.setItem(recipes_storage_key, jsonValue);

        console.log("Recipes saved to AsyncStorage.");
    }catch (error){
        console.error("Error saving recipes:", error);
    }
}

export const clearRecipes = async (): Promise<void> => {
    try{
        await AsyncStorage.removeItem(recipes_storage_key);

        console.log("Recipes cleared from AsyncStorage.");
    }catch (error){
        console.error("Error clearing recipes:", error);
    }
}