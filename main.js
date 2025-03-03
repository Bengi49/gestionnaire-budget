const { app, BrowserWindow } = require('electron');
const path = require('path');
const crypto = require('crypto');

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: true,
            allowRunningInsecureContent: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Configuration CSP sécurisée
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    `default-src 'self';` +
                    `script-src 'self' 'nonce-${generateNonce()}' https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net https://www.recaptcha.net;` +
                    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com;` +
                    `img-src 'self' data: https: https://www.gstatic.com;` +
                    `font-src 'self' https://fonts.gstatic.com;` +
                    `frame-src 'self' https://www.google.com https://www.recaptcha.net;` +
                    `connect-src 'self' https://api.emailjs.com https://www.google.com https://www.recaptcha.net;` +
                    `base-uri 'self';` +
                    `form-action 'self';` +
                    `frame-ancestors 'none';`
                ],
                'X-Content-Type-Options': ['nosniff'],
                'X-Frame-Options': ['DENY'],
                'X-XSS-Protection': ['1; mode=block'],
                'Referrer-Policy': ['strict-origin-when-cross-origin'],
                'Strict-Transport-Security': ['max-age=31536000; includeSubDomains']
            }
        });
    });

    // Empêcher la navigation vers des URL non sécurisées
    win.webContents.on('will-navigate', (event, url) => {
        const parsedUrl = new URL(url);
        if (!parsedUrl.protocol.includes('https')) {
            event.preventDefault();
        }
    });

    win.loadFile('src/index.html');
}

function generateNonce() {
    return crypto.randomBytes(16).toString('base64');
}

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    console.error('Erreur non capturée :', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Promesse rejetée non gérée :', error);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
