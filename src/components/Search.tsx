import React, { useState, useRef } from 'react';

type SearchProps = {
  onSearch: (query: string) => void;
  onImageUpload: (file: File) => void;
};

const Search: React.FC<SearchProps> = ({ onSearch, onImageUpload }) => {
  const [query, setQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a food name"
      />
      <button onClick={handleSearchClick}>Search</button>
      <button onClick={handleUploadClick}>Upload Image</button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
    </>
  );
};

export default Search; 