import AsyncStorage  from "@react-native-async-storage/async-storage";

const user_token_key = "@RecipeApp:userToken";
const token = "123"

export const checkAuthStatus = async (): Promise<boolean> => {
    try{
        const token = await AsyncStorage.getItem(user_token_key);

        return !!token;
    }catch (error){
        console.error("AuthService: Error checking auth status: ", error);

        return false;
    }
};

export const loginUser = async (): Promise<void> => {
    try{
        await AsyncStorage.setItem(user_token_key, token);
    } catch (error){
        console.error("AuthService: Error Logging in:", error);

        throw new Error("Failed to save session");
    }
};

export const logoutUser = async (): Promise<void> => {
    try{
        await AsyncStorage.removeItem(user_token_key);

        console.log("AuthService: User logged out successfully.");
    } catch (error){
        console.error("AuthService: Error Logging out:", error);
    }
};