import React, { useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();

  
  const [notifications] = useState([
    { id: 1, message: "New vehicle added!", type: "listing", time: "2 mins ago" },
  ]); // Example notifications
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // const handleCreateListing = () => {
  //   navigate('/post-ad'); // Navigates to the page where a new vehicle can be posted
  // };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md px-8 py-4 flex justify-between items-center z-50">
      {/* Left Side */}
      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <FaBell
          className="text-3xl text-black cursor-pointer transition-colors duration-300 hover:text-blue-500"
          onClick={toggleDropdown} // Toggle the visibility of the dropdown
        />

        {/* Profile Icon */}
        <FaUserCircle
          className="text-3xl text-black cursor-pointer transition-colors duration-300 hover:text-blue-500"
          onClick={() => navigate("/profile")}
        />
      </div>

      {/* Notification Dropdown */}
      {dropdownVisible && (
        <div className="absolute top-14 right-8 bg-white border border-gray-200 rounded-lg shadow-md w-80 max-h-60 overflow-y-auto z-50">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Notifications</h3>
            {notifications.map((notification: { id?: any; message?: any; time?: any; type?: string; }) => (
              <div
                key={notification.id}
                className="notification-item py-2 px-3 cursor-pointer hover:bg-gray-100 rounded-md"
                // onClick={() => handleNotificationClick(notification)} // Handle the click
              >
                <span className="text-sm">{notification.message}</span>
                <div className="text-xs text-gray-500">{notification.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;