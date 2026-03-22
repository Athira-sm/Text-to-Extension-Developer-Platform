import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Generate />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;