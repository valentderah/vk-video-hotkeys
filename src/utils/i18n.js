export const t = (key) => {
    if (chrome.i18n.getMessage(key)) {
        return chrome.i18n.getMessage(key);
    }
    return key;
};