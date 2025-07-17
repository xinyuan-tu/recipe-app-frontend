import React from 'react';
import type { Recipe } from '../types';

type ResultsProps = {
  recipe: Recipe | null;
  isLoading: boolean;
  error: string;
};

const Results: React.FC<ResultsProps> = ({ recipe, isLoading, error }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!recipe) {
    return <div>Your search results will appear here.</div>;
  }

  return (
    <div className="recipe-card">
      <h1>{recipe.foodName}</h1>
      <p className="description">{recipe.description}</p>
      
      <div className="details">
        <span><strong>Time:</strong> {recipe.estimatedTime}</span>
        <span><strong>Servings:</strong> {recipe.servings}</span>
        <span><strong>Difficulty:</strong> {recipe.difficulty}</span>
      </div>

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ing, index) => (
          <li key={index}>
            {ing.quantity} {ing.name} {ing.notes && <span>({ing.notes})</span>}
          </li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol>
        {recipe.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      {recipe.notes && (
        <>
          <h2>Notes</h2>
          <p>{recipe.notes}</p>
        </>
      )}
    </div>
  );
};

export default Results; 