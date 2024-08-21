import React, { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import "tailwindcss/tailwind.css";
import axios from "axios";

const InvoiceCreationForm = () => {
  const [supplier, setSupplier] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: "", unitPrice: "", totalAmount: "" },
  ]);

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: "", unitPrice: "", totalAmount: "" },
    ]);
  };

  const handleRemoveLineItem = (index) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems.splice(index, 1);
    setLineItems(updatedLineItems);
  };

  const handleLineItemChange = (index, key, value) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][key] = value;
    setLineItems(updatedLineItems);
  };
  //console.log(supplier, invoiceDate, dueDate, lineItems, paymentTerms);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("select_supplier", supplier);
    form.append("invoice_date", invoiceDate);
    form.append("due_date", dueDate);
    form.append("payment_terms", paymentTerms);

    lineItems.forEach((item) => {
      form.append("description", item.description);
      form.append("quantity", item.quantity);
      form.append("unit_price", item.unitPrice);
      form.append("total_amount", item.totalAmount);
    });

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/invoice_creation",
        form
      );

      Swal.fire({
        title: res.data.message,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error,
        
        
      });
    }
  };

  return (
    <div className="container mx-auto animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl animate-slide-up"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Invoice Creation Form
        </h1>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Supplier Selection
          </label>
          <select
            className="input border-4 rounded-md p-2 w-full hover:border-blue-500 transition duration-300"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          >
            <option value="">Select Supplier</option>
            <option value="supplier1">Supplier 1</option>
            <option value="supplier2">Supplier 2</option>
            <option value="supplier3">Supplier 3</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Invoice Date
          </label>
          <input
            type="date"
            className="input border-4 rounded-md p-2 w-full"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Due Date
          </label>
          <input
            type="date"
            className="input border-4 rounded-md p-2 w-full"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Payment Terms
          </label>
          <input
            type="text"
            className="input border-4 rounded-md p-2 w-full"
            placeholder="e.g., Net 30 Days"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Line Items</h2>
          {lineItems.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <input
                type="text"
                className="input border-4 rounded-md p-2 w-full mr-2"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleLineItemChange(index, "description", e.target.value)
                }
              />
              <input
                type="number"
                className="input border-4 rounded-md p-2 w-1/4 mr-2"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleLineItemChange(index, "quantity", e.target.value)
                }
              />
              <input
                type="number"
                className="input border-4 rounded-md p-2 w-1/4 mr-2"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) =>
                  handleLineItemChange(index, "unitPrice", e.target.value)
                }
              />
              <input
                type="number"
                className="input border-4 rounded-md p-2 w-1/4 mr-2"
                placeholder="Total Amount"
                value={item.totalAmount}
                onChange={(e) =>
                  handleLineItemChange(index, "totalAmount", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveLineItem(index)}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLineItem}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Line Item
          </button>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="btn bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceCreationForm;
