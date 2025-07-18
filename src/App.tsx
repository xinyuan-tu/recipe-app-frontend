import { useState } from 'react';
import './App.css';
import History from './components/History';
import Search from './components/Search';
import Results from './components/Results';
import type { Recipe } from './types';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [recipeCache, setRecipeCache] = useState<{ [key: string]: Recipe }>({});
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleSearch = async (query: string) => {
    setActiveSearch(query);
    if (!history.includes(query)) {
      setHistory(prevHistory => [query, ...prevHistory]);
    }

    setIsLoading(true);
    setError('');
    setRecipe(null);

    if (recipeCache[query]) {
      const cachedRecipe = recipeCache[query];
      setRecipe(cachedRecipe);
      setImageUrl(cachedRecipe.imageUrl || '');
      setIsLoading(false);
      return;
    }

    setImageUrl(''); // Clear image on new text search
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://recipe-app-backend-efir.onrender.com/api/get-recipe', {
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
      setRecipe(data);
      setRecipeCache(prevCache => ({ ...prevCache, [query]: data }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSearch = async (file: File) => {
    // Create a temporary URL for the image to display it immediately
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl); // Clean up previous object URL
    }
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);

    setIsLoading(true);
    setError('');
    setRecipe(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://recipe-app-backend-efir.onrender.com/api/recipe-from-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get recipe from image. Please try again.');
      }

      const data = await response.json();
      const recipeWithImage = { ...data, imageUrl: objectUrl };

      setActiveSearch(recipeWithImage.foodName);
      if (!history.includes(recipeWithImage.foodName)) {
        setHistory(prevHistory => [recipeWithImage.foodName, ...prevHistory]);
      }
      
      setRecipe(recipeWithImage);
      setRecipeCache(prevCache => ({ ...prevCache, [recipeWithImage.foodName]: recipeWithImage }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div 
        className="sidebar-container"
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <aside className={`sidebar ${isSidebarExpanded ? 'expanded' : ''}`}>
          <div className="sidebar-toggle-icons">
            {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </div>
          <h2>History</h2>
          <History
            items={history}
            activeItem={activeSearch}
            onItemClick={handleSearch}
          />
        </aside>
      </div>
      <main className={`main-content ${!recipe && !isLoading && !error ? 'centered' : ''}`}>
        <div className="search-wrapper">
          <h1>Recipe Finder</h1>
          <div className="search-container">
            <Search onSearch={handleSearch} onImageUpload={handleImageSearch} />
          </div>
        </div>
        <div className="results-container">
          <Results recipe={recipe} isLoading={isLoading} error={error} imageUrl={imageUrl} />
        </div>
      </main>
    </div>
  );
}

export default App;
