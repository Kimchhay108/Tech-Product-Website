import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./homepage/page";
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
