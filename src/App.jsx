import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Personalities from "./pages/Personalities.jsx";
import AppDownload from "./pages/AppDownload.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personalities" element={<Personalities />} />
        <Route path="/app" element={<AppDownload />} />
      </Routes>
    </BrowserRouter>
  );
}
