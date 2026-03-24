import { BrowserRouter, Routes, Route } from "react-router-dom";
import BarChart from "./BarChart";
import Home from "./Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/vendas" element={<BarChart />} />
      </Routes>
    </BrowserRouter>
  );     
}

export default App;
