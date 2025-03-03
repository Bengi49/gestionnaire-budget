export const getUserAgentInfo = async () => {
    try {   
        if (navigator.userAgentData) {
            const platformInfo = await navigator.userAgentData.getHighEntropyValues([
                "platform",
                "platformVersion",
                "architecture",
                "model",
                "mobile",
                "bitness"
            ]);
            
            return {
                platform: platformInfo.platform,
                platformVersion: platformInfo.platformVersion,
                architecture: platformInfo.architecture,
                isMobile: platformInfo.mobile,
                brand: navigator.userAgentData.brands[0].brand
            };
        } 
        return getFallbackUserAgentInfo();
    } catch (error) {
        console.error('Erreur lors de la récupération des données UA:', error);
        return getFallbackUserAgentInfo();
    }
};

const getFallbackUserAgentInfo = () => {
    // Utiliser une détection moderne de la plateforme
    const userAgentString = navigator.userAgent.toLowerCase();
    const platform = getPlatformInfo(userAgentString);
    
    return {
        platform: platform.name,
        platformVersion: platform.version,
        architecture: platform.arch,
        isMobile: detectMobile(userAgentString),
        brand: getBrowserInfo(userAgentString)
    };
};

const getPlatformInfo = (ua) => {
    if (ua.includes('win')) {
        return {
            name: 'Windows',
            version: getWindowsVersion(ua),
            arch: ua.includes('win64') || ua.includes('wow64') ? 'x64' : 'x86'
        };
    }
    if (ua.includes('mac')) {
        return {
            name: 'macOS',
            version: getMacVersion(ua),
            arch: 'x64'
        };
    }
    if (ua.includes('linux')) {
        return {
            name: 'Linux',
            version: 'unknown',
            arch: ua.includes('x86_64') ? 'x64' : 'x86'
        };
    }
    return {
        name: 'unknown',
        version: 'unknown',
        arch: 'unknown'
    };
};

const getWindowsVersion = (ua) => {
    if (ua.includes('windows nt 10.0')) return '10/11';
    if (ua.includes('windows nt 6.3')) return '8.1';
    if (ua.includes('windows nt 6.2')) return '8';
    if (ua.includes('windows nt 6.1')) return '7';
    return 'unknown';
};

const getMacVersion = (ua) => {
    const match = ua.match(/mac os x (\d+[._]\d+[._]\d+)/);
    return match ? match[1].replace(/_/g, '.') : 'unknown';
};

const detectMobile = (ua) => {
    return /mobile|android|iphone|ipad|ipod|windows phone/i.test(ua);
};

const getBrowserInfo = (ua) => {
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    return 'unknown';
};