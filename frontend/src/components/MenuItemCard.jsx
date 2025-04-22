import React from 'react';
import { Link } from 'react-router-dom';

const MenuItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 overflow-hidden">
        {item.image ? (
          <img 
            src={`http://localhost:3000/uploads/${item.image}`} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-gray-600 mt-1 line-clamp-2 h-12">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-amber-700 font-bold">${item.price.toFixed(2)}</span>
          <Link 
            to={`/menu/${item._id}`} 
            className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
