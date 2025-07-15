import { useState } from 'react';
import './App.css';
import History from './components/History';
import Search from './components/Search';
import Results from './components/Results';

function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [recipeCache, setRecipeCache] = useState<{ [key: string]: string }>({});

  const handleSearch = async (query: string) => {
    if (!history.includes(query)) {
      setHistory(prevHistory => [query, ...prevHistory]);
    }

    setIsLoading(true);
    setError('');
    setRecipe('');

    if (recipeCache[query]) {
      setRecipe(recipeCache[query]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/get-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodName: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipe. Please try again.');
      }

      const data = await response.json();
      setRecipe(data.recipe);
      setRecipeCache(prevCache => ({ ...prevCache, [query]: data.recipe }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>History</h2>
        <History items={history} onItemClick={handleSearch} />
      </aside>
      <main className="main-content">
        <h1>Recipe Finder</h1>
        <div className="search-container">
          <Search onSearch={handleSearch} />
        </div>
        <div className="results-container">
          <Results recipe={recipe} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
}

export default App;
