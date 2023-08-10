import React from "react";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import CalculateValues from "./components/CalculateValues";
import CryptoSummary from "./components/CryptoSummary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPageFound from "./components/NoPageFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculate" element={<CalculateValues />} />
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
