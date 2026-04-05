import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [extensions, setExtensions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/extensions");
    setExtensions(res.data.data);
  };

  const editExtension = async (id, oldPrompt) => {
    const newPrompt = window.prompt("Edit your prompt:", oldPrompt);

    if (!newPrompt || newPrompt === oldPrompt) return;

    await axios.put(`http://localhost:5000/api/extension/${id}`, {
      newPrompt,
    });

    fetchData();
  };

  const downloadAgain = async (id) => {
    const res = await axios.get(
      `http://localhost:5000/api/download/${id}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "extension.zip";
    link.click();
  };

  const deleteExtension = async (id) => {
    if (!window.confirm("Delete this extension?")) return;

    await axios.delete(`http://localhost:5000/api/extension/${id}`);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">

      
      <div className="flex justify-between items-center mb-6">

       
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-indigo-300">
            My Extensions
          </h1>
        </div>

   
        <button
          onClick={() => navigate("/generate")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90"
        >
          + New
        </button>
      </div>

      <div className="grid gap-4">
        {extensions.map((ext) => (
          <div
            key={ext._id}
            className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <p className="mb-2 text-gray-300">
              <b className="text-white">Prompt:</b> {ext.prompt}
            </p>

            <div className="flex gap-2 mb-3 flex-wrap">
              <button
                onClick={() => editExtension(ext._id, ext.prompt)}
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
              >
                Edit
              </button>

              <button
                onClick={() => downloadAgain(ext._id)}
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
              >
                Download
              </button>

              <button
                onClick={() => deleteExtension(ext._id)}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            <details>
              <summary className="cursor-pointer text-gray-400">
                View Files
              </summary>

              {Object.keys(ext.files).map((file) => (
                <pre
                  key={file}
                  className="bg-black/70 p-2 mt-2 rounded text-sm overflow-x-auto text-green-400"
                >
                  {ext.files[file]}
                </pre>
              ))}
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;