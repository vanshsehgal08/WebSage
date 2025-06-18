import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Code, Zap, Rocket, ArrowRight, Play, Layers, Palette, LogOut } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL, supabase } from '../config';

export function Home() {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (prompt.trim()) {
          navigate("/builder", { state: { prompt } });
      }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Advanced AI that understands your vision and creates stunning websites"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Full-Stack Ready",
      description: "Complete frontend and backend code generation in one platform"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Modern Design",
      description: "Beautiful, responsive designs that work on all devices"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Preview",
      description: "See your website come to life in real-time as you build"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Top Bar: Logout Button */}
      <div className="flex justify-end items-center px-8 py-6 z-50 relative">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 rounded-2xl glassmorphism shadow-lg text-white font-semibold text-base hover:bg-white/10 transition-all duration-200 border border-white/10 backdrop-blur-xl group"
          style={{background: 'rgba(255,255,255,0.08)'}}
        >
          <LogOut className="w-5 h-5 text-pink-400 group-hover:text-purple-400 transition" />
          <span className="gradient-text">Logout</span>
        </button>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center glow">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse-slow"></div>
              </div>
            </div>
            
            <h1 className="text-7xl font-black mb-6">
              <span className="gradient-text">WebSage</span>
            </h1>
            
            <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into stunning full-stack websites with the power of AI. 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold"> No coding required.</span>
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="glass glass-hover rounded-xl p-6 text-center group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Input Section */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="glass glass-hover rounded-2xl p-8 glow-hover">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Start Building Your Dream Website</h2>
                  <p className="text-gray-400">Describe what you want to create, and let AI do the rest</p>
                </div>
                
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Describe your dream website... For example: 'A modern e-commerce site for handmade jewelry with a dark theme, shopping cart, and payment integration'"
                    className={`w-full h-32 p-6 glass rounded-xl text-white placeholder-gray-500 resize-none transition-all duration-300 ${
                      isFocused ? 'border-purple-500/50 glow' : 'border-transparent'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                  />
                  
                  <div className="absolute bottom-4 right-4">
                    <button
                      type="submit"
                      disabled={!prompt.trim()}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        prompt.trim() 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105' 
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <Rocket className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Press Enter to start</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>AI-powered generation</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Examples */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-white mb-6">Popular Examples</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "E-commerce store",
                "Portfolio website", 
                "Blog platform",
                "Dashboard app",
                "Landing page",
                "Social network"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(`Create a ${example.toLowerCase()}`)}
                  className="px-4 py-2 glass glass-hover rounded-full text-sm text-gray-300 hover:text-white transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-8 mt-16">
          <div className="glass rounded-xl p-6 max-w-md mx-auto">
            <p className="text-gray-400 text-sm">
              Made with <span className="text-pink-500">❤️</span> by{" "}
              <a
                href="https://yourportfolio.com"
                target="_blank"
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:underline"
              >
                Vansh
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
