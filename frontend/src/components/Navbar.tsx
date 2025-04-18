import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaComments, FaSearch, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import authService from "../services/authService";
import logo from "../assets/images/AutoStream-Logo-1.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await authService.getProfile();
        if (data) {
          setIsLoggedIn(true);
          sessionStorage.setItem("userProfile", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setIsLoggedIn(false);
      }
    };
    fetchUserProfile();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="w-full max-w-[1300px] mx-auto">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-1">
        {/* Logo */}
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 w-[235px] cursor-pointer" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* Right Section - Desktop */}
        <div className="hidden lg:flex items-center gap-10">
          {/* Search Bar */}
          <div className="relative h-10 flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="pl-3 pr-10 py-2 border border-gray-500 rounded-md text-sm w-48"
            />
            <FaSearch className="absolute right-3 text-black cursor-pointer" />
          </div>
          {/* Chat & Profile Icons */}
          <div className="flex items-center gap-3">
            
            {/* <FaComments className="text-2xl text-black cursor-pointer mr-3" /> */}
            <div ref={dropdownRef}>
              <FaUserCircle
                className="text-2xl text-black cursor-pointer hover:text-blue-600"
                onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navbar - Desktop */}
      <div className="hidden lg:flex p-1 items-center justify-between">
        {/* Nav Links */}
        <ul className="flex gap-12 pl-12 m-0">
          <li>
            <Link
              to="/Inventory"
              className={`text-black text-sm font-medium relative hover:text-blue-600 transition-colors duration-300 ${
                isActive("/Inventory") ? "text-blue-600" : ""
              }`}
            >
              Vehicles
              <span className={`absolute left-0 bottom-[-3px] w-full h-0.5 bg-blue-600 ${
                isActive("/Inventory") ? "scale-x-100" : "scale-x-0"
              } origin-right transition-transform duration-300 hover:scale-x-100 hover:origin-left`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/sell-my-car"
              className={`text-black text-sm font-medium relative hover:text-blue-600 transition-colors duration-300 ${
                isActive("/sell-my-car") ? "text-blue-600" : ""
              }`}
            >
              Sell my Car
              <span className={`absolute left-0 bottom-[-3px] w-full h-0.5 bg-blue-600 ${
                isActive("/sell-my-car") ? "scale-x-100" : "scale-x-0"
              } origin-right transition-transform duration-300 hover:scale-x-100 hover:origin-left`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/blue-t"
              className={`text-black text-sm font-medium relative hover:text-blue-600 transition-colors duration-300 ${
                isActive("/blue-t") ? "text-blue-600" : ""
              }`}
            >
              Blue-T
              <span className={`absolute left-0 bottom-[-3px] w-full h-0.5 bg-blue-600 ${
                isActive("/blue-t") ? "scale-x-100" : "scale-x-0"
              } origin-right transition-transform duration-300 hover:scale-x-100 hover:origin-left`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/Insurance"
              className={`text-black text-sm font-medium relative hover:text-blue-600 transition-colors duration-300 ${
                isActive("/Insurance") ? "text-blue-600" : ""
              }`}
            >
              Insurance
              <span className={`absolute left-0 bottom-[-3px] w-full h-0.5 bg-blue-600 ${
                isActive("/Insurance") ? "scale-x-100" : "scale-x-0"
              } origin-right transition-transform duration-300 hover:scale-x-100 hover:origin-left`}></span>
            </Link>
          </li>
          {/* E shop */}
          {/* {/* <li>
            <Link
              to="/parts"
              className="text-black text-sm font-medium relative hover:text-blue-600 transition-colors duration-300"
            >
              E shop
              <span className="absolute left-0 bottom-[-3px] w-full h-0.5 bg-blue-600 scale-x-0 origin-right transition-transform duration-300 hover:scale-x-100 hover:origin-left"></span>
            </Link>
          </li> */}
          <li>
            <Link
              to="/auto-news"
              className={`text-black text-sm font-medium relative hover:text-blue-600 transition-colors duration-300 ${
                isActive("/auto-news") ? "text-blue-600" : ""
              }`}
            >
              Auto News
              <span className={`absolute left-0 bottom-[-3px] w-full h-0.5 bg-blue-600 ${
                isActive("/auto-news") ? "scale-x-100" : "scale-x-0"
              } origin-right transition-transform duration-300 hover:scale-x-100 hover:origin-left`}></span>
            </Link>
          </li>
        </ul>
        {/* Post Ad Button */}
        <button
          className="bg-[#0663B2] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 hover:text-black transition-colors duration-300"
          onClick={() => navigate(isLoggedIn ? "/post-ad" : "/login")}
        >
          Post my free AD
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg rounded-md absolute left-0 right-0 z-50 mx-4">
          {/* Search Bar - Mobile */}
          <div className="relative h-10 flex items-center p-4">
            <input
              type="text"
              placeholder="Search..."
              className="pl-3 pr-10 py-2 border border-gray-500 rounded-md text-sm w-full"
            />
            <FaSearch className="absolute right-7 text-black cursor-pointer" />
          </div>

          {/* Mobile Navigation Links */}
          <ul className="flex flex-col p-4">
            <li className="border-b border-gray-200 py-3">
              <Link
                to="/Inventory"
                className="text-black text-sm font-medium hover:text-blue-600"
                onClick={toggleMenu}
              >
                Vehicles
              </Link>
            </li>
            <li className="border-b border-gray-200 py-3">
              <Link
                to="/sell-my-car"
                className="text-black text-sm font-medium hover:text-blue-600"
                onClick={toggleMenu}
              >
                Sell my Car
              </Link>
            </li>
            <li className="border-b border-gray-200 py-3">
              <Link
                to="/blue-t"
                className="text-black text-sm font-medium hover:text-blue-600"
                onClick={toggleMenu}
              >
                Blue-T
              </Link>
            </li>
            <li className="border-b border-gray-200 py-3">
              <Link
                to="/insurance"
                className="text-black text-sm font-medium hover:text-blue-600"
                onClick={toggleMenu}
              >
                Insurance
              </Link>
            </li>
            <li className="border-b border-gray-200 py-3">
              <Link
                to="/parts"
                className="text-black text-sm font-medium hover:text-blue-600"
                onClick={toggleMenu}
              >
                E shop
              </Link>
            </li>
            <li className="border-b border-gray-200 py-3">
              <Link
                to="/auto-news"
                className="text-black text-sm font-medium hover:text-blue-600"
                onClick={toggleMenu}
              >
                Auto News
              </Link>
            </li>
          </ul>

          {/* Mobile Profile and Chat */}
          <div className="flex justify-between p-4">
            <button
              className="flex items-center text-black hover:text-blue-600"
              onClick={() => {
                navigate(isLoggedIn ? "/profile" : "/login");
                toggleMenu();
              }}
            >
              <FaUserCircle className="text-2xl mr-2" />
              <span>{isLoggedIn ? "Profile" : "Login"}</span>
            </button>
            <button
              className="flex items-center text-black hover:text-blue-600"
              onClick={() => {
                // Add your chat navigation here
                toggleMenu();
              }}
            >
              <FaComments className="text-2xl mr-2" />
              <span>Chat</span>
            </button>
          </div>

          {/* Post Ad Button - Mobile */}
          <div className="p-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full hover:bg-blue-700"
              onClick={() => {
                navigate(isLoggedIn ? "/post-ad" : "/login");
                toggleMenu();
              }}
            >
              Post my free AD
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;