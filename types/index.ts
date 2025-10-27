export interface RecipeType{
    id: string;
    name: string;
}

export interface Recipe{
    id: string;
    typeId: string;
    name: string;
    ingredients: string[];
    steps: string[];
    imageName: string;
}