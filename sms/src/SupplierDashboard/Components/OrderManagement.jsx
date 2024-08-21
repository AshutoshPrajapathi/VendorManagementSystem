import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";

const orders = [
  // {
  //   id: 12345,
  //   date: "2024-05-01",
  //   customer: "ABC Corp",
  //   status: "Shipped",
  //   amount: 500,
  // },
  // {
  //   id: 12346,
  //   date: "2024-05-02",
  //   customer: "XYZ Inc",
  //   status: "In Progress",
  //   amount: 1200,
  // },
  // {
  //   id: 12347,
  //   date: "2024-05-03",
  //   customer: "LMN Ltd",
  //   status: "Delivered",
  //   amount: 800,
  // },
  // More orders...
];

const CreatingNewOrder = ({ showPurchaseOrderModal, onClose }) => {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const handleSave = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!customerName) newErrors.customerName = "Customer name is required";
    if (!amount) newErrors.amount = "Amount is required";
    if (!description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length === 0) {
      const order = {
        orderDate: new Date().toISOString().split("T")[0],
        customerName,
        amount,
        description,
      };
      console.log("Order saved:", order);
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  if (!showPurchaseOrderModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2 md:mx-0 transition-transform transform-gpu scale-105">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">New Order</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Date
            </label>
            <input
              type="text"
              value={new Date().toISOString().split("T")[0]}
              readOnly
              className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.customerName ? "border-red-500" : ""
              }`}
              placeholder="Customer Name"
              required
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.amount ? "border-red-500" : ""
              }`}
              placeholder="Amount"
              required
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Description"
              rows="4"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition-transform transform-gpu hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderManagement = ({ user_id }) => {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPurchaseOrderModal, setShowPurchaseOrderModal] = useState(false);
  const ordersPerPage = 10;
  const [orderData, setOrderData] = useState(orders);

  //fetch orders data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/v1/orders/vendor/${user_id}`
        );
        // Handle the response data
        setOrderData(response.data.orders);
      } catch (error) {
        // Handle any errors
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user_id]);

  const fetchOrderDetails = async (vendor_id, order_id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/v1/orders/vendor/${vendor_id}/${order_id}`
      );
      // Handle the response data
      setSelectedOrder(response.data.order);
    } catch (error) {
      // Handle any errors
      console.error("Error fetching order details:", error);
    }
  };

  const updateOrderStatus = async (vendor_id, order_id, newStatus) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/vendor/orders/${vendor_id}/${order_id}`,
        { orderStatus: newStatus }
      );
      if (response.status === 200) {
        handleStatusChange(order_id, newStatus);
      } else {
        console.error("Error updating order status:", response.data);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredOrders = orderData.filter((order) => {
    const queryMatch = searchQuery
      ? order.order_id.toString().includes(searchQuery) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.order_status.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const statusMatch = filterStatus
      ? order.order_status === filterStatus
      : true;
    const dateMatch = filterDate ? order.order_date === filterDate : true;

    return queryMatch && statusMatch && dateMatch;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orderData.map((order) =>
      order.order_id === orderId ? { ...order, order_status: newStatus } : order
    );
    setOrderData(updatedOrders); // Update orders state
    // Update the current order if it's selected
    if (selectedOrder && selectedOrder.order_id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: newStatus });
    }
  };

  const statusColors = {
    Confirmed: "bg-yellow-200 text-yellow-800",
    Shipped: "bg-blue-200 text-blue-800",
    "In Progress": "bg-orange-200 text-orange-800",
    Delivered: "bg-green-200 text-green-800",
    Cancelled: "bg-red-200 text-red-800",
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="In Progress">In Progress</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full px-4 py-2 border-b-2 border-blue-700 rounded-md focus:outline-none"
          />
          <FaSearch className="absolute right-3 top-2 text-gray-400" />
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Customer</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.order_id}>
              <td className="border px-4 py-2">{order.order_id}</td>
              <td className="border px-4 py-2">{order.order_date}</td>
              <td className="border px-4 py-2">{order.customer_name}</td>
              <td className="border px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                    statusColors[order.order_status]
                  }`}
                >
                  {order.order_status}
                </span>
              </td>
              <td className="border px-4 py-2">{order.total_price}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => fetchOrderDetails(user_id, order.order_id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <select
                  onChange={(e) =>
                    updateOrderStatus(user_id, order.order_id, e.target.value)
                  }
                  className="ml-2 p-1 border border-gray-300 rounded-md"
                  value={order.order_status}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p className="mb-2">
              <strong>Order ID:</strong> {selectedOrder.order_id}
            </p>
            <p className="mb-2">
              <strong>Date:</strong> {selectedOrder.order_date}
            </p>
            <p className="mb-2">
              <strong>Customer:</strong> {selectedOrder.customer_name}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {selectedOrder.order_status}
            </p>
            <p className="mb-2">
              <strong>Amount:</strong> {selectedOrder.total_price}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowPurchaseOrderModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Order
        </button>
      </div>
      <CreatingNewOrder
        showPurchaseOrderModal={showPurchaseOrderModal}
        onClose={() => setShowPurchaseOrderModal(false)}
      />
    </div>
  );
};

export default OrderManagement;
