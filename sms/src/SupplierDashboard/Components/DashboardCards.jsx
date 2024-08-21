import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import shoppingCartImage from "../../assets/images/i1.png";
import userImage from "../../assets/images/i2.png";
import userGroupImage from "../../assets/images/i4.png";
import kidsImage from "../../assets/images/i3.png";

const ProgressBar = ({ percentage, color }) => (
  <div className="w-full mt-2 flex items-center">
    <div className="w-full bg-gray-300 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
    <div className="ml-2 text-sm text-gray-700">{percentage}%</div>
  </div>
);

const DashboardCards = () => {
  const getIndicator = (value) => {
    return value > 0 ? (
      <span className="text-green-500 flex items-center">
        <FontAwesomeIcon icon={faArrowUp} className="mr-1" /> {value}%
      </span>
    ) : (
      <span className="text-red-500 flex items-center">
        <FontAwesomeIcon icon={faArrowDown} className="mr-1" /> {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="card relative w-full md:max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-6 flex flex-col justify-center items-center card-body cursor-pointer transform transition-transform hover:scale-105 border-4 border-white">
          <div className="absolute left-[-1px] top-1/10 transform -translate-y-2/4 w-16 h-16 rounded-full bg-lime-500 flex items-center justify-center shadow-lg">
            <img src={shoppingCartImage} alt="Sales" className="w-10 h-10"/>
          </div>
          <div className="text-center mt-6">
            <div className="font-bold text-lg mb-2">Total Products</div>
            <p className="text-gray-700 text-base">$2000</p>
            <p className="text-gray-500 text-sm">Better than last week (25%)</p>
            <ProgressBar percentage={25} color="#4CAF50" />
          </div>
        </div>

        <div className="card relative w-full md:max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-6 flex flex-col justify-center items-center card-body cursor-pointer transform transition-transform hover:scale-105">
          <div className="absolute left-[-1px] top-1/7 transform -translate-y-2/4 w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
            <img src={userImage} alt="Subscriptions" className="w-10 h-10"/>
          </div>
          <div className="text-center mt-6">
            <div className="font-bold text-lg mb-2">Total Orders</div>
            <p className="text-gray-700 text-base">200</p>
            <p className="text-gray-500 text-sm">Worse than last week (25%)</p>
            <ProgressBar percentage={25} color="#F44336" />
          </div>
        </div>

        <div className="card relative w-full md:max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-6 flex flex-col justify-center items-center card-body cursor-pointer transform transition-transform hover:scale-105">
          <div className="absolute left-[-1px] top-1/7 transform -translate-y-2/4 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
            <img src={userGroupImage} alt="Traffic" className="w-10 h-10"/>
          </div>
          <div className="text-center mt-6">
            <div className="font-bold text-lg mb-2">Total Sales</div>
            <p className="text-gray-700 text-base">20000</p>
            <p className="text-gray-500 text-sm">Worse than last week (75%)</p>
            <ProgressBar percentage={75} color="#F44336" />
          </div>
        </div>

        <div className="card relative w-full md:max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-6 flex flex-col justify-center items-center card-body cursor-pointer transform transition-transform hover:scale-105">
          <div className="absolute left-[-1px] top-1/7 transform -translate-y-2/4 w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
            <img src={kidsImage} alt="Organic Traffic" className="w-10 h-10"/>
          </div>
          <div className="text-center mt-6">
            <div className="font-bold text-lg mb-2">Out of Stock</div>
            <p className="text-gray-700 text-base">2000</p>
            <p className="text-gray-500 text-sm">Better than last week (25%)</p>
            <ProgressBar percentage={25} color="#4CAF50" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardCards;
