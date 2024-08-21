import React, { useState, useEffect, useRef  } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Sidebar from "../SupplierDashboard/Components/Sidebar";
import Profile from "../SupplierDashboard/Components/Profile";
import ProfileView from "../SupplierDashboard/Components/ProfileView";

import StockManagement from "../SupplierDashboard/Components/StockManagement";
import axios from "axios";
import { FiSun, FiMoon } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FaPlus } from "react-icons/fa";
import ProductList from "../SupplierDashboard/Components/ProductList";
import ProductForm from "../SupplierDashboard/Components/ProductForm";
import ProductView from "../SupplierDashboard/Components/ProductView";
import InvoiceList from "../SupplierDashboard/Components/InvoiceList";
import { SearchIcon, LogoutIcon } from "@heroicons/react/outline";
import OrderManagement from "../SupplierDashboard/Components/OrderManagement";
import DashboardCards from "../SupplierDashboard/Components/DashboardCards";
import SalesReport from "../SupplierDashboard/Components/SalesReport";
import NotificationDropdown from "../SupplierDashboard/Components/NotificationDropdown";
import { Tooltip } from "@material-ui/core";

const App = ({ loggedIn, handleLogin, sessionId, token }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeComponent, setActiveComponent] = useState("");
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  let user_id = sessionId;
  const keys = Object.keys(sessionStorage);
  user_id = keys[0] || sessionId;

  const dropdownRef = useRef(null); // Ref to dropdown menu

  const [isRefreshed, setIsRefreshed] = useState(false);
  useEffect(() => {
    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem(sessionId);
  }, []); 

  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].type === "reload") {
      handleLogin(true);
    }
  }, []);

   // Function to toggle between light and dark mode
   const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save theme preference to localStorage
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    handleLogin(false);
    sessionStorage.removeItem(sessionId);
    navigate("/");
  };

  //profile
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    id: "", // Add user ID to the profile state
    companyname: "Abc",
    email: "abc@gmail.com",
    phone_number: "(213) 555-1234",
    location: "Bangalore",
    profileImage: "https://via.placeholder.com/100",
    bank_name: "ABC Bank",
    account: "1234567890",
    branch: "Main",
    ifsc: "ABC1234567",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/api/get_user_details/${sessionId}`
        );
        setProfile(res.data);
        //setUserDetails(res.data); // Set user details to state if needed
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);

  const handleSave = (section, data) => {
    fetch(`http://localhost:8000/update-profile/${section}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((updatedProfile) => {
        setProfile(updatedProfile);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  //Goods and Material upload
  // Product Components Integration
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    console.log(new_quantity);
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/users/${user_id}/products`
        );
        // console.log(response.data)
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);//user_id

  const handleAddNewClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (productId) => {
    axios
      .delete(`http://127.0.0.1:5000/products/${user_id}/${productId}`)
      .then(() => {
        setProducts(
          products.filter((product) => product.product_id !== productId)
        );
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  const handleFormSubmit = (product) => {
    if (product.product_id) {
      const formData = new FormData();
      formData.append("productName", product.productName);
      formData.append("quantityAvailable", product.quantityAvailable);
      formData.append("unitPrice", product.unitPrice);
      formData.append("description", product.description);
      formData.append("images", product.images);
      // console.log(product.images)
      axios
        .put(
          `http://127.0.0.1:5000/products/${user_id}/${product.product_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setProducts(
            products.map((p) =>
              p.product_id === product.product_id ? response.data : p
            )
          );
        })
        .catch((error) => console.error("Error updating product:", error));
    } else {
      const formData = new FormData();

      formData.append("productName", product.productName);
      formData.append("quantityAvailable", product.quantityAvailable);
      formData.append("unitPrice", product.unitPrice);
      formData.append("description", product.description);
      formData.append("images", product.images);

      axios
        .post(`http://127.0.0.1:5000/products/${user_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setProducts([...products, response.data]);
        })
        .catch((error) => console.error("Error adding product:", error));
    }
    setIsFormOpen(false);
  };
  const handleEditClick = (product) => {
    // handleFormSubmit(product);
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  //Stock Management

  const [stockData, setStockData] = useState();

  let new_quantity = 0;

  //fetch stock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/vendor/${user_id}/stock`
        );
        // Handle the response data
        setStockData(response.data);
      } catch (error) {
        // Handle any errors
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user_id]);

  const [showImage, setShowImage] = useState(false);

  // Toggle function for profile picture
  const toggleImage = () => {
    setShowImage(!showImage);
  };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

  return loggedIn ? (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex flex-col flex-grow">        
        <nav className="bg-gray-900 text-white h-16 flex justify-between items-center px-4">
          <div className="flex items-center">
            <button className="mr-2">
              <SearchIcon className="h-6 w-6 text-gray-400" />
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="bg-white-800 text-black rounded-md py-1 px-3 focus:outline-none focus:ring focus:border-blue-500 w-full md:w-auto"
            />
          </div>
          <div className="flex items-center"
           >
            {/* Notification icon */}
            <Tooltip title="Notifications">
            <button className="mr-4 focus:outline-none">
              <FontAwesomeIcon icon={faBell} className="h-6 w-6 text--400" />
            </button>
            </Tooltip>
            {/* Theme toggle button */}
            <Tooltip title="Toggle Mode">
            <button onClick={toggleTheme} className="mr-4 focus:outline-none">
              {theme === "light" ? (
                <FiSun className="h-6 w-6 text-yellow-400" />
              ) : (
                <FiMoon className="h-6 w-6 text-blue-400" />
              )}
            </button>
            </Tooltip>
            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="rounded-full bg-gray-700 p-2 border border-gray-600 cursor-pointer"
                onClick={toggleDropdown}
              >
                {showImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    className="cursor-pointer fill-white"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                      data-original="#000000"
                    />
                  </svg>
                )}
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <div className="py-2 px-4 border-b flex items-center cursor-pointer hover:bg-gray-100"
                     onClick={() => setActiveComponent("profile-view")}
                    >
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-8 h-8 mr-2 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-800 truncate">
                        <strong>{profile.companyname}</strong>
                      </span>
                      {/* <span className="text-gray-600 text-sm truncate">
                        {profile.email}
                      </span> */}
                    </div>
                  </div>
                  <div className="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100">
                    <LogoutIcon className="w-5 h-5 mr-2 text-gray-700 hover:text-red-800" />
                    <span
                      className="text-gray-800 hover:text-red-500 truncate"
                      onClick={handleLogout}
                    >
                      Logout
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
        <div className="p-4 flex-1 overflow-y-auto">
          {activeComponent === "goods-and-materials" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Product List</h2>
              <div className="flex justify-between mb-4">
                <button
                  onClick={handleAddNewClick}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  <FaPlus className="mr-2" /> Add New
                </button>
              </div>
              <ProductList
                products={products}
                onEditClick={handleEditClick}
                onViewClick={handleViewClick}
                onDeleteClick={handleDeleteClick}
              />
              {isFormOpen && (
                <ProductForm
                  product={selectedProduct}
                  onClose={() => setIsFormOpen(false)}
                  onSubmit={handleFormSubmit}
                />
              )}
              {isViewOpen && (
                <ProductView
                  product={selectedProduct}
                  onClose={() => setIsViewOpen(false)}
                />
              )}
            </div>
          )}
          {activeComponent === "home" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Home Page</h2>
              {/* Add your goods and materials content here */}
              <DashboardCards />
              <SalesReport />
            </div>
          )}
          {activeComponent === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
              {/* Add your dashboard content here */}
            </div>
          )}
          {activeComponent === "profile" && (
            <Profile
              profile={profile}
              setProfile={setProfile}
              isOpen={isOpen}
              handleSave={handleSave}
              sessionId={sessionId}
            />
          )}
          {activeComponent === "profile-view" && (
            <ProfileView profile={profile} />
          )}
          {activeComponent === "notification" && (
            <NotificationDropdown  />
          )}
          {activeComponent === "stock-management" && (
            <StockManagement user_id={user_id} stockData={stockData} />
          )}
          {activeComponent === "order-management" && (
            <div>
              <h2 className="text-2xl font-bold mb-4"></h2>
              <OrderManagement user_id={user_id} />
            </div>
          )}
          {activeComponent === "invoice-and-payments" && (
            <div>
              {/* <h2 className="text-2xl font-bold mb-4">Invoice and Payments</h2> */}
              <InvoiceList />
            </div>
          )}
          {activeComponent === "communication" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Communication</h2>
              {/* Add your communication content here */}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
     <div>
      <p>You need to log in to access this page.</p>
    </div>
  );
};

export default App;
