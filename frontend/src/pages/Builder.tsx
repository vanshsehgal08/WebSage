import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileNode } from '@webcontainer/api';
import { Loader } from '../components/Loader';


const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-6">
        <h1 className="text-2xl font-semibold text-white">Buildify </h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>
  
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 h-full">
          {/* Left Sidebar: Steps List */}
          <div className="col-span-1 md:col-span-1 space-y-6 overflow-auto bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="max-h-[75vh] overflow-y-auto">
              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>
  
            {/* Prompt Input & Button */}
            <div className="mt-6">
              {(loading || !templateSet) ? (
                <Loader />
              ) : (
                <div className="flex flex-col space-y-4">
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="p-4 w-full bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder="Describe your website..."
                  />
                  <button
                    onClick={async () => {
                      const newMessage = {
                        role: "user" as "user",
                        content: userPrompt,
                      };
  
                      setLoading(true);
                      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                        messages: [...llmMessages, newMessage],
                      });
                      setLoading(false);
  
                      setLlmMessages((x) => [...x, newMessage]);
                      setLlmMessages((x) => [
                        ...x,
                        {
                          role: "assistant",
                          content: stepsResponse.data.response,
                        },
                      ]);
  
                      setSteps((s) => [
                        ...s,
                        ...parseXml(stepsResponse.data.response).map((x) => ({
                          ...x,
                          status: "pending" as "pending",
                        })),
                      ]);
                    }}
                    className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
  
          {/* File Explorer */}
          <div className="col-span-1 md:col-span-1">
            <FileExplorer
              files={files}
              onFileSelect={setSelectedFile}
              className="bg-gray-800 rounded-lg shadow-lg p-4"
            />
          </div>
  
          {/* Code and Preview Section */}
          <div className="col-span-1 md:col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-full">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
  
            <div className="h-[calc(100%-4rem)] mt-4">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}