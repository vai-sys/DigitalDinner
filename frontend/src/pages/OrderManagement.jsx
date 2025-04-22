import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/Acontext';
import api from '../utils/api';

const OrderManagement = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchUserOrders();
    } else {
      setError('You need to be logged in to view your orders');
      setLoading(false);
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/user/${user.id}`);
      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load your orders');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/cancel`);
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'CANCELLED' } : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'CANCELLED' });
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('Failed to cancel order. Only pending orders can be cancelled.');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING': return 'bg-blue-100 text-blue-800';
      case 'READY': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">View your order history and details</p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 border-l-4 border-red-500 mb-6 rounded-md">
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

      {orders.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <p className="text-gray-500 mt-4">
            {error ? 'No orders found' : 'You have no orders yet. Place an order to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-6)}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              
              <div className="p-5">
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                    {order.orderItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex-shrink-0">
                        <div className="h-14 w-14 bg-gray-100 rounded-md overflow-hidden">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:3000/uploads/${item.imageUrl}`}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/api/placeholder/56/56";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-500">+{order.orderItems.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Items</span>
                    <span className="text-sm font-medium text-gray-500">{order.orderItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total</span>
                    <span className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    View Details
                  </button>
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Order #{selectedOrder.id.slice(-6)}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="flex items-center">
                  <span className={`mr-4 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <button
                    onClick={closeOrderDetails}
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-md overflow-hidden">
                        {console.log("item",item)}
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl.startsWith('http') ? item.imageUrl : `https://digitaldinner-4lwi.onrender.com/uploads/${item.imageUrl}`}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/api/placeholder/80/80";
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} × {item.quantity}</p>
                        {item.details && (
                          <p className="mt-1 text-xs text-gray-500">{item.details}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Subtotal</span>
                  <span className="text-sm text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Tax (7.5%)</span>
                  <span className="text-sm text-gray-900">${(selectedOrder.total * 0.075).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">
                    ${(selectedOrder.total + selectedOrder.total * 0.075).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {selectedOrder.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={closeOrderDetails}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;