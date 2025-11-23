import React from "react";
import Table from "../components/Table";
import Logo from "../components/Logo";
import SocialLinks from "../components/SocialLinks";
import {t} from "../../shared/utils/i18n";
import {EXT_VERSION, actionDescriptions} from "../../shared/utils/constants";
import {useHotkeys} from "../hooks/useHotkeys";

const App = () => {
    const {hotkeys, updateHotkey, reset} = useHotkeys();

    const tableData = Object.entries(actionDescriptions).map(
        ([actionKey, descKey]) => ({
            key: hotkeys[actionKey] || "...",
            action: t(descKey),
            actionKey: actionKey,
        })
    );

    return (
        <div className="center">
            <Logo/>
            <div className="gray-small-text center-text xx-small w-100 pt-0">
                {`${t("ext_version")}: ${EXT_VERSION}`}
            </div>
            <div className="min-v300">
                <Table data={tableData} onUpdate={updateHotkey}/>
                <div className="footer-controls">
                    <div
                        className="reset-btn"
                        onClick={reset}
                    >
                        {t("reset_defaults")}
                    </div>
                    <SocialLinks/>
                </div>
            </div>
        </div>
    );
};

export default App;
