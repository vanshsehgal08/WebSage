import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '../config';

export function Home() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (prompt.trim()) {
          navigate("/builder", { state: { prompt } });
      }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-between p-4 transition-all">
          <div className="max-w-2xl w-full">
              <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                      <Wand2 className="w-16 h-16 text-gradient-to-r from-blue-400 to-purple-600 animate-pulse" />
                  </div>
                  <h1 className="text-5xl font-extrabold text-white mb-4">
                      Buildify
                  </h1>
                  <p className="text-xl text-gray-300">
                      Describe your dream website, and we'll help you build it
                      step by step.
                  </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 transition-all hover:shadow-xl">
                      <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe the website you want to build..."
                          className="w-full h-40 p-4 bg-gray-900 text-white border-2 border-transparent rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 transition-all"
                      />
                      <button
                          type="submit"
                          className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-gradient-to-l hover:from-green-600 hover:to-blue-500 transition-all"
                      >
                          Let's Build Your Dream Website
                      </button>
                  </div>
              </form>
          </div>

          {/* Footer */}
          <footer className="w-full bg-gray-900 text-gray-400 text-center py-4 mt-auto">
              <p className="text-sm">
                  Made with ❤️ by{" "}
                  <a
                      href="https://yourportfolio.com"
                      target="_blank"
                      className="text-blue-400 hover:underline"
                  >
                      Vansh
                  </a>
              </p>
          </footer>
      </div>
  );
}
