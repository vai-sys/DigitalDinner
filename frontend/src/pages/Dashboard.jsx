import React, { useContext } from 'react';
import { AuthContext } from '../context/Acontext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name}</h2>
        <p className="text-gray-600">
          This is your protected dashboard. Only authenticated users can view this page.
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-2">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <h4 className="font-medium text-blue-700">View Orders</h4>
            <p className="text-sm text-gray-600">Manage your past and current orders</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-md">
            <h4 className="font-medium text-green-700">Browse Menu</h4>
            <p className="text-sm text-gray-600">See what's available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
