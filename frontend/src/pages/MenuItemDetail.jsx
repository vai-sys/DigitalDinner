import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const MenuItemDetail = () => {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await api.get(`/menu/${id}`);
        setMenuItem(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu item');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      const response = await api.post('/cart', {
        menuItemId: id,
        quantity: 1
      });
      
      // Show success message
      setNotification({
        type: 'success',
        message: `${menuItem.name} added to cart!`
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.error || 'Failed to add item to cart'
      });
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner"></div>
        <p className="mt-4">Loading menu item...</p>
      </div>
    );
  }

  if (error || !menuItem) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error || 'Menu item not found'}</p>
        <Link 
          to="/menu"
          className="mt-4 inline-block bg-amber-700 text-white px-4 py-2 rounded"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {notification && (
        <div className={`mb-4 p-4 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}

      <Link 
        to="/menu"
        className="inline-flex items-center mb-6 text-amber-700 hover:text-amber-900"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Menu
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {menuItem.image ? (
            <img 
            src={`https://digitaldinner-4lwi.onrender.com/uploads/${menuItem.image}`} 
            alt={menuItem.name} 
            className="w-full h-64 md:h-full object-cover"
          />
          
            ) : (
              <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{menuItem.name}</h1>
                <p className="text-gray-500 mb-4">{menuItem.category}</p>
              </div>
              <span className="text-2xl font-bold text-amber-700">${menuItem.price.toFixed(2)}</span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{menuItem.description}</p>
            </div>

            {menuItem.ingredients && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
                <p className="text-gray-700">{menuItem.ingredients}</p>
              </div>
            )}

            {menuItem.nutritionalInfo && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Nutritional Information</h2>
                <p className="text-gray-700">{menuItem.nutritionalInfo}</p>
              </div>
            )}
            
            <button 
              className={`bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg w-full text-lg transition ${addingToCart ? 'opacity-75 cursor-not-allowed' : ''}`}
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;