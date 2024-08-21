import axios from "axios";
import React, { useEffect, useState } from "react";

const InvoiceSubForm = () => {
  const [formData, setFormData] = useState({
    invoice_number: "",
    date: "",
    amount: "",
    attached_documents: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      attached_documents: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("invoice_number", formData.invoice_number);
    form.append("date", formData.date);
    form.append("amount", formData.amount);
    form.append("attached_documents", formData.attached_documents);

    try {
      await axios
        .post("http://127.0.0.1:5000/api/invoice", form)
        .then((res) => console.log(res.data));
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating invoice");
    }
  };

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:5000/api/invoice")
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((error) => {
//         console.log("Error fetchng data", error);
//       });
//   }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Invoice Submission Form
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="invoice_number"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Invoice Number
          </label>
          <input
            type="text"
            name="invoice_number"
            id="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
            placeholder="Enter Invoice Number"
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Invoice Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Invoice Amount
          </label>
          <input
            type="text"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter Invoice Amount"
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="attachedDocuments"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Attached Documents
          </label>
          <input
            type="file"
            name="attached_documents"
            id="attachedDocuments"
            onChange={handleFileChange}
            multiple
            className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
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

export default InvoiceSubForm;
