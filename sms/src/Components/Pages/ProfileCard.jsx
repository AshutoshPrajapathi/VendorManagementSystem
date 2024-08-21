import React, { useState } from 'react';

const ProfileCard = () => {
  const [mode, setMode] = useState('overview');
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [contact, setContact] = useState('+1234567890');
  const [address, setAddress] = useState('123 Street, City, Zip');

  const toggleMode = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'contact':
        setContact(value);
        break;
      case 'address':
        setAddress(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any necessary actions, such as submitting the edited profile data
    // For simplicity, we'll just toggle the mode
    toggleMode(mode === 'overview' ? 'edit' : 'overview');
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <span
                className={`cursor-pointer ${mode === 'overview' ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => toggleMode('overview')}
              >
                Profile Overview
              </span>
              <span
                className={`cursor-pointer ${mode === 'edit' ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => toggleMode('edit')}
              >
                Edit Profile
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          {mode === 'overview' ? (
            <div>
              <p className="mb-2">
                <span className="font-semibold">Full Name:</span> {fullName}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Email:</span> {email}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Contact:</span> {contact}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {address}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sm:w-96">
              <div className="mb-4">
                <label className="block font-semibold mb-1" htmlFor="fullName">
                  Full Name:
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1" htmlFor="email">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1" htmlFor="contact">
                  Contact:
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={contact}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1" htmlFor="address">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
