import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./home/page"; // relative path from App.jsx
import ProductPage from "./productpage/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/products" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
