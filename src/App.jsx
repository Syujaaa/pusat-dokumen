import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddEdit from "./pages/AddEdit";
import Navbar from "./components/Navbar";
import DocumentCenter from "./components/DocumentCenter";

export default function App() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEdit />} />
        <Route path="/booklet" element={<DocumentCenter />} />
        <Route path="/edit/:id" element={<AddEdit />} />
      </Routes>
    </div>
  );
}
