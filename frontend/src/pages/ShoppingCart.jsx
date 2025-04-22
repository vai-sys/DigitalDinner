import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Acontext';
import api from '../utils/api';

const ShoppingCart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load cart');
      setLoading(false);
      console.error(err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setLoading(true);
      await api.put(`/cart/${itemId}`, { quantity: newQuantity });
      fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
      setLoading(false);
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      setError('Failed to remove item');
      setLoading(false);
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await api.delete('/cart');
      setCart({ items: [], total: 0 });
      setLoading(false);
    } catch (err) {
      setError('Failed to clear cart');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading && !cart.items.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <p className="mt-2 text-gray-600">Review your items before checkout</p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded-md border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {cart.items.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
          <div className="mt-6">
            <Link to="/menu" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              Browse Menu
            </Link>
          </div>
        </div>
      ) : (
        <div className="md:flex md:space-x-6">
          <div className="md:w-2/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">{cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}</h2>
                  <button 
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.id} className="p-6">
                    <div className="flex items-center">
                      {item.menuItem.image ? (
                        <img 
                          src={`https://digitaldinner-4lwi.onrender.com/uploads/${item.menuItem.image}`} 
                          alt={item.menuItem.name} 
                          className="h-16 w-16 object-cover rounded-md mr-4"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {item.menuItem.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.menuItem.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-800 border-l border-r border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <div className="text-base font-medium text-gray-900">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-800 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-base text-gray-600">Subtotal</p>
                  <p className="text-base font-medium text-gray-900">${cart.total.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-base text-gray-600">Tax</p>
                  <p className="text-base font-medium text-gray-900">${(cart.total * 0.075).toFixed(2)}</p>
                </div>
                
                <div className="h-px bg-gray-200 my-4"></div>
                
                <div className="flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-bold text-gray-900">${(cart.total + cart.total * 0.075).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 px-4 rounded-md font-medium transition"
                >
                  Proceed to Checkout
                </button>
                
                <Link
                  to="/menu"
                  className="flex justify-center items-center w-full mt-4 text-amber-700 hover:text-amber-800 text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;