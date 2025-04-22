import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MenuItemCard from '../components/MenuItemCard';
import CategoryFilter from '../components/CategoryFilter';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
       
        const url = activeCategory 
          ? `/menu?category=${activeCategory}&available=true` 
          : '/menu?available=true';
          
        const response = await api.get(url);
        setMenuItems(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu items');
        setLoading(false);
        console.error(err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/menu');
       
        const allCategories = response.data.data
          .map(item => item.category)
          .filter((value, index, self) => self.indexOf(value) === index);
        setCategories(allCategories);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    fetchMenuItems();
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [activeCategory, categories.length]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner"></div>
        <p className="mt-4">Loading menu items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-amber-700 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>
      
      <CategoryFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {menuItems.length === 0 ? (
        <div className="text-center py-12">
          <p>No menu items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;