import React, { useState } from "react";
import axios from "axios";

function Generate() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!prompt || prompt.length < 5) {
      setError("Prompt must be at least 5 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
  "http://localhost:5000/api/generate-extension",
  { prompt },
  {
    responseType: "blob",
    headers: {
      "x-user-plan": "pro", // ✅ IMPORTANT
    },
  }
);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "extension.zip";
      link.click();

      setSuccess("Extension downloaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Extension</h1>

      <textarea
        rows={5}
        style={{ width: "100%" }}
        placeholder="Enter your requirement..."
        onChange={(e) => setPrompt(e.target.value)}
      />

      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default Generate;