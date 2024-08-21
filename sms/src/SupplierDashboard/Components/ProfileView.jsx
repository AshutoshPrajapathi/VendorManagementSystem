import React, { useState } from "react";
import { FaUser, FaUniversity } from "react-icons/fa";

const ProfileView = ({ profile }) => {
  const [activeSection, setActiveSection] = useState("profile");

  const handleSectionToggle = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-2xl mx-auto bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold text-center">Profile View</h2>
          <div className="flex justify-center my-4">
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div className="p-6 border-b flex justify-center">
            <div className="flex space-x-4">
              <button
                className={`flex items-center p-2 ${
                  activeSection === "profile"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleSectionToggle("profile")}
              >
                <FaUser />
                <span className="ml-1">Profile</span>
              </button>

              <button
                className={`flex items-center p-2 ${
                  activeSection === "bank"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleSectionToggle("bank")}
              >
                <FaUniversity />
                <span className="ml-1">Bank Details</span>
              </button>
            </div>
          </div>
          <div className="transition-all duration-300 relative">
            {activeSection === "profile" && (
              <div className="p-6 border-b">
                <p className="mt-1">
                  <strong>Company Name:</strong> {profile.companyname}
                </p>
                <p className="mt-1">
                  <strong>Email address:</strong> {profile.email}
                </p>
                <p className="mt-1">
                  <strong>Contact:</strong> {profile.phone_number}
                </p>
                <p className="mt-1">
                  <strong>Location:</strong> {profile.location}
                </p>
              </div>
            )}
            
            {/* Bank Details */}
            {activeSection === "bank" && (
              <div className="p-6 border-b">
                <p className="mt-1">
                  <strong>Bank Name:</strong> {profile.bank_name}
                </p>
                <p className="mt-1">
                  <strong>Account:</strong> {profile.account}
                </p>
                <p className="mt-1">
                  <strong>Branch:</strong> {profile.branch}
                </p>
                <p className="mt-1">
                  <strong>IFSC:</strong> {profile.ifsc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
