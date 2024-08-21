// import {React, useState} from "react";
// import {SearchIcon,
// UserIcon,} from "@heroicons/react/outline";
// import { SupplierDataProvider } from "./store/SupplierContext";
// import Profile from "./Components/Profile1";
// import Profile from "./SupplierDashboard/Components/Profile";
// import Sidebar from "./SupplierDashboard/Components/Sidebar";
// import Login from "./Components/Login";
// import SignUp from "./Components/SignUp";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import PurchaseOrderForm from "./Components/PurchaseOrderForm";
// import SupplierApprovalForm from "./Components/SupplierApprovalForm";
// import InvoiceCreationForm from "./Components/InvoiceCreationForm";
// import InvoiceSubForm from "./Components/InvoiceSubForm";
// import SupplierPayHisForm from "./Components/SupplierPayHisForm";
// const App = () => {
//   const [showDropdown, setShowDropdown] = useState(false);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const handleLogout = () => {
//     // Implement logout functionality
//     console.log('Logout clicked');
//   };

//   return (
//     <Router>
//       <div className="flex h-screen">
//         <Sidebar />
//         <div className="flex flex-col w-full">
//           <nav className="bg-gray-900 text-white h-16 flex justify-between items-center px-4">
//             <div className="flex items-center">
//               <button className="text-lg text-white focus:outline-none">
//                 <SearchIcon className="w-6 h-6" />
//               </button>
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="bg-gray-800 text-white px-2 py-1 rounded-md ml-2 focus:outline-none"
//               />
//             </div>
//             <div className="relative">
//               <div
//                 className="rounded-full bg-gray-700 p-2 border border-gray-600 cursor-pointer"
//                 onClick={toggleDropdown}
//               >
//                 <UserIcon className="w-6 h-6" />
//               </div>
//               {showDropdown && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
//                   <div className="py-2 px-4 border-b">
//                     <span className="text-gray-800">Profile</span>
//                   </div>
//                   <div className="py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
//                     <span className="text-gray-800">Logout</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </nav>
//           <div className="flex-grow p-4 overflow-auto">
//             <Routes>

//               <Route path="/settings" element={<Profile />} />
//               {/* Add other routes here */}
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
//};

// export default App;

// import React, { useState }  from 'react';
// // src/App.js

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Sidebar from './SupplierDashboard/Components/Sidebar';
// import Navbar from './SupplierDashboard/Components/Navbar';

// function App() {
//   return (
//     <Router>
//       <div className="flex">
//         <Sidebar />
//         <div className="flex-1">
//           <Navbar />
//           <div className="p-4">
//             <Routes>
//               <Route path="/" element={<div>Home Content</div>} />
//               <Route path="/dashboard" element={<div>Dashboard Content</div>} />
//               <Route path="/products" element={<div>Products Content</div>} />
//               <Route path="/customer" element={<div>Customer Content</div>} />
//               <Route path="/order" element={<div>Order Content</div>} />
//               <Route path="/wallet" element={<div>Wallet Content</div>} />
//               <Route path="/documents" element={<div>Documents Content</div>} />
//               <Route path="/settings" element={<div>Settings Content</div>} />
//               <Route path="/logout" element={<div>Logout Content</div>} />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useState } from "react";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardTest from "./Components/DashboardTest";
import StockManagement from "./SupplierDashboard/Components/StockManagement";
import SalesReport from "./SupplierDashboard/Components/SalesReport";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [token, setToken] = useState(null);
  const handleLogin = (dataFromLogin) => {
    setLoggedIn(dataFromLogin);
  };
  const getSessionId = (session) => {
    setSessionId(session);
  };
  const getToken = (tokenValue) => {
    // console.log(tokenValue)

    setToken(tokenValue);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route
              path="/"
              exact
              element={
                <Login
                  handleLogin={handleLogin}
                  getSessionId={getSessionId}
                  getToken={getToken}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardTest
                  sessionId={sessionId}
                  loggedIn={loggedIn}
                  handleLogin={handleLogin}
                  token={token}
                />
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/salesreport" element={<SalesReport />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
