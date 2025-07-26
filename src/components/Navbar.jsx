import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils/constants";
import { removeUser } from "../Utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-xl border-b border-purple-500/20 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14 sm:h-16 lg:h-18">
          
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              to="/" 
              className="text-white text-lg sm:text-xl lg:text-2xl font-bold hover:text-purple-300 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span className="text-2xl sm:text-3xl">🧑‍💻</span>
              <span className="hidden xs:inline bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                devTinder
              </span>
              <span className="xs:hidden bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                dT
              </span>
            </Link>
          </div>

          {user !== null && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                {/* Welcome Message - Hidden on smaller screens */}
                <div className="hidden lg:flex items-center text-gray-300 text-sm lg:text-base">
                  <span className="mr-2">👋</span>
                  <span>Welcome, <span className="text-purple-300 font-medium">{user.firstName}</span></span>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 hover:bg-purple-800/30 relative group"
                  >
                    Profile
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      New
                    </span>
                  </Link>
                  <Link
                    to="/connections"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 hover:bg-purple-800/30"
                  >
                    Connections
                  </Link>
                  <Link
                    to="/request"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 hover:bg-purple-800/30"
                  >
                    Requests
                  </Link>
                </div>

                {/* User Avatar & Dropdown */}
                <div className="relative ml-3">
                  <div className="group">
                    <button
                      onClick={toggleMobileMenu}
                      className="bg-gray-800 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-200 hover:scale-110"
                    >
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-purple-400 transition-all duration-200">
                        <img 
                          alt="User Profile" 
                          src={user.photoUrl} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </button>

                    {/* Desktop Dropdown */}
                    {isMobileMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-gray-800 border border-gray-700 z-50">
                        <div className="py-2">
                          <div className="px-4 py-3 border-b border-gray-700">
                            <p className="text-sm text-gray-300">Signed in as</p>
                            <p className="text-sm font-medium text-white truncate">{user.firstName}</p>
                          </div>
                          <Link
                            to="/profile"
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Profile
                            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          </Link>
                          <Link
                            to="/connections"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Connections
                          </Link>
                          <Link
                            to="/request"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Connection Requests
                          </Link>
                          <div className="border-t border-gray-700">
                            <button
                              onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden flex items-center space-x-3">
                {/* Mobile Welcome - Very compact */}
                <div className="hidden sm:flex text-gray-300 text-xs">
                  Hi, <span className="text-purple-300 ml-1">{user.firstName.split(' ')[0]}</span>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-200"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-transparent hover:border-purple-400 transition-all duration-200">
                    <img 
                      alt="User Profile" 
                      src={user.photoUrl} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              </div>

              {/* Mobile Dropdown Menu */}
              {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-2xl z-40">
                  <div className="px-3 py-3 space-y-1">
                    {/* Mobile Welcome */}
                    <div className="sm:hidden px-3 py-2 text-gray-300 text-sm border-b border-gray-700 mb-2">
                      👋 Welcome, <span className="text-purple-300 font-medium">{user.firstName}</span>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    </Link>
                    <Link
                      to="/connections"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Connections
                    </Link>
                    <Link
                      to="/request"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Connection Requests
                    </Link>
                    <div className="border-t border-gray-700 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-700 transition-all duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Close mobile menu when clicking outside */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;