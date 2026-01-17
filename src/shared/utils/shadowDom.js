import {selectors} from "./constants";

export const getShadowRoot = () => {
    const container = document.querySelector(selectors.shadowContainer);
    if (!container) return null;
    return container.shadowRoot || null;
};


export const queryShadowSelector = (selector) => {
    const shadowRoot = getShadowRoot();
    if (!shadowRoot) return null;
    return shadowRoot.querySelector(selector);
};

export const queryShadowSelectorAll = (selector) => {
    const shadowRoot = getShadowRoot();
    if (!shadowRoot) return [];
    return shadowRoot.querySelectorAll(selector);
};
