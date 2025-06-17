import React from 'react';
import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
          activeTab === 'code'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
            : 'glass glass-hover text-gray-400 hover:text-white'
        }`}
      >
        <Code2 className="w-4 h-4" />
        <span className="font-medium">Code Editor</span>
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
          activeTab === 'preview'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
            : 'glass glass-hover text-gray-400 hover:text-white'
        }`}
      >
        <Eye className="w-4 h-4" />
        <span className="font-medium">Live Preview</span>
      </button>
    </div>
  );
}