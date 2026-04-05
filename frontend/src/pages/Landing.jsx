import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white relative overflow-hidden">

      
      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-indigo-500 opacity-20 blur-3xl rounded-full bottom-0 right-0"></div>

      <div className="flex justify-between items-center px-10 py-6 z-10 relative">
        <h1 className="text-2xl font-bold text-indigo-400">
          Extensify AI
        </h1>
      </div>

      
      <div className="flex flex-col justify-center items-center text-center px-4 mt-10">

        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          Text-to-Extension Platform
        </h1>

        <p className="text-gray-300 max-w-xl mb-8 text-lg">
          Turn your ideas into fully working Chrome extensions using AI 
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/generate")}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3 rounded-xl hover:scale-105 transition shadow-xl"
          >
             Start Building
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-indigo-500 to-purple-600  px-8 py-3 rounded-xl hover:scale-105 transition shadow-xl"
          
          >
            My Extensions
          </button>
        </div>
      </div>

     
      <div className="grid md:grid-cols-3 gap-6 px-10 mt-20">

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2"> AI Powered</h3>
          <p className="text-gray-300 text-sm">
            Generate complete Chrome extensions instantly using AI prompts.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2"> Auto Packaging</h3>
          <p className="text-gray-300 text-sm">
            Automatically converts code into installable ZIP extension files.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2"> Manage Projects</h3>
          <p className="text-gray-300 text-sm">
            Edit, download, and manage all your extensions in one place.
          </p>
        </div>

      </div>

      <footer className="text-center text-gray-400 mt-10 text-sm">
        © {new Date().getFullYear()} Extensify AI. All rights reserved. <br />
        Built by Athira S M
      </footer>

    </div>
  );
}

export default Landing;