import React, { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import ProfileCard from "./ProfileCard";

const Sidebar = () => {
    const items = [
        {
            name: "Profile",
            icon: <FaRegCircleUser />
        },
        {
            name: "Dashboard",
            icon: <MdOutlineDashboard />
        },
        {
            name: "Services",
            icon: <IoMdHelpCircleOutline />
        },
        {
            name: "Setting",
            icon: <IoSettingsOutline />
        }
    ];
    const companyName = "Company Name";
    const [profileClick, setProfileClick] = useState(false);
    const [activeTab, setActiveTab] = useState("Profile"); // Set the initial active tab to "Profile"

    const handleProfileClick = () => {
        setProfileClick(!profileClick);
    };

    const handleClickOnScreen = () => {
        if (profileClick) setProfileClick(false);
    };

    const handleSidebarTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <section className="flex flex-col sm:flex-row" onClick={handleClickOnScreen}>
                <header className="bg-[#FFFFFF] p-4 absolute right-0 w-full">
                    <div className="flex items-center justify-between gap-3 cursor-pointer">
                        <h1>{companyName}</h1>
                        <div className="flex items-center gap-3 " onClick={handleProfileClick}>
                            <h1>Username</h1>
                            <FaUserCircle />
                        </div>
                    </div>
                </header>
                <div className="bg-[#FFFFFF] flex flex-col sm:flex-row h-[38rem] w-full sm:w-[200px] justify-between items-center mt-[2rem] flex-wrap">
                    <div className="flex flex-col mt-4 sm:mt-0 sm:w-60">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center ${activeTab === item.name && 'bg-[#F6F9FF]'} p-2 mt-2 cursor-pointer hover:border hover:bg-[#F6F9FF] hover:rounded-md w-full`}
                                onClick={() => handleSidebarTab(item.name)}
                            >
                                <span className="m-2">{item.icon}</span>
                                <span className="ml-2">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 flex items-center p-2 mt-2 cursor-pointer w-full hover:border hover:bg-red-600 hover:rounded-md hover:text-white">
                        <span className="m-2"><CiLogout /></span>
                        <span className="ml-2">Logout</span>
                    </div>
                </div>
                {profileClick && (
                    <div className="absolute right-[0.2rem] mt-[3rem] border-gray-500 bg-white m-2 p-2 rounded-md cursor-pointer w-[7rem]">
                        <p className="hover:border hover:bg-[#F6F9FF] hover:rounded-md p-2 w-full">Profile</p>
                        <p className="hover:border hover:bg-[#F6F9FF] hover:rounded-md p-2 w-full">Logout</p>
                    </div>
                )}
                <div className="flex justify-center mt-4">
                    <ProfileCard />
                </div>
            </section>
        </>
    );
};

export default Sidebar;
