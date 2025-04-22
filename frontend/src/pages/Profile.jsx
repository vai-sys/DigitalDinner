import React, { useContext } from 'react';
import { AuthContext } from '../context/Acontext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  // Extract user data with fallbacks
  const name = user?.name || 'User';
  const email = user?.email || 'email@example.com';
  const phoneNumber = user?.phoneNumber || 'Not provided';
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg rounded-lg overflow-hidden max-w-md mx-auto mt-17">
      <div className="bg-blue-600 p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-white text-blue-600 mx-auto flex items-center justify-center text-3xl font-bold mb-4">
          {name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-white">{name}</h1>
        <p className="text-blue-200">Member since {new Date().getFullYear()}</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3">
            Account Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-700">{email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-gray-700">{phoneNumber}</p>
            </div>
          </div>
        </div>
        
        
        
       
      </div>
    </div>
  );
};

export default Profile;