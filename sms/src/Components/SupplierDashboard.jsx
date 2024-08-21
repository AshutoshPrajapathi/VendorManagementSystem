// import React, { useState, useEffect } from "react";
// import { Disclosure } from "@headlessui/react";

// const SupplierDashboard = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [performanceMetrics, setPerformanceMetrics] = useState({});

//   const fetchSupplierData = () => {};

//   const communicateWithPurchasing = () => {};

//   useEffect(() => {
//     fetchSupplierData();
//   }, []);

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8">Supplier Dashboard</h1>
//       <Disclosure defaultOpen>
//         {({ open }) => (
//           <>
//             <Disclosure.Button className="flex justify-between w-full bg-gray-200 p-4 rounded-lg mb-4">
//               <h3 className="text-lg font-semibold">Invoices</h3>
//               <span className="text-sm">{invoices.length} invoices</span>
//             </Disclosure.Button>
//             <Disclosure.Panel className="p-4">
//               <ul>
//                 {invoices.map((invoice, index) => (
//                   <li key={index} className="text-gray-700">
//                     {invoice}
//                   </li>
//                 ))}
//               </ul>
//             </Disclosure.Panel>
//           </>
//         )}
//       </Disclosure>

//       <Disclosure defaultOpen>
//         {({ open }) => (
//           <>
//             <Disclosure.Button className="flex justify-between w-full bg-gray-200 p-4 rounded-lg mb-4">
//               <h3 className="text-lg font-semibold">Payments</h3>
//               <span className="text-sm">{payments.length} payments</span>
//             </Disclosure.Button>
//             <Disclosure.Panel className="p-4">
//               <ul>
//                 {payments.map((payment, index) => (
//                   <li key={index} className="text-gray-700">
//                     {payment}
//                   </li>
//                 ))}
//               </ul>
//             </Disclosure.Panel>
//           </>
//         )}
//       </Disclosure>

//       <Disclosure defaultOpen>
//         {({ open }) => (
//           <>
//             <Disclosure.Button className="flex justify-between w-full bg-gray-200 p-4 rounded-lg mb-4">
//               <h3 className="text-lg font-semibold">Performance Metrics</h3>
//             </Disclosure.Button>
//             <Disclosure.Panel className="p-4">
//               <ul>
//                 {Object.entries(performanceMetrics).map(([key, value]) => (
//                   <li key={key} className="text-gray-700">
//                     <span className="font-semibold">{key}:</span> {value}
//                   </li>
//                 ))}
//               </ul>
//             </Disclosure.Panel>
//           </>
//         )}
//       </Disclosure>

//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"
//         onClick={communicateWithPurchasing}
//       >
//         Communicate with Purchasing Department
//       </button>
//     </div>
//   );
// };
// export default SupplierDashboard;

import React, { useState, useEffect } from "react";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdPayments } from "react-icons/md";

const SupplierDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const sidebar = document.getElementById("sidebar");
      const openSidebarButton = document.getElementById("open-sidebar");
      if (
        !sidebar.contains(e.target) &&
        !openSidebarButton.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="h-screen flex overflow-hidden bg-gray-200">
        <div
          className={`absolute bg-black text-white w-56 min-h-screen overflow-y-auto transition-transform ${
            isSidebarOpen ? "" : "-translate-x-full"
          } ease-in-out duration-300`}
          id="sidebar"
        >
          <div className="p-4">
            <h1 className="text-2xl font-semibold">Sidebar</h1>
            <ul className="mt-4">
              <li className="mb-2">
                <a
                  href="#"
                  className="block hover:bg-blue-500 hover:text-white rounded-lg px-2 py-1 transition duration-300"
                >
                  <h3 className="text-lg font-semibold">
                    <FaFileInvoiceDollar className="inline mr-2" />
                    Invoices
                  </h3>
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="block hover:bg-blue-500 hover:text-white rounded-lg px-2 py-1 transition duration-300"
                >
                  <h3 className="text-lg font-semibold">
                    <MdPayments className="inline mr-2" />
                    Payments
                  </h3>
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="block hover:bg-blue-500 hover:text-white rounded-lg px-2 py-1 transition duration-300"
                >
                  <h3 className="text-lg font-semibold">
                    Purchasing Department
                  </h3>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white shadow">
            <div className="container mx-auto">
              <div className="flex justify-between items-center py-4 px-2">
                <button
                  className="text-gray-500 hover:text-gray-600 ml-2"
                  id="open-sidebar"
                  onClick={toggleSidebar}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>
                <div className="flex items-center">
                  <form className="max-w-md mx-auto">
                    <label
                      htmlFor="default-search"
                      className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                      Search
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search..."
                        required
                      />
                      <button
                        type="submit"
                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <h1 className="text-2xl font-semibold"></h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;

// import React, { useState } from 'react';
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

// const drawerWidth = 240;

// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: open ? 0 : -drawerWidth,
//   }),
// );

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
//   transition: theme.transitions.create(['margin', 'width'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: `${drawerWidth}px`,
//   }),
// }));

// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: 'flex-end',
// }));

// const SupplierDashboard = () => {
//   const theme = useTheme();
//   const [open, setOpen] = useState(false);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   const manageInvoices = () => {
//     console.log("Manage Invoices logic goes here");
//   };

//   const trackPayments = () => {
//     console.log("Track Payments logic goes here");
//   };

//   const communicateWithPurchasing = () => {
//     console.log("Communicate with Purchasing logic goes here");
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
//             edge="start"
//             sx={{ mr: 2, ...(open && { display: 'none' }) }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             Supplier Dashboard
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//           },
//         }}
//         variant="persistent"
//         anchor="left"
//         open={open}
//       >
//         <DrawerHeader>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
//           </IconButton>
//         </DrawerHeader>
//         <Divider />
//         <List>
//           <ListItem button onClick={manageInvoices}>
//             <ListItemIcon>
//               <InboxIcon />
//             </ListItemIcon>
//             <ListItemText primary="Manage Invoices" />
//           </ListItem>
//           <ListItem button onClick={trackPayments}>
//             <ListItemIcon>
//               <MailIcon />
//             </ListItemIcon>
//             <ListItemText primary="Track Payments" />
//           </ListItem>
//           <ListItem button onClick={communicateWithPurchasing}>
//             <ListItemIcon>
//               <InboxIcon />
//             </ListItemIcon>
//             <ListItemText primary="Communicate with Purchasing" />
//           </ListItem>
//         </List>
//       </Drawer>
//       <Main open={open}>
//         <DrawerHeader />
//         {/* Main content of the dashboard goes here */}
//         <Typography variant="h4">Welcome to the Supplier Dashboard</Typography>
//         <Typography paragraph>
//           This dashboard allows you to manage your invoices, track payments, and communicate with the purchasing department.
//         </Typography>
//       </Main>
//     </Box>
//   );
// };

// export default SupplierDashboard;
