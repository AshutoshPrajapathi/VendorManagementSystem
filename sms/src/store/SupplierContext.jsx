import React, { createContext, useContext, useState } from "react";

const SupplierDataContext = createContext();

export const SupplierDataProvider = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState('profle');

  const handleToggle = (val) => {
    setSelectedTab(val)
  };


  const [supplierData, setSupplierData] = useState({
    supplierName: "Supplier",
    companyName: "",
    contact: "",
    email: "",
    address: "",

    bankName: "",
    branch: "",
    accno: "",
    ifsc: ""

  });

  const updateSupplierData = (newData) => {
    console.log(newData)
    setSupplierData(newData);
  };

  return (
    <SupplierDataContext.Provider value={{ selectedTab, handleToggle, supplierData, updateSupplierData }}>
      {children}
    </SupplierDataContext.Provider>
  );
};

export const useSupplierData = () => {
  const context = useContext(SupplierDataContext);
  if (!context) {
    throw new Error("useSupplierData must be used within a SupplierDataProvider");
  }
  return context;
};

export { SupplierDataContext }; // Don't forget to export the context
