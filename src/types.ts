export interface Recipe {
  foodName: string;
  description: string;
  estimatedTime: string;
  servings: string;
  difficulty: string;
  ingredients: Array<{ name: string; quantity: string; notes?: string }>;
  instructions: string[];
  notes?: string;
} 