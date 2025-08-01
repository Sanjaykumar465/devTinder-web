import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    // if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      
      // Fixed: Log the response data properly instead of concatenating object
      console.log("Profile response:", res.data);
      console.log("Response status:", res.status);
      console.log("Full response object:", res);

      // Check if response has the expected structure
      if (res.data) {
        dispatch(addUser(res.data));
        console.log("User data dispatched successfully:", res.data);
      } else {
        console.warn("No data received in profile response");
      }
    } catch (err) {
      console.error("Error fetching user profile:");
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      console.error("Error message:", err.message);
      
      // Fixed: Check response status properly
      if (err.response?.status === 401) {
        console.log("Unauthorized - redirecting to login");
        navigate("/login");
      } else if (err.response?.status === 403) {
        console.log("Forbidden - user may need to re-authenticate");
        navigate("/login");
      } else if (err.response?.status >= 500) {
        console.log("Server error - please try again later");
        // You might want to show a toast notification here
      } else {
        console.log("Other error occurred:", err.response?.status || err.message);
      }
    }
  };

  useEffect(() => {
    // Only fetch user if not already logged in
    if (!userData) {
      console.log("No user data found, fetching user profile...");
      fetchUser();
    } else {
      console.log("User already logged in:", userData);
    }
  }, []); // Removed userData dependency to prevent infinite loop

  // Add a check to ensure user is authenticated before rendering protected content
  useEffect(() => {
    // If we have tried to fetch user and still no userData after some time, redirect to login
    const timeoutId = setTimeout(() => {
      if (!userData) {
        console.log("No user data after timeout, redirecting to login");
        navigate("/login");
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
  }, [userData, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navbar - Fixed at top */}
      <Navbar />

      {/* Main Content Area - Takes remaining space */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
      </main>

      {/* Footer - Sticks to bottom */}
      <Footer />
    </div>
  );
};

export default Body;