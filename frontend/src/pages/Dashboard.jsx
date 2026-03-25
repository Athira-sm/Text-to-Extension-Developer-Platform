import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/extensions");
      setExtensions(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const editExtension = async (id) => {
    const newPrompt = window.prompt("Enter new prompt");
    if (!newPrompt) return;

    try {
      await axios.put(`http://localhost:5000/api/extension/${id}`, {
        newPrompt,
      });
      fetchData();
    } catch (err) {
      alert("Update failed");
    }
  };

  const downloadAgain = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/download/${id}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "extension.zip";
      link.click();
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>My Extensions</h1>

      {loading && <p>Loading...</p>}

      {extensions.map((ext) => (
        <div
          key={ext._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <p><b>Prompt:</b> {ext.prompt}</p>

          <button onClick={() => editExtension(ext._id)}>Edit</button>
          <button onClick={() => downloadAgain(ext._id)}>
            Download Again
          </button>

          <details>
            <summary>View Files</summary>
            {Object.keys(ext.files).map((file) => (
              <div key={file}>
                <h4>{file}</h4>
                <pre style={{ background: "#eee", padding: 10 }}>
                  {ext.files[file]}
                </pre>
              </div>
            ))}
          </details>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;