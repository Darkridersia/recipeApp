import React from 'react';
import { View, Text } from 'react-native';

const recipeDetails = () => { // Or whatever you named your component
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Recipe List Screen</Text>
    </View>
  );
};

// 👇 Make sure this line exists at the bottom!
export default recipeDetails;