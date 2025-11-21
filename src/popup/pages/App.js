import React, {useEffect, useState} from 'react';
import Table from '../components/Table';
import Text from '../components/Text';
import Logo from '../components/Logo';
import SocialLinks from '../components/SocialLinks';
import {t} from '../../shared/utils/i18n';
import {tableData, EXT_VERSION} from '../../shared/utils/constants';

const App = () => {
    return (
        <div className="center">
            <Logo/>
            <Text name={`${t('ext_version')}: ${EXT_VERSION}`}
                  classes={'gray-small-text center-text xx-small w-100'}/>
            <div className="min-v300">
                <Table data={tableData}/>
            </div>
            <SocialLinks/>
        </div>
    );
};

export default App;