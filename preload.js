const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    handleRecaptcha: (callback) => {
        const wrappedCallback = (_, ...args) => callback(...args);
        ipcRenderer.on('recaptcha-validation', wrappedCallback);
        return () => {
            ipcRenderer.removeListener('recaptcha-validation', wrappedCallback);
        };
    },
    verifyRecaptcha: async (token) => {
        try {
            const result = await ipcRenderer.invoke('verify-recaptcha', token);
            return result;
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            throw error;
        }
    }
});