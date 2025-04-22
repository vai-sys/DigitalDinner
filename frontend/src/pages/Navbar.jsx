import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Acontext';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [miniCart, setMiniCart] = useState({ items: [], total: 0 });
  const [loadingCart, setLoadingCart] = useState(false);

 
  const fetchCartData = async () => {
    if (!user) return;
    
    try {
      setLoadingCart(true);
      const response = await api.get('/cart');
      const cartData = response.data.data;
      
      setMiniCart(cartData);
      setLoadingCart(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoadingCart(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleCartDropdown = () => {
    if (!cartDropdownOpen && user) {
      fetchCartData();
    }
    setCartDropdownOpen(!cartDropdownOpen);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCartData();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const cartCount = user ? miniCart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-white text-xl font-bold">Digital Diner</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <button 
                onClick={toggleCartDropdown}
                className="text-white mr-4 relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/menu" 
              className="text-white hover:text-blue-300 transition-colors text-sm font-medium"
            >
              Menu
            </Link>
            
            {user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={toggleCartDropdown}
                    className="text-white hover:text-blue-300 transition-colors text-sm font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Cart dropdown */}
                  {cartDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50">
                      <div className="p-3 border-b border-gray-100">
                        <h3 className="font-medium text-gray-800">Your Cart</h3>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {loadingCart ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        ) : miniCart.items.length === 0 ? (
                          <div className="py-6 text-center text-gray-500">
                            Your cart is empty
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {miniCart.items.map(item => (
                              <div key={item.id} className="flex p-3 hover:bg-gray-50">
                                <div className="flex-1 pr-3">
                                  <h4 className="text-sm font-medium text-gray-800">{item.menuItem.name}</h4>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {item.quantity} × ${item.menuItem.price.toFixed(2)}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-800">
                                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                                  </span>
                                  <button 
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="ml-3 text-gray-400 hover:text-red-500"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 border-t border-gray-100">
                        {miniCart.items.length > 0 && (
                          <div className="flex justify-between mb-3">
                            <span className="font-medium text-gray-800">Total:</span>
                            <span className="font-bold text-gray-800">${miniCart.total.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => {
                              navigate('/cart');
                              setCartDropdownOpen(false);
                            }}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md text-sm font-medium"
                          >
                            View Cart
                          </button>
                          {miniCart.items.length > 0 && (
                            <button
                              onClick={() => {
                                navigate('/checkout');
                                setCartDropdownOpen(false);
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium"
                            >
                              Checkout
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link to="/orders" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
                  My Orders
                </Link>
                
                <div className="relative group">
                  <button className="text-white hover:text-blue-300 transition-colors text-sm font-medium flex items-center">
                    <span className="mr-1">{user.name || 'Account'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        My Profile
                      </Link>
                     
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 bg-black/90 rounded-lg mt-1 backdrop-blur-lg">
            <div className="flex flex-col space-y-1">
              <Link 
                to="/menu" 
                className="text-white hover:text-blue-300 py-2 px-3 rounded-md hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/cart" 
                    className="text-white hover:text-blue-300 py-2 px-3 rounded-md hover:bg-white/10 transition-colors flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                 
                  <Link 
                    to="/profile" 
                    className="text-white hover:text-blue-300 py-2 px-3 rounded-md hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:text-blue-300 py-2 px-3 rounded-md hover:bg-white/10 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-white hover:text-blue-300 py-2 px-3 rounded-md hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {cartDropdownOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setCartDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;