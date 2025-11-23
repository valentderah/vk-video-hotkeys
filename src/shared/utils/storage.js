import {defaultHotkeys} from "../config";
import {STORAGE_KEYS} from "./constants";

export const getHotkeys = async () => {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.HOTKEYS);
    return {...defaultHotkeys, ...result[STORAGE_KEYS.HOTKEYS]};
};

export const saveHotkeys = async (hotkeys) => {
    return chrome.storage.sync.set({[STORAGE_KEYS.HOTKEYS]: hotkeys});
};

export const resetHotkeys = async () => {
    return chrome.storage.sync.remove(STORAGE_KEYS.HOTKEYS);
};
