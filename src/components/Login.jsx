import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils/constants";
import { addUser } from "../Utils/userSlice";

const Login = () => {
  const [email, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-purple-900 p-3 sm:p-4 lg:p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl relative z-10">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-800/50 hover:border-purple-500/30 transition-all duration-500">
          {/* Header with enhanced gradient */}
          <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 p-6 sm:p-8 text-center border-b border-gray-800/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-purple-300 text-sm sm:text-base">
                Sign in to continue your journey
              </p>
            </div>
          </div>

          {/* Form with enhanced spacing and responsiveness */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6">
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 group-focus-within:text-purple-400 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-gray-800 hover:bg-gray-800/90 transition-all duration-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 group-focus-within:text-purple-400 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-gray-800 hover:bg-gray-800/90 transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-900/50 text-red-200 rounded-lg sm:rounded-xl text-sm sm:text-base border border-red-800/50 backdrop-blur-sm animate-shake">
                <div className="flex items-center">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800 focus:ring-2"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-400"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent rounded-lg sm:rounded-xl shadow-lg text-sm sm:text-base font-medium text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-purple-500/25 hover:shadow-xl"
              >
                <span className="inline-flex items-center">
                  Sign in
                  <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </form>

          <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 text-center border-t border-gray-800/50 pt-6">
            <p className="text-sm sm:text-base text-gray-400">
              Don't have an account?{" "}
              <Link 
                to="/signup"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Additional decorative element for larger screens */}
        <div className="hidden lg:block absolute -z-10 inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-3xl transform rotate-1 scale-105"></div>
      </div>
    </div>
  );
};

export default Login;