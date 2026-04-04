import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">

 
      <h1 className="text-4xl font-bold mb-4">
         Extensio.ai
      </h1>

      <p className="text-gray-400 mb-8 text-center max-w-md">
        Build Chrome Extensions using AI instantly.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/generate")}
          className="bg-indigo-500 px-6 py-3 rounded-lg hover:bg-indigo-600 transition"
        >
          Create Extension
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 px-6 py-3 rounded-lg hover:bg-gray-600 transition"
        >
          My Extensions
        </button>
      </div>

    </div>
  );
}

export default Landing;