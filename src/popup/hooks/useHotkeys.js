import {useState, useEffect, useCallback} from "react";
import {
    getHotkeys,
    saveHotkeys,
    resetHotkeys as resetStorage,
} from "../../shared/utils/storage";
import {defaultHotkeys} from "../../shared/config";

export const useHotkeys = () => {
    const [hotkeys, setHotkeys] = useState(defaultHotkeys);

    const loadHotkeys = useCallback(async () => {
        const keys = await getHotkeys();
        setHotkeys(keys);
    }, []);

    useEffect(() => {
        loadHotkeys();
    }, [loadHotkeys]);

    const updateHotkey = useCallback(
        async (action, newKey) => {
            setHotkeys((prev) => {
                const newHotkeys = {...prev, [action]: newKey};
                saveHotkeys(newHotkeys);
                return newHotkeys;
            });
        },
        []
    );

    const reset = useCallback(async () => {
        await resetStorage();
        await loadHotkeys();
    }, [loadHotkeys]);

    return {hotkeys, updateHotkey, reset};
};