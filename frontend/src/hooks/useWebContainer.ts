import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

// Global WebContainer instance to prevent multiple boots
let globalWebContainer: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(globalWebContainer);

    useEffect(() => {
        async function bootWebContainer() {
            if (globalWebContainer) {
                setWebcontainer(globalWebContainer);
                return;
            }

            if (bootPromise) {
                const instance = await bootPromise;
                setWebcontainer(instance);
                return;
            }

            try {
                console.log('Booting WebContainer...');
                console.log('Cross-Origin-Isolated:', window.crossOriginIsolated);
                console.log('SharedArrayBuffer available:', typeof SharedArrayBuffer !== 'undefined');
                
                bootPromise = WebContainer.boot();
                const instance = await bootPromise;
                globalWebContainer = instance;
                setWebcontainer(instance);
                console.log('WebContainer booted successfully');
            } catch (error) {
                console.error('Failed to boot WebContainer:', error);
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    crossOriginIsolated: window.crossOriginIsolated,
                    sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined'
                });
                bootPromise = null;
            }
        }

        bootWebContainer();
    }, []);

    return webcontainer;
}