import React, { useState } from "react";
import 'animate.css/animate.min.css';
import vendorIcon from './VendorImages/Vendor.png';
import Tooltip from './Tooltip';  

import {
  MenuIcon,
  XIcon,
  ChevronLeftIcon
} from "@heroicons/react/outline";

import p1 from '../../assets/images/p1.png';
import p2 from '../../assets/images/growth.png';
import p3 from '../../assets/images/gear.png';
import p4 from '../../assets/images/house.png';
import p5 from '../../assets/images/Ordermgt.png';
import p6 from '../../assets/images/Invoice.png';

const Sidebar = ({ setActiveComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showVendorText, setShowVendorText] = useState(false);

  const handleMouseEnter = (event) => {
    event.currentTarget.classList.add('animate-spin');
  };

  const handleMouseLeave = (event) => {
    event.currentTarget.classList.remove('animate-spin');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setShowVendorText(!isOpen); 
  };

  const handleSectionClick = (section) => {
    setActiveComponent(section);
    setActiveSection(section);
    setShowVendorText(false); // Hide Vendor text when a section is clicked
  };

  const handleSettingsClick = () => {
    handleSectionClick("profile");
  };

  const renderButton = (section, IconOrImage, label, isImage = false, buttonClassName = "") => (
    <Tooltip text={label}>
      <button
        onClick={() => handleSectionClick(section)}
        className={`flex items-center p-3 space-x-3 rounded-md transition-shadow duration-300 hover:bg-gray-700 transition-colors duration-300 
          ${buttonClassName}
          ${activeSection === section ? "bg-gray-900 text-white border border-teal-500 shadow-teal-500/50 shadow-lg" : "text-black-400"}
          ${section === "home" && showVendorText ? "text-white" : ""}`}
      >
        {isImage ? (
          <img src={IconOrImage} alt={label} className="w-6 h-6" />
        ) : (
          <IconOrImage className="w-6 h-6" />
        )}
        <span className={`text-sm ${!isOpen && "hidden"} truncate`}>{label}</span>
      </button>
    </Tooltip>
  );

  const buttonWidthClass = isOpen ? "w-full" : "w-24"; // Adjust based on your design needs

  return (
    <div
      className={`flex flex-col h-full p-3 bg-gray-800 text-white transition-all duration-300 shadow-2xl ${isOpen ? "w-full md:w-72" : "w-24"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <img
          src={vendorIcon}
          alt="Vendor Icon"
          className={`w-8 h-8 animate-pulse ${showVendorText ? 'ml-2' : ''}`}
        />
        {showVendorText && (
          <h1 className="text-white font-bold ">Vendor</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md focus:outline-none focus:ring"
        >
          {isOpen ? (
            <ChevronLeftIcon className="w-6 h-6 text-white-600" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        {renderButton("home", p4, "Home", true, buttonWidthClass)}
        {renderButton("goods-and-materials", p1, "Goods and Materials", true, buttonWidthClass)}
        {renderButton("stock-management", p2, "Stock Management", true, buttonWidthClass)}
        {renderButton("order-management", p5, "Order Management", true, buttonWidthClass)}
        <Tooltip text="Invoice and Payments">
          <button
            onClick={() => handleSectionClick("invoice-and-payments")}
            className={`flex items-center p-3 space-x-3 rounded-md transition-shadow duration-300 hover:bg-gray-700 transition-colors duration-300
              ${activeSection === "invoice-and-payments" ? "bg-gray-900 text-white border border-teal-500 shadow-teal-500/50 shadow-lg" : "text-black-400"}
              ${buttonWidthClass}`}
          >
            <img src={p6} alt="Invoice and Payments Icon" className="w-6 h-6" />
            <span className={`text-sm ${!isOpen && "hidden"} truncate`}>Invoice and Payments</span>
          </button>
        </Tooltip>
      </div>
      <div className="mt-auto">
        <Tooltip text="Settings">
          <button
            onClick={handleSettingsClick}
            className={`flex items-center p-3 space-x-3 rounded-md transition-shadow duration-300 hover:bg-gray-700 transition-colors duration-300
              ${activeSection === "profile" ? "bg-gray-900 text-white border border-teal-500 shadow-teal-500/50 shadow-lg" : "text-black-400"}
              ${buttonWidthClass}`}
          >
            <img src={p3} alt="Settings Icon" className="w-6 h-6" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
            <span className={`text-sm ${!isOpen && "hidden"} truncate`}>Settings</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
