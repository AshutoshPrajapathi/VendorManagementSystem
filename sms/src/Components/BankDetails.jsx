import React, { useState, useEffect } from "react";
import { useSupplierData } from "../store/SupplierContext";

const BankDetails = (props) => {
  const { selectedTab, handleToggle, supplierData, updateSupplierData } =
    useSupplierData();

  const { companyName, email, contact, address } = supplierData;

  const [updatedSupplierData, setUpdatedSupplierData] = useState(supplierData);

  useEffect(() => {
    setUpdatedSupplierData(supplierData);
  }, [supplierData]);

  const handleChange = (e, key) => {
    const value = e.target.value;
    console.log(key, value);
    setUpdatedSupplierData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    updateSupplierData(updatedSupplierData);
    axios.post("url", updateSupplierData).then(
      (res = (response) => {
        console.log(response);
      })
    );

    handleToggle();
  };
  return selectedTab === "bankDetail" ? (
    <>
      <section className="flex justify-center items-center absolute inset-0 bg-blue-500 bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-full sm:max-w-screen-lg relative">
          <button
            className="absolute top-0 right-0 p-2 focus:outline-none hover:bg-red-500 hover:rounded-bl-lg hover:rounded-tr-lg"
            onClick={handleToggle}
          >
            <div className="hover:text-white">
              <svg
                className="h-6 w-6 text-gray-500 hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </button>

          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Bank Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="bankcompanyname" className="block mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankcompanyname"
                  value={updatedSupplierData.bankName || ""}
                  onChange={(e) => handleChange(e, "bankName")}
                  className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter bank name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="bankemail" className="block mb-2">
                  Branch
                </label>
                <input
                  type="email"
                  id="bankemail"
                  value={updatedSupplierData.branch || ""}
                  onChange={(e) => handleChange(e, "branch")}
                  className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter branch"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="bankcontact" className="block mb-2">
                  Account No
                </label>
                <input
                  type="number"
                  id="bankcontact"
                  value={updatedSupplierData.accno || ""}
                  onChange={(e) => handleChange(e, "accno")}
                  className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter account number"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="bankaddress" className="block mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  id="bankaddress"
                  value={updatedSupplierData.ifsc || ""}
                  className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter IFSC code"
                  onChange={(e) => handleChange(e, "ifsc")}
                  required
                />
              </div>
            </div>
          </div>

          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </section>
    </>
  ) : null;
};

export default BankDetails;
