import React, { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown, FolderOpen } from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-all duration-200 group"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="text-gray-400 group-hover:text-purple-400 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {item.type === 'folder' ? (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <FolderTree className="w-4 h-4 text-blue-400" />
              )}
            </div>
          ) : (
            <File className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-gray-200 text-sm truncate group-hover:text-white transition-colors">
            {item.name}
          </span>
        </div>
      </div>
      
      {item.type === 'folder' && isExpanded && item.children && (
        <div className="ml-2 border-l border-white/10">
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <FolderTree className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-white">File Explorer</h2>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {files.length > 0 ? (
          <div className="space-y-1">
            {files.map((file, index) => (
              <FileNode
                key={`${file.path}-${index}`}
                item={file}
                depth={0}
                onFileClick={onFileSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FolderTree className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">No files yet</p>
            <p className="text-gray-500 text-xs mt-1">Files will appear as AI generates your project</p>
          </div>
        )}
      </div>
    </div>
  );
}