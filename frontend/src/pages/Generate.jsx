import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Generate() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!prompt || prompt.length < 5) {
      alert("Enter valid prompt");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/generate-extension",
        { prompt },
        {
          responseType: "blob",
          headers: { "x-user-plan": "pro" },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "extension.zip";
      link.click();

    } catch (err) {
      alert("Error generating extension");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl w-[420px] shadow-xl">
        
        <h1 className="text-2xl font-bold mb-4 text-center">
          🚀 Create Extension
        </h1>

        <textarea
          rows={5}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter requirement..."
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {/* Navigation Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-600 py-2 rounded hover:bg-gray-700"
          >
            🏠 Home
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-purple-500 py-2 rounded hover:bg-purple-600"
          >
            📦 My Extensions
          </button>
        </div>

      </div>
    </div>
  );
}

export default Generate;