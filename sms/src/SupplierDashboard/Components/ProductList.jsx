import React, { useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  FaEllipsisV,
  FaEdit,
  FaEye,
  FaTrash,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const ProductList = ({ products, onEditClick, onDeleteClick, onViewClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleDeleteClick = (productId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-green-600 text-white font-bold py-2 px-4 rounded mx-2",
        cancelButton: "bg-red-600 text-white font-bold py-2 px-4 rounded mx-2",
        title: "text-black",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to delete these item?",
        text: "Deleting item from this List cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, continue",
        cancelButtonText: "No, go back",
        reverseButtons: true,
        background: "#fff",
        backdrop: "rgba(0, 0, 0, 0.4)",
        iconColor: "#e74c3c",
      })
      .then((result) => {
        if (result.isConfirmed) {
          onDeleteClick(productId);
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your item has been deleted.",
            icon: "success",
            background: "#fff",
            backdrop: "rgba(0, 0, 0, 0.4)",
            iconColor: "#e74c3c",
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your item is safe and it is not deleted :)",
            icon: "error",
            background: "#fff", 
            backdrop: "rgba(0, 0, 0, 0.4)",
            iconColor: "#e74c3c",
          });
        }
      });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    filterProducts(searchValue);
  };

  const handleClearSearch = () => {
    setSearchTerm(""); 
    setFilteredProducts(products);
  };

  const filterProducts = (search) => {
    if (search === "") {
      setFilteredProducts(products);
    } else {
      const lowercasedFilter = search.toLowerCase();
      const filteredData = products.filter((product) => {
        const fieldsToFilter = [
          product.product_id.toString(),
          product.product_name,
          product.quantity_available.toString(),
          product.unit_price.toString(),
        ];
        return fieldsToFilter.some((f) =>
          f.toLowerCase().includes(lowercasedFilter)
        );
      });
      setFilteredProducts(filteredData);
    }
  };

  // Pagination calculations
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-end mb-4 space-x-4">
        <div className="relative w-2/3 md:w-1/2 lg:w-1/3">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by any product property..."
            className="w-full px-4 py-2 border-b-2 border-blue-700 rounded-md focus:outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {searchTerm ? (
              <FaTimes
                className="text-gray-500 cursor-pointer"
                onClick={handleClearSearch}
              /> // Call handleClearSearch when close button is clicked
            ) : (
              <FaSearch className="text-gray-500" />
            )}
          </div>
        </div>
      </div>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/6 px-4 py-2">Product ID</th>
            <th className="w-2/6 px-4 py-2">Product Name</th>
            <th className="w-1/6 px-4 py-2">Quantity</th>
            <th className="w-1/6 px-4 py-2">Unit Price</th>
            <th className="w-1/6 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <tr key={product.product_id}>
                <td className="border px-4 py-2">{product.product_id}</td>
                <td className="border px-4 py-2">{product.product_name}</td>
                <td className="border px-4 py-2">
                  {product.quantity_available}
                </td>
                <td className="border px-4 py-2">${product.unit_price}</td>
                <td className="border px-4 py-2">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                      <FaEllipsisV />
                    </Menu.Button>
                    <Transition
                      as={React.Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                onClick={() => onViewClick(product)}
                              >
                                <FaEye
                                  className="mr-3 h-5 w-5"
                                  aria-hidden="true"
                                />
                                View
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                onClick={() => onEditClick(product)}
                              >
                                <FaEdit
                                  className="mr-3 h-5 w-5 text-blue-500"
                                  aria-hidden="true"
                                />
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                onClick={() => handleDeleteClick(product.product_id)}
                              >
                                <FaTrash
                                  className="mr-3 h-5 w-5 text-red-600"
                                  aria-hidden="true"
                                />
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border px-4 py-2 text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          className="px-3 py-1 mx-1 rounded-full bg-gray-300 hover:bg-gray-400"
        >
          &laquo;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 mx-1 rounded-full ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          className="px-3 py-1 mx-1 rounded-full bg-gray-300 hover:bg-gray-400"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default ProductList;
