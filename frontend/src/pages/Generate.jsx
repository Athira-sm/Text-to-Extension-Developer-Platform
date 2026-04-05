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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30] text-white">

      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl w-[420px] shadow-2xl">

        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-300">
           Generate Extension
        </h1>

        <textarea
          rows={5}
          className="w-full p-3 rounded bg-black/40 border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your requirement..."
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded transition flex justify-center items-center ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
          }`}
        >
          {loading ? " Generating..." : "Generate"}
        </button>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-purple-600 py-2 rounded hover:bg-purple-700"
          >
            My Extensions
          </button>
        </div>

      </div>
    </div>
  );
}

export default Generate;