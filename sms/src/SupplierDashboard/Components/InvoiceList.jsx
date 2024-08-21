import React, { useState, useEffect } from 'react';
import { FaSearch, FaDownload, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Import jspdf-autotable library

const InvoiceList = () => {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [items, setItems] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/vendor/invoices');
            console.log('API Response:', response.data); // Debugging line
            if (Array.isArray(response.data)) {
                setItems(response.data);
            } else {
                console.error('Unexpected response data:', response.data);
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setItems([]);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleStatusChange = async (index, status) => {
        const item = items[index];
        console.log('Updating status for:', item.invoiceId, 'to', status); // Debugging line
        try {
            const response = await axios.put(`http://127.0.0.1:5000/api/vendor/invoices/${item.invoiceId}`, {
                status: status // Send status in the request body
            }, {
                headers: {
                    'Content-Type': 'application/json' 
                }
            });
            console.log('Update Response:', response.data); // Debugging line
            const newItems = [...items];
            newItems[index].paymentStatus = status;
            setItems(newItems);
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };
    
    const filteredItems = items.filter((item) => {
        return (
            item.orderId.toLowerCase().includes(filter.toLowerCase()) ||
            item.invoiceId.toLowerCase().includes(filter.toLowerCase()) ||
            item.customerName.toLowerCase().includes(filter.toLowerCase()) ||
            item.productDetails.toLowerCase().includes(filter.toLowerCase()) ||
            item.totalAmount.toString().includes(filter)
        );
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-200 text-yellow-700 border border-yellow-400 rounded-full px-2';
            case 'Fulfilled':
                return 'bg-green-200 text-green-700 border border-green-400 rounded-full px-2';
            case 'Rejected':
                return 'bg-red-200 text-red-700 border border-red-400 rounded-full px-2';
            case 'Completed':
                return 'bg-blue-200 text-blue-700 border border-blue-400 rounded-full px-2';
            case 'Failed':
                return 'bg-red-300 text-red-800 border border-red-600 rounded-full px-2';
            case 'Cancelled':
                return 'bg-gray-200 text-gray-700 border border-gray-400 rounded-full px-2';
            case 'Refunded':
                return 'bg-purple-200 text-purple-700 border border-purple-400 rounded-full px-2';
            default:
                return 'border border-gray-300 rounded-full px-2'; // Default style
        }
    };
    

    const downloadInvoice = (item) => {
        const doc = new jsPDF();
    
        // Define table header
        const headers = [['Invoice ID', 'Order ID', 'Customer Name', 'Product Detail', 'Total Amount', 'Payment Status']];
    
        // Define table data
        const data = [
            [item.invoiceId, item.orderId, item.customerName, item.productDetails, `$${item.totalAmount}`, item.paymentStatus]
        ];
    
        // Set font size and style
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold'); // Setting font family and style
    
        // Add table header
        doc.autoTable({
            startY: 10,
            head: headers,
            body: data,
            theme: 'plain', // Set table theme to plain for simpler styling
            margin: { top: 20 },
            styles: { fontStyle: 'bold', textColor: [0, 0, 0] }, // Set font style and text color
        });
    
        // Save PDF
        doc.save(`${item.invoiceId}.pdf`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handleDetailsClick = (item) => {
        setSelectedInvoice(item);
    };

    const closeDetailsModal = () => {
        setSelectedInvoice(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl mb-4 font-bold">Invoices List</h2>
            <div className="mb-4 flex justify-end items-center w-full">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by any field..."
                        value={filter}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2 border-b-2 border-blue-700 rounded-md focus:outline-none"
                    />
                    <FaSearch className="absolute right-3 top-2 text-gray-400" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="py-3 px-4 border-b text-center">Invoice ID</th>
                            <th className="py-3 px-4 border-b text-center">Order ID</th>
                            <th className="py-3 px-4 border-b text-center">Customer Name</th>
                            <th className="py-3 px-4 border-b text-center">Product Detail</th>
                            <th className="py-3 px-4 border-b text-center">Total Amount</th>
                            <th className="py-3 px-4 border-b text-center">Change Status</th>
                            <th className="py-3 px-4 border-b text-center">Status</th>
                            <th className="py-3 px-4 border-b text-center">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-3 px-4 border-b text-center">{item.invoiceId}</td>
                                <td className="py-3 px-4 border-b text-center">{item.orderId}</td>
                                <td className="py-3 px-4 border-b text-center">{item.customerName}</td>
                                <td className="py-3 px-4 border-b text-center">{item.productDetails}</td>
                                <td className="py-3 px-4 border-b text-center">{item.totalAmount}</td>
                                <td className="py-3 px-4 border-b text-center">
                                    <select
                                        value={item.paymentStatus}
                                        onChange={(e) => handleStatusChange(index, e.target.value)}
                                        className="p-2 border border-gray-300 rounded"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Fulfilled">Fulfilled</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Failed">Failed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Refunded">Refunded</option>
                                    </select>
                                </td>
                                <td className="py-3 px-4 border-b text-center">
                                    <span className={`px-2 py-1 rounded ${getStatusColor(item.paymentStatus)}`}>
                                        {item.paymentStatus}
                                    </span>
                                </td>
                                <td className="py-3 px-4 border-b text-center">
                                    {item.paymentStatus === 'Completed' && (
                                        <button
                                            onClick={() => downloadInvoice(item)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaDownload />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDetailsClick(item)}
                                        className="text-gray-500 hover:text-gray-700 ml-2"
                                    >
                                        <FaInfoCircle />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Previous
                    </button>
                    <div>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-4 py-2 mx-1 ${
                                    currentPage === i + 1 ? 'bg-gray-700 text-white' : 'bg-gray-300'
                                } rounded hover:bg-gray-400`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
            </div>
            {selectedInvoice && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg p-4 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
                        <div className="mb-4">
                            <p><strong>Invoice ID:</strong> {selectedInvoice.invoiceId}</p>
                            <p><strong>Order ID:</strong> {selectedInvoice.orderId}</p>
                            <p><strong>Customer Name:</strong> {selectedInvoice.customerName}</p>
                            <p><strong>Product Details:</strong> {selectedInvoice.productDetails}</p>
                            <p><strong>Total Amount:</strong> ${selectedInvoice.totalAmount}</p>
                            <p><strong>Payment Status:</strong> {selectedInvoice.paymentStatus}</p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={closeDetailsModal}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceList;
