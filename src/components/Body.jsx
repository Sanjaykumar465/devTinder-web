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
      console.log("Response page" + res);
      
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
        if (userData) {
          navigate("/login");
        }
      }
      
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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