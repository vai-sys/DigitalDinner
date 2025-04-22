import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import MenuItemCard from '../components/MenuItemCard';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const response = await api.get(`/menu/category/${categoryName}`);
        setMenuItems(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load category items');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCategoryItems();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner"></div>
        <p className="mt-4">Loading {categoryName} items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
        <Link 
          to="/menu"
          className="mt-4 inline-block bg-amber-700 text-white px-4 py-2 rounded"
        >
          View Full Menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <Link 
          to="/menu"
          className="text-amber-700 hover:text-amber-900"
        >
          View Full Menu
        </Link>
      </div>

      {menuItems.length === 0 ? (
        <div className="text-center py-12">
          <p>No items found in this category.</p>
          <Link 
            to="/menu"
            className="mt-4 inline-block bg-amber-700 text-white px-4 py-2 rounded"
          >
            View Full Menu
          </Link>
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

export default CategoryPage;