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
                bootPromise = WebContainer.boot();
                const instance = await bootPromise;
                globalWebContainer = instance;
                setWebcontainer(instance);
            } catch (error) {
                console.error('Failed to boot WebContainer:', error);
                bootPromise = null;
            }
        }

        bootWebContainer();
    }, []);

    return webcontainer;
}