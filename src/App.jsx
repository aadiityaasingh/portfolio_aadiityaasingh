import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Hero from "./components/sections/Hero";
import CustomCursor from "./components/shared/CustomCursor";
import SliderEngine from "./components/shared/SliderEngine";
import Skills from "./components/sections/Skills";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";

function PortfolioHome() {
  return (
    <main>
      <CustomCursor />

      <SliderEngine>
        <Hero />
        <Skills />
        <About />
        <Projects />
        <Contact />
      </SliderEngine>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
