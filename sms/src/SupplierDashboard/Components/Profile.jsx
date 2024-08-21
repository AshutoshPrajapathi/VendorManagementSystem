import React, { useState, useRef } from "react";
import axios from "axios";
import { FaEdit, FaUser, FaUniversity, FaPlus } from "react-icons/fa";

const Profile = ({ profile, setProfile, isOpen, sessionId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [editableProfile, setEditableProfile] = useState({ ...profile });
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      if (activeSection === "profile") {
        await axios.put(`http://127.0.0.1:5000/api/update_user_details/${sessionId}`, {
          email: editableProfile.email,
          phone_number: editableProfile.phone_number,
          companyname: editableProfile.companyname,
          location: editableProfile.location,
        });
      } else if (activeSection === "bank") {
        await axios.put(`http://127.0.0.1:5000/api/update_bank_details/${sessionId}`, {
          bank_name: editableProfile.bank_name,
          account: editableProfile.account,
          branch: editableProfile.branch,
          ifsc: editableProfile.ifsc,
        });
      }
      setProfile({ ...editableProfile });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const handleCancelClick = () => {
    setEditableProfile({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditableProfile({ ...editableProfile, profileImage: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSectionToggle = (section) => {
    setActiveSection(section);
    setIsEditing(false);
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`flex justify-center items-center h-screen ${isOpen ? "ml-6" : ""}`}>
      <div className="max-w-2xl mx-auto bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold">My Profile</h2>

          <div className="p-6 border-b flex items-center justify-center relative">
            <div className="relative">
              <img
                src={editableProfile.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full mr-4"
              />
              {isEditing && (
                <FaPlus
                  className="absolute bottom-0 right-0 text-white bg-blue-500 rounded-full p-1 cursor-pointer"
                  onClick={handleChooseFileClick}
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
          <div className="p-6 border-b flex justify-start">
            <div className="flex space-x-4">
              <button
                className={`flex items-center p-2 ${activeSection === "profile" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleSectionToggle("profile")}
              >
                <FaUser />
                <span className="ml-1">Profile</span>
              </button>

              <button
                className={`flex items-center p-2 ${activeSection === "bank" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleSectionToggle("bank")}
              >
                <FaUniversity />
                <span className="ml-1">Bank Details</span>
              </button>
            </div>
          </div>
          <div className="transition-all duration-300 relative">
            {activeSection === "profile" && (
              <div className="p-6 border-b relative">
                <button
                  className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900 flex items-center"
                  onClick={handleEditClick}
                >
                  <FaEdit />
                  <span className="ml-1">Edit</span>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-black-1000">
                      <strong>Company Name</strong>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="companyname"
                        value={editableProfile.companyname}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    ) : (
                      <p className="mt-1">{editableProfile.companyname}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black-1000">
                      <strong>Email address</strong>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editableProfile.email}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    ) : (
                      <p className="mt-1">{editableProfile.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black-1000">
                      <strong>Contact</strong>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone_number"
                        value={editableProfile.phone_number}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    ) : (
                      <p className="mt-1">{editableProfile.phone_number}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black-1000">
                      <strong>Location</strong>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editableProfile.location}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    ) : (
                      <p className="mt-1">{editableProfile.location}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeSection === "bank" && (
              <div className="p-6 border-b relative">
                <button
                  className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900 flex items-center"
                  onClick={handleEditClick}
                >
                  <FaEdit />
                  <span className="ml-1">Edit</span>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-black-1000">
                      <strong>Bank Name</strong>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="bank_name"
                        value={editableProfile.bank_name}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    ) : (
                      <p className="mt-1">{editableProfile.bank_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black-1000">
                      <strong>Account Number</strong>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="account"
                        value={editableProfile.account}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    ) : (
                      <p className="mt-1">{editableProfile.account}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black-1000">
                      <strong>Branch</strong>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="branch"
                        value={editableProfile.branch}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    ) : (
                      <p className="mt-1">{editableProfile.branch}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-black-1000">
                      <strong>IFSC Code</strong>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="ifsc"
                        value={editableProfile.ifsc}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    ) : (
                      <p className="mt-1">{editableProfile.ifsc}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {isEditing && (
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
