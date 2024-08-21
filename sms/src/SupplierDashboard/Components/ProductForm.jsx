import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ProductForm = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    product_id: product ? product.product_id : '',
    productName: product ? product.product_name : '',
    quantityAvailable: product ? product.quantity_available : '',
    unitPrice: product ? product.unit_price : '',
    description: product ? product.description : '',
    images: product ? product.images : '',
    // images: product ? product.images : [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="hover:text-red-500 hover:border hover:border-red-500 p-1 rounded-full">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Quantity</label>
            <input
              type="number"
              name="quantityAvailable"
              value={formData.quantityAvailable}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Unit Price</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Specification</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Product Image</label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
              multiple
              required
            />
          </div>
          <div className="flex justify-end">
          <button type="submit" className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-colors duration-300">
            Submit
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
