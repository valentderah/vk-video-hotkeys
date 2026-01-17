/**
 * Утилита для работы с Shadow DOM плеера VK Video
 */

/**
 * Получает Shadow Root контейнера плеера
 * @returns {ShadowRoot|null}
 */
export const getShadowRoot = () => {
    const container = document.querySelector('.shadow-root-container');
    if (!container) return null;
    return container.shadowRoot || null;
};

/**
 * Выполняет querySelector внутри Shadow DOM
 * @param {string} selector - CSS селектор
 * @returns {Element|null}
 */
export const queryShadowSelector = (selector) => {
    const shadowRoot = getShadowRoot();
    if (!shadowRoot) return null;
    return shadowRoot.querySelector(selector);
};

/**
 * Выполняет querySelectorAll внутри Shadow DOM
 * @param {string} selector - CSS селектор
 * @returns {NodeList}
 */
export const queryShadowSelectorAll = (selector) => {
    const shadowRoot = getShadowRoot();
    if (!shadowRoot) return [];
    return shadowRoot.querySelectorAll(selector);
};
