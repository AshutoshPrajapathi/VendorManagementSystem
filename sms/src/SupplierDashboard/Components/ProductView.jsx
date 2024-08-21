import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { FiCloudLightning } from 'react-icons/fi';

const ProductView = ({ product, onClose }) => {
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Product Details</h2>
          <button onClick={onClose} className="hover:text-red-500 hover:border hover:border-red-500 p-1 rounded-full">
            <FaTimes />
          </button>
        </div>
        <div className="mb-4">
          <strong>Product Name:</strong> {product.product_name}
        </div>
        <div className="mb-4">
          <strong>Quantity:</strong> {product.quantity_available}
        </div>
        <div className="mb-4">
          <strong>Unit Price:</strong> ${product.unit_price}
        </div>
        <div className="mb-4">
          <strong>Description:</strong> {product.description}
        </div>
        <div className="mb-4">
          <strong>Image:</strong> <img src={product.image_links[0]} alt={product.product_name} className='h-[150px] w-[150px] m-2' />
        </div>
      </div>
    </div>
  );
};

export default ProductView;
