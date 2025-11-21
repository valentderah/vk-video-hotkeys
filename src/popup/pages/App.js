import React, {useEffect, useState} from 'react';
import Table from '../components/Table';
import Title from '../components/Title';
import Text from '../components/Text';
import SocialLinks from '../components/SocialLinks';
import {t} from '../../shared/utils/i18n';
import {tableData} from '../../shared/utils/constants';

const App = () => {
    const [version, setVersion] = useState('');

    useEffect(() => {
        setVersion(chrome.runtime.getManifest().version);
    }, []);

    return (
        <div className="center">
            <Title title={t("colored_logo")}/>
            <Text name={`${t('ext_version')}: ${version}`} classes={'gray-small-text center-text xx-small w-100'}/>
            <div className="min-v300">
                <Table threads={tableData}/>
            </div>
            <SocialLinks/>
        </div>
    );
};

export default App;