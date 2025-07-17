import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [email, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:7777/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center my-10 ">
      <form
        className="max-w-96 w-full text-center  rounded-2xl px-8 bg-base-300"
        // onSubmit={handleLogin}
      >
        <h1 className="text-white text-3xl mt-10 font-medium">Login</h1>
        <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>
        <div className="flex items-center w-full mt-10 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            value={email}
            type="email"
            placeholder="Email id"
            className=" placeholder-gray-500 outline-none text-sm w-full h-full"
            onChange={(e) => setEmailId(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full  border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            value={password}
            type="password"
            placeholder="Password"
            className=" placeholder-gray-500 outline-none text-sm w-full h-full"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-5 text-left text-red-200">
          <a className="text-sm" href="#">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-red-400 hover:opacity-90 transition-opacity"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-gray-500 text-sm mt-3 mb-11">
          Don’t have an account?{" "}
          <a className="text-red-400" href="#">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
