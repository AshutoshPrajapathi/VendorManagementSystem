import axios from 'axios';
import React, { useState, useMemo } from 'react';
import { FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import debounce from 'lodash/debounce';

const StockManagement = ({ user_id, stockData }) => {
    const [filter, setFilter] = useState('');
    const [products, setProducts] = useState(stockData);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    let filteredProducts = products.filter((product) => {
        const productId = typeof product.productId === 'string' ? product.productId.toLowerCase() : '';
        const productName = typeof product.productName === 'string' ? product.productName.toLowerCase() : '';
        return (
            productId.includes(filter.toLowerCase()) ||
            productName.includes(filter.toLowerCase())
        );
    });

    const handleStockChange = (productId, value) => {
        const newStockLevel = Number(value);
        setProducts(products.map(product =>
            product.productId === productId ? { ...product, updatedStock: newStockLevel } : product
        ));

        // Debounced function to send request to backend
        debounceUpdateStock(productId, newStockLevel);
    };

    // Debounce the backend call
    const debounceUpdateStock = useMemo(() => debounce((productId, value) => {
        axios.put(`http://127.0.0.1:5000/api/vendor/${user_id}/stock/${productId}/${value}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => console.error("Error updating stock", error));
    }, 5000), []);

    // Pagination calculations
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl mb-4 font-bold ">Stock Management</h2>
            <div className="mb-4 flex justify-end items-center w-full">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by product ID or name..."
                        value={filter}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2 border-b-2 border-blue-700 rounded-md focus:outline-none"
                    />
                    <FaSearch className="absolute right-3 top-2 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="py-3 px-4 border-b text-center">Product ID</th>
                            <th className="py-3 px-4 border-b text-center">Product Name</th>
                            <th className="py-3 px-4 border-b text-center">Current Stock</th>
                            <th className="py-3 px-4 border-b text-center">Update Stock</th>
                            <th className="py-3 px-4 border-b text-center">Stock Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product, index) => {
                            const totalStock = product.currentStockLevel + (product.updatedStock || 0);
                            return (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-3 px-4 border-b text-center">{product.productId}</td>
                                    <td className="py-3 px-4 border-b text-center">{product.productName}</td>
                                    <td className="py-3 px-4 border-b text-center">{totalStock}</td>
                                    <td className="py-3 px-4 border-b text-center">
                                        <input
                                            type="number"
                                            value={product.updatedStock || ''}
                                            onChange={(e) => handleStockChange(product.productId, e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            placeholder="Update Stock"
                                            min="1"
                                        />
                                    </td>
                                    <td className="py-3 px-4 border-b text-center">
                                        <span className={`py-1 px-2 rounded-full text-sm font-semibold ${totalStock < 1 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                            {totalStock < 1 ? (
                                                <>
                                                    <FaTimesCircle className="inline-block mr-1" /> Out of Stock
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle className="inline-block mr-1" /> In Stock
                                                </>
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    className="px-3 py-1 mx-1 rounded-full bg-gray-300 hover:bg-gray-400"
                >
                    &laquo;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 mx-1 rounded-full ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    className="px-3 py-1 mx-1 rounded-full bg-gray-300 hover:bg-gray-400"
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default StockManagement;
