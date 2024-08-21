import React, { useState } from "react";
import axios from "axios";
import { Menu } from "@headlessui/react";
import { FaTrash, FaPlus } from "react-icons/fa";

const PurchaseOrderForm = () => {
  const suppliers = [
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ];

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [lineItems, setLineItems] = useState([
    { id: 1, description: "", quantity: "", unitPrice: "", totalAmount: "" },
  ]);
  const [supplierProfileLink, setSupplierProfileLink] = useState("");

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][field] = value;
    setLineItems(updatedLineItems);
  };

  const addLineItem = () => {
    const newLineItem = {
      id: lineItems.length + 1,
      description: "",
      quantity: "",
      unitPrice: "",
      totalAmount: "",
    };
    setLineItems([...lineItems, newLineItem]);
  };

  const deleteLineItem = (index) => {
    const updatedLineItems = lineItems.filter((item, i) => i !== index);
    setLineItems(updatedLineItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("select_supplier", selectedSupplier.name);
    form.append("order_date", orderDate);
    form.append("delivery_date", deliveryDate);
    lineItems.forEach((item) => {
      form.append("product", item.description);
      form.append("quantity", item.quantity);
      form.append("unit_price", item.unitPrice);
      form.append("total_amount", item.totalAmount);
    });
    form.append("supplier_profile_link", supplierProfileLink);

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/purchase_order", form);
      console.log(res.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating invoice");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Purchase Order Form
        </h1>
        <div className="mb-8">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                {selectedSupplier ? selectedSupplier.name : "Select Supplier"}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm12-2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Menu.Button>
            </div>
            <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {suppliers.map((supplier) => (
                <Menu.Item key={supplier.id}>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedSupplier(supplier)}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block w-full text-left px-4 py-2 text-sm text-gray-900`}
                    >
                      {supplier.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <label
              htmlFor="orderDate"
              className="block text-sm font-medium text-gray-700"
            >
              Order Date
            </label>
            <input
              type="date"
              id="orderDate"
              placeholder="Select Order Date"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border-2 p-2"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="deliveryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Delivery Date
            </label>
            <input
              type="date"
              id="deliveryDate"
              placeholder="Select Delivery Date"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border-2 p-2"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Line Items</h2>
          {lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
              <input
                type="text"
                placeholder="Product/Service Description"
                className="input-field border border-gray-500 rounded-md p-2"
                value={item.description}
                onChange={(e) =>
                  handleLineItemChange(index, "description", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                className="input-field border border-gray-500 rounded-md p-2"
                value={item.quantity}
                onChange={(e) =>
                  handleLineItemChange(index, "quantity", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Unit Price"
                className="input-field border border-gray-500 rounded-md p-2"
                value={item.unitPrice}
                onChange={(e) =>
                  handleLineItemChange(index, "unitPrice", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Total Amount"
                className="input-field border border-gray-500 rounded-md p-2"
                value={item.totalAmount}
                onChange={(e) =>
                  handleLineItemChange(index, "totalAmount", e.target.value)
                }
                required
              />
              <button
                type="button"
                onClick={() => deleteLineItem(index)}
                className="bg-red-500 text-white py-2 px-4 w-20 rounded-full hover:bg-red-600 transition duration-300 flex items-center justify-center"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLineItem}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center "
          >
            <FaPlus />Add Line Item
          </button>
        </div>
        <div className="mb-4">
          <label
            htmlFor="supplierProfileLink"
            className="block text-sm font-medium text-gray-700"
          >
            Supplier Profile Link
          </label>
          <input
            type="text"
            id="supplierProfileLink"
            placeholder="Enter Supplier Profile Link"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border-2 p-2"
            value={supplierProfileLink}
            onChange={(e) => setSupplierProfileLink(e.target.value)}
            required
          />
        </div>

        {selectedSupplier && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Supplier Details</h2>
            <p>Supplier Name: {selectedSupplier.name}</p>
          </div>
        )}

        {selectedSupplier && (
          <div>
            <a
              href={`/supplier/${selectedSupplier.id}`}
              className="text-blue-500 hover:underline"
            >
              View Supplier Profile
            </a>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
