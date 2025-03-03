// import { version } from "../../node_modules/validator/index.js";
import { getUserAgentInfo } from "./userAgentHelper.js";

async function displayUserAgentInfo() {
    try {
        const uaInfo = await getUserAgentInfo();

        const plaformElement = document.getElementById('platform');
            if (plaformElement) {
                plaformElement.textContent = `
                    Platform: ${uaInfo.platform}
                    Version: ${uaInfo.platformVersion}
                    Architecture: ${uaInfo.architecture}
                    Mobile: ${uaInfo.isMobile ? 'Yes' : 'No'}
                    Browser: ${uaInfo.brand}
                `;
            }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

document.addEventListener('DOMContentLoaded', displayUserAgentInfo);
