import React from 'react';

type ResultsProps = {
  recipe: string;
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
    <div>
      <h2>Recipe</h2>
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {recipe}
      </pre>
    </div>
  );
};

export default Results; 