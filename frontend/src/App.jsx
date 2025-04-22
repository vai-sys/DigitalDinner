import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Navbar from './pages/Navbar';
import { AuthProvider } from './context/Acontext';
import PrivateRoute from './components/PrivateRoutes';
import MenuPage  from './pages/MenuPage'
import MenuItemDetail from './pages/MenuItemDetail'
import CategoryPage  from './pages/CategoryPage'
import OrderManagement from './pages/OrderManagement';
import ShoppingCart from './pages/ShoppingCart'
import Checkout from './pages/Checkout';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />

<Route 
            path="/cart" 
            element={
              <PrivateRoute>
                <ShoppingCart />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <PrivateRoute>
                <OrderManagement />
              </PrivateRoute>
            } 
          />
              <Route path="/" element={<Navigate to="/login" />} />

              <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<MenuItemDetail />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />

            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;



