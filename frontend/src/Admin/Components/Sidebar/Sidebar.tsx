import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../services/AuthContext";
 // Ensure the correct logo path

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true); // Open sidebar on larger screens
      } else {
        setIsOpen(false); // Close sidebar on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Define navigation items based on role
  const getNavigationItems = () => {
    const allItems = [
      { path: "/admin", name: "Dashboard", roles: ["admin", "Manager", "Shop_manager"] },
      { path: "/listing", name: "Listing", roles: ["admin", "Shop_manager"] },
      { path: "/users", name: "Users", roles: ["admin", "Shop_manager"] },
      { path: "/dealer-pos", name: "Dealers", roles: ["admin"] },
      { path: "/subscription", name: "Subscription", roles: ["admin"] },
      { path: "/blue-t-request", name: "Blue-T", roles: ["admin"] },
      { path: "", name: "Insurance", roles: ["admin"] },
      { path: "/loan-calculator", name: "Leasing", roles: ["admin"] },
      { path: "/adminnews", name: "News", roles: ["admin", "news_manager"] },
      { path: "/vehicle-management", name: "Vehicle Management", roles: ["admin"] },
    ];

    return allItems.filter(item => item.roles.includes(user?.role || ""));
  };

  return (
    <>
      {/* Hamburger Menu - Hidden on Desktop */}
      <button
        className="fixed top-4 left-4 bg-blue-700 text-white border-none text-2xl px-4 py-2 rounded cursor-pointer z-[1100] md:hidden"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-[4.5rem] left-0 h-[calc(100vh-4.5rem)] w-100rem bg-gray-100 shadow-lg flex flex-col overflow-y-auto transition-transform duration-300 z-[1000] pt-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        

        {/* Navigation Links */}
        <nav className="w-full">
          <ul className="list-none p-0 m-0 w-full">
            {getNavigationItems().map((item) => (
              <li key={item.path} className="w-full">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-black font-medium rounded transition-all duration-300 ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
