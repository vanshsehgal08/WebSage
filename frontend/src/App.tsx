import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Builder } from './pages/Builder';

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Main App Content */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
        </Routes>
      </BrowserRouter>
      {/* Custom styles for glassmorphism and gradient text */}
      <style>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .gradient-text {
          background: linear-gradient(90deg, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}

export default App;