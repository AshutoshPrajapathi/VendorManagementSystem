import axios from "axios";
import React, { useState } from "react";

const SupplierPayHisForm = () => {
  const [formData, setFormData] = useState({
    supplierName: "",
    invoiceNumber: "",
    invoiceDate: "",
    invoiceAmount: "",
    paymentDate: "",
    paymentAmount: "",
    paymentMethod: "",
    transactionReference: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("supplier_name", formData.supplierName);
    form.append("invoice_number", formData.invoiceNumber);
    form.append("date", formData.invoiceDate);
    form.append("amount", formData.invoiceAmount);
    form.append("payment_date", formData.paymentDate);
    form.append("payment_amount", formData.paymentAmount);
    form.append("payment_method", formData.paymentMethod);
    form.append("transaction_reference", formData.transactionReference);
    console.log(form.get("transaction_reference"))
   


    try {
      await axios
        .post("http://127.0.0.1:5000/api/supplier_payment", form)
        .then((res) => console.log(res.data));
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating invoice");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Supplier Payment History Form
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="supplierName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Supplier Name
          </label>
          <input
            type="text"
            name="supplierName"
            id="supplierName"
            value={formData.supplierName}
            onChange={handleInputChange}
            placeholder="Enter Supplier Name"
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="invoiceNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Invoice Number
          </label>
          <input
            type="text"
            name="invoiceNumber"
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleInputChange}
            placeholder="Enter Invoice Number"
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="invoiceDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Invoice Date
          </label>
          <input
            type="date"
            name="invoiceDate"
            id="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleInputChange}
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="invoiceAmount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Invoice Amount
          </label>
          <input
            type="number"
            name="invoiceAmount"
            id="invoiceAmount"
            value={formData.invoiceAmount}
            onChange={handleInputChange}
            placeholder="Enter Invoice Amount"
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="paymentDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Payment Date
          </label>
          <input
            type="date"
            name="paymentDate"
            id="paymentDate"
            value={formData.paymentDate}
            onChange={handleInputChange}
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="paymentAmount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Payment Amount
          </label>
          <input
            type="number"
            name="paymentAmount"
            id="paymentAmount"
            value={formData.paymentAmount}
            onChange={handleInputChange}
            placeholder="Enter Payment Amount"
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="paymentMethod"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Payment Method
          </label>
          <input
            type="text"
            name="paymentMethod"
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            placeholder="Enter Payment Method"
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="transactionReference"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Transaction Reference
          </label>
          <input
            type="text"
            name="transactionReference"
            id="transactionReference"
            value={formData.transactionReference}
            onChange={handleInputChange}
            placeholder="Enter Transaction Reference"
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SupplierPayHisForm;
