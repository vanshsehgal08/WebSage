import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';
import { Monitor, Loader2, Terminal, RefreshCw } from 'lucide-react';

interface PreviewFrameProps {
  files: any[];
  webContainer?: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Helper to add logs
  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  async function main(forceInstall = false) {
    if (!webContainer) {
      console.log('PreviewFrame: WebContainer not available');
      return;
    }
    
    // Reset state
    setLoading(true);
    setUrl("");
    setLogs([]); // Clear logs on new run
    addLog('Starting preview process...');

    try {
      // Check if node_modules already exists to skip install
      let installNeeded = true;
      
      if (!forceInstall) {
        try {
          await webContainer.fs.readdir('/node_modules');
          installNeeded = false;
          addLog('node_modules exists, skipping install');
        } catch (error) {
          addLog('node_modules missing, running install');
        }
      } else {
         addLog('Force reinstall requested');
      }

      // ANSI escape code stripper
      const stripAnsi = (str: string) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

      if (installNeeded) {
        addLog('Running npm install...');
        const installProcess = await webContainer.spawn('npm', ['install', '--no-fund', '--no-audit', '--loglevel=error']);
        
        installProcess.output.pipeTo(new WritableStream({
          write(data) {
             const cleanData = stripAnsi(data);
             if (cleanData.trim()) {
                addLog(cleanData);
             }
          }
        }));
        
        const exitCode = await installProcess.exit;
        if (exitCode !== 0) {
          addLog(`npm install failed with code ${exitCode}`);
          setLoading(false);
          setShowLogs(true);
          return;
        }
        addLog('npm install completed');
      }

      addLog('Starting dev server (npm run dev)...');
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
      
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
           const cleanData = stripAnsi(data);
           if (cleanData.trim()) {
             addLog(cleanData);
           }
        }
      }));

      // Wait for `server-ready` event
      let serverReady = false;
      const onServerReady = (port: number, url: string) => {
        addLog(`Server ready on port ${port}: ${url}`);
        serverReady = true;
        setUrl(url);
        setLoading(false);
      };
      
      webContainer.on('server-ready', onServerReady);

      // Fallback: If server-ready is not emitted, set URL manually after a delay
      setTimeout(() => {
        if (!serverReady) {
            addLog('Server ready timeout, falling back to localhost:5173');
          setUrl('http://localhost:5173');
          setLoading(false);
        }
      }, 8000); 

      devProcess.exit.then(code => {
        if (code !== 0) {
          addLog(`Dev server exited with code ${code}`);
          setLoading(false);
          setShowLogs(true);
          // alert('Dev server failed to start!');
        }
      });

    } catch (error: any) {
      console.error('Error starting preview:', error);
      addLog(`Error: ${error.message}`);
      setLoading(false);
      setShowLogs(true);
    }
  }

  useEffect(() => {
    main();
  }, [webContainer]); // Re-run when container becomes available

  return (
    <div className="h-full glass rounded-xl overflow-hidden flex flex-col relative">
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button 
                onClick={() => setShowLogs(!showLogs)}
                className="p-2 bg-gray-900/80 text-white rounded-lg hover:bg-gray-800 transition-colors"
                title="Toggle Terminal Logs"
            >
                <Terminal className="w-4 h-4" />
            </button>
            <button 
                onClick={() => main(true)}
                className="p-2 bg-gray-900/80 text-white rounded-lg hover:bg-gray-800 transition-colors"
                title="Reinstall & Restart"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>

      {!webContainer && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
             {/* ... existing SVG ... */}
             <p className="text-gray-400 mb-2">WebContainer not available</p>
          </div>
        </div>
      )}
      
      {webContainer && !url && !showLogs && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            {loading && <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />}
            <p className="text-gray-400 mb-2">
              {loading ? 'Starting preview server...' : 'Loading...'}
            </p>
          </div>
        </div>
      )}

        {(showLogs) && (
            <div className={`flex-1 bg-black p-4 overflow-auto font-mono text-xs text-green-400 ${url ? 'h-1/3 border-t border-gray-800' : 'h-full'}`}>
                {logs.map((log, i) => (
                    <div key={i} className="whitespace-pre-wrap">{log}</div>
                ))}
                {logs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
            </div>
        )}
      
      {url && (
        <iframe 
          width="100%" 
          height="100%" 
          src={url}
          className={`border-0 ${showLogs ? 'h-2/3' : 'h-full'}`}
          title="Website Preview"
        />
      )}
    </div>
  );
}