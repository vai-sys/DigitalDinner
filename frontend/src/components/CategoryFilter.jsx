import React from 'react';

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setActiveCategory('')}
        className={`px-4 py-2 rounded-full transition ${
          activeCategory === '' 
            ? 'bg-amber-700 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full transition ${
            activeCategory === category 
              ? 'bg-amber-700 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;