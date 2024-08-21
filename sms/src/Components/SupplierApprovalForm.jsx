import React, { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import "tailwindcss/tailwind.css";

const SupplierApprovalForm = () => {
  const [supplierDetails, setSupplierDetails] = useState({
    companyName: "",
    contactPerson: "",
    contactNumber: "",
    emailAddress: "",
  });
  const [approvalStatus, setApprovalStatus] = useState("");
  const [comments, setComments] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const form = new FormData();
    if (validateForm()) {
      form.append("company_name", supplierDetails.companyName);
      form.append("contact_person", supplierDetails.contactPerson);
      form.append("number", supplierDetails.contactNumber);
      form.append("email", supplierDetails.emailAddress);
      form.append("approval_status", approvalStatus);
      form.append("leave_comments", comments);
    }
    console.log(form.get("leave_comments"));
    try {
      await axios
        .post("http://127.0.0.1:5000/api/supplier_approval", form)
        .then((res) => console.log(res.data));
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating invoice");
    }
  };

  const validateForm = () => {
    if (
      !supplierDetails.companyName ||
      !supplierDetails.contactPerson ||
      !supplierDetails.contactNumber ||
      !supplierDetails.emailAddress
    ) {
      return false;
    }
    return true;
  };

  return (
    <div className="container mx-auto">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Supplier Approval Form
        </h1>
        <h2 className="text-lg font-semibold mb-6">Supplier Details</h2>
        <div className="mb-6">
          <input
            type="text"
            className={`w-1/9 input border-4 rounded-md p-2 mb-4 ${
              formSubmitted && !supplierDetails.companyName && "border-red-500"
            }`}
            placeholder="Company Name"
            value={supplierDetails.companyName}
            onChange={(e) =>
              setSupplierDetails({
                ...supplierDetails,
                companyName: e.target.value,
              })
            }
            required
          />
          {formSubmitted && !supplierDetails.companyName && (
            <p className="text-red-500">* Required</p>
          )}
          <input
            type="text"
            className={`input border-4 rounded-md p-2 mb-4 m-1 ${
              formSubmitted &&
              !supplierDetails.contactPerson &&
              "border-red-500"
            }`}
            placeholder="Contact Person"
            value={supplierDetails.contactPerson}
            onChange={(e) =>
              setSupplierDetails({
                ...supplierDetails,
                contactPerson: e.target.value,
              })
            }
            required
          />
          {formSubmitted && !supplierDetails.contactPerson && (
            <p className="text-red-500">* Required</p>
          )}
          <input
            type="text"
            className={`input border-4 rounded-md p-2 mb-4 ${
              formSubmitted &&
              !supplierDetails.contactNumber &&
              "border-red-500"
            }`}
            placeholder="Contact Number"
            value={supplierDetails.contactNumber}
            onChange={(e) =>
              setSupplierDetails({
                ...supplierDetails,
                contactNumber: e.target.value,
              })
            }
            required
          />
          {formSubmitted && !supplierDetails.contactNumber && (
            <p className="text-red-500">* Required</p>
          )}
          <input
            type="email"
            className={`input border-4 rounded-md p-2 mb-4 m-1 ${
              formSubmitted && !supplierDetails.emailAddress && "border-red-500"
            }`}
            placeholder="Email Address"
            value={supplierDetails.emailAddress}
            onChange={(e) =>
              setSupplierDetails({
                ...supplierDetails,
                emailAddress: e.target.value,
              })
            }
            required
          />
          {formSubmitted && !supplierDetails.emailAddress && (
            <p className="text-red-500">* Required</p>
          )}
        </div>

        <h2 className="text-lg font-semibold mb-6">Approval Status</h2>
        <div className="mb-6">
          <div className="flex items-center">
            <button
              type="button"
              className={`mr-4 py-2 px-4 rounded transition duration-300 ${
                approvalStatus === "Approved"
                  ? "bg-green-500 text-white transform scale-105 hover:scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setApprovalStatus("Approved")}
            >
              <FaCheck className="mr-2" />
              Approve
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded transition duration-300 ${
                approvalStatus === "Rejected"
                  ? "bg-red-500 text-white transform scale-105 hover:scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setApprovalStatus("Rejected")}
            >
              <FaTimes className="mr-2" />
              Reject
            </button>
          </div>
          {approvalStatus && (
            <div
              className={`mt-4 p-4 ${
                approvalStatus === "Approved" ? "bg-green-100" : "bg-red-100"
              } rounded-md`}
            >
              <h3 className="text-lg font-semibold">
                {approvalStatus === "Approved"
                  ? "Supplier Approved"
                  : "Supplier Rejected"}
              </h3>
              <p className="mt-2">
                {approvalStatus === "Approved"
                  ? "Approved suppliers are granted access to the system."
                  : "Rejected suppliers are notified accordingly."}
              </p>
            </div>
          )}
        </div>

        <h2 className="text-lg font-semibold mb-6">Leave Comments</h2>
        <div className="mb-6">
          <textarea
            className=" w-full input border-4 rounded-md p-2 mb-4"
            rows="4"
            placeholder="Write Comments..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierApprovalForm;
