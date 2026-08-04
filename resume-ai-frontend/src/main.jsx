import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import "./App.css";

import Root from "./pages/Root";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import GenerateResume from "./pages/GenerateResume";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Service />} />
          <Route path="contact" element={<Contact />} />
          <Route path="generate-resume" element={<GenerateResume />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);