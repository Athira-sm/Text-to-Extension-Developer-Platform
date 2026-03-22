import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [extensions, setExtensions] = useState([]);

  useEffect(() => {
    fetchExtensions();
  }, []);

  const fetchExtensions = async () => {
    const res = await axios.get("http://localhost:5000/api/extensions");
    setExtensions(res.data.data);
  };

  return (
    <div>
      <h1>My Extensions</h1>

      {extensions.map((ext) => (
        <div key={ext._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <p><strong>Prompt:</strong> {ext.prompt}</p>
          <p><strong>Date:</strong> {new Date(ext.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;