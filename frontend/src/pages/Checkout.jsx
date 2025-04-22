import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/Acontext';
import api from '../utils/api';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      const cartData = response.data.data;
      
      if (cartData.items.length === 0) {
        navigate('/menu');
        return;
      }
      
      setCart(cartData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load cart');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const calculateTax = () => {
    return cart.total * 0.075;
  };

  const calculateTotal = () => {
    return cart.total + calculateTax();
  };

  const validateForm = () => {
    if (!contactInfo.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!contactInfo.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!contactInfo.email.trim()) {
      setError('Email is required');
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setProcessing(true);
      setError(null);
      
      // First update user information if needed
      if (
        user.name !== contactInfo.name ||
        user.phoneNumber !== contactInfo.phoneNumber ||
        user.email !== contactInfo.email
      ) {
        await api.put('/users/profile', {
          name: contactInfo.name,
          phoneNumber: contactInfo.phoneNumber,
          email: contactInfo.email
        });
      }
      
      // Then create the order
      const orderResponse = await api.post('/orders');
      
      setNewOrderId(orderResponse.data.data.id);
      setOrderSuccess(true);
      setProcessing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
      setProcessing(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for your order. Your order has been placed and will be prepared shortly.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700">Order Number: <span className="font-medium">#{newOrderId.slice(-6)}</span></p>
            <p className="mt-1 text-gray-700">Total Amount: <span className="font-medium">${calculateTotal().toFixed(2)}</span></p>
          </div>
          
          <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              to={`/orders`}
              className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-6 rounded-md font-medium transition"
            >
              View Order
            </Link>
            <Link
              to="/menu"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md font-medium transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-2 text-gray-600">Complete your order</p>
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

      <div className="md:flex md:space-x-6">
        <div className="md:w-2/3">
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmitOrder}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={contactInfo.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={contactInfo.phoneNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={contactInfo.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="payment-card"
                    name="payment-method"
                    type="radio"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <label htmlFor="payment-card" className="ml-3 block text-sm font-medium text-gray-700">
                    Pay at restaurant (Card)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="payment-cash"
                    name="payment-method"
                    type="radio"
                    checked={paymentMethod === 'CASH'}
                    onChange={() => setPaymentMethod('CASH')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <label htmlFor="payment-cash" className="ml-3 block text-sm font-medium text-gray-700">
                    Pay at restaurant (Cash)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id} className="flex py-6 px-6">
                  <div className="flex-1 flex">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                      {item.menuItem.image ? (
                        <img 
                          src={`http://localhost:3000/uploads/${item.menuItem.image}`} 
                          alt={item.menuItem.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-gray-900">
                            {item.menuItem.name}
                          </h3>
                          <p className="ml-4 text-base font-medium text-gray-900">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Qty {item.quantity} × ${item.menuItem.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="md:w-1/3 mt-6 md:mt-0">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-base text-gray-600">Subtotal</p>
                <p className="text-base font-medium text-gray-900">${cart.total.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-base text-gray-600">Tax (7.5%)</p>
                <p className="text-base font-medium text-gray-900">${calculateTax().toFixed(2)}</p>
              </div>
              
              <div className="h-px bg-gray-200 my-4"></div>
              
              <div className="flex justify-between">
                <p className="text-base font-medium text-gray-900">Total</p>
                <p className="text-lg font-bold text-gray-900">${calculateTotal().toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleSubmitOrder}
                disabled={processing}
                className={`w-full bg-amber-700 hover:bg-amber-800 text-white py-3 px-4 rounded-md font-medium transition flex justify-center items-center ${
                  processing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
              
              <Link
                to="/cart"
                className="flex justify-center items-center w-full mt-4 text-amber-700 hover:text-amber-800 text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;