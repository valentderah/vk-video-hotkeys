import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import Title from '../components/Title';
import Text from '../components/Text';
import SocialLinks from '../components/SocialLinks';
import { t } from '../utils/i18n';

const App = () => {
    const [version, setVersion] = useState('');

    useEffect(() => {
        setVersion(chrome.runtime.getManifest().version);
    }, []);

    const tableData = [
        { key: t("KeyJ"), action: t("backward_15") },
        { key: t("KeyK"), action: t("play_pause") },
        { key: t("KeyL"), action: t("forward_15") },
        { key: t("Key0_9"), action: t("percentage_rewind") },
        { key: t("KeyC"), action: t("turn_on_off_subs") },
        { key: t("KeyT"), action: t("turn_on_off_cinema") },
        { key: t("decrease_speed_button"), action: t("decrease_speed") },
        { key: t("increase_speed_button"), action: t("increase_speed") }
    ];

    return (
        <div className="center">
            <Title title={t("colored_logo")} />
            <Text name={`${t('ext_version')}: ${version}`} classes={'gray-small-text center-text xx-small w-100'} />
            <div className=".min-v300">
                <Table threads={tableData} />
            </div>
            <SocialLinks />
        </div>
    );
};

export default App;