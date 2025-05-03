// FrontPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
        Welcome to Our App
      </h1>
      <p className="text-lg md:text-xl mb-10 text-center">
        Join us and explore powerful features for your business.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-100 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-indigo-900 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default FrontPage;
