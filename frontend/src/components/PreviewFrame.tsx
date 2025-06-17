import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';
import { Monitor, Loader2 } from 'lucide-react';

interface PreviewFrameProps {
  files: any[];
  webContainer?: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function main() {
    if (!webContainer) return;
    setLoading(true);
    try {
      const installProcess = await webContainer.spawn('npm', ['install']);
      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          // Filter out spinner characters and only log meaningful output
          if (!/^[\/-| ]$/.test(data.trim())) {
            // Uncomment for debugging: console.log(data);
          }
        }
      }));
      await installProcess.exit;

      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          // Filter out spinner characters and only log meaningful output
          if (!/^[\/-| ]$/.test(data.trim())) {
            // Uncomment for debugging: console.log(data);
          }
        }
      }));
      devProcess.exit.then(code => {
        if (code !== 0) {
          setLoading(false);
          alert('Dev server failed to start!');
        }
      });

      // Wait for `server-ready` event
      let serverReady = false;
      webContainer.on('server-ready', (port, url) => {
        serverReady = true;
        setUrl(url);
        setLoading(false);
      });

      // Fallback: If server-ready is not emitted, set URL manually after a delay
      setTimeout(() => {
        if (!serverReady) {
          setUrl('http://localhost:5173');
          setLoading(false);
        }
      }, 5000); // 5 seconds fallback
    } catch (error) {
      console.error('Error starting preview:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    main()
  }, [webContainer])

  return (
    <div className="h-full glass rounded-xl overflow-hidden">
      {!webContainer && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">WebContainer not available</p>
            <p className="text-sm text-gray-500">Preview will be available once container is ready</p>
          </div>
        </div>
      )}
      
      {webContainer && !url && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {loading ? (
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              ) : (
                <Monitor className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-gray-400 mb-2">
              {loading ? 'Starting preview server...' : 'Loading preview...'}
            </p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        </div>
      )}
      
      {url && (
        <iframe 
          width="100%" 
          height="100%" 
          src={url}
          className="border-0"
          title="Website Preview"
        />
      )}
    </div>
  );
}