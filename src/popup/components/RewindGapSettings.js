import React, {useState, useEffect, useRef} from "react";
import {t} from "../../shared/utils/i18n";
import {getRewindGap, saveRewindGap} from "../../shared/utils/storage";
import {playerConfig} from "../../shared/config";

const RewindGapSettings = () => {
    const [rewindGap, setRewindGap] = useState(playerConfig.rewindGap);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        loadRewindGap();
    }, []);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const loadRewindGap = async () => {
        const gap = await getRewindGap();
        setRewindGap(gap);
    };

    const handleSave = async (value) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 1 || numValue > 600) {
            await loadRewindGap();
            setIsEditing(false);
            return;
        }

        setRewindGap(numValue);
        await saveRewindGap(numValue);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSave(e.target.value);
        } else if (e.key === "Escape") {
            loadRewindGap();
            setIsEditing(false);
        }
    };

    const handleBlur = (e) => {
        handleSave(e.target.value);
    };

    return (
        <div className="rewind-gap-settings">
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="number"
                    min="1"
                    max="600"
                    defaultValue={rewindGap}
                    className="rewind-gap-input"
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                />
            ) : (
                <div
                    className="rewind-gap-value"
                    onClick={() => setIsEditing(true)}
                >
                    {rewindGap} {t("seconds")}
                </div>
            )}
            <div className="rewind-gap-label">{t("rewind_gap_label")}</div>
        </div>
    );
};

export default RewindGapSettings;
