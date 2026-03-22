import React, { useState } from "react";
import axios from "axios";

function Generate() {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/generate-extension",
      { prompt },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "extension.zip");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <h1>Create Extension</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleSubmit}>Generate</button>
    </div>
  );
}

export default Generate;