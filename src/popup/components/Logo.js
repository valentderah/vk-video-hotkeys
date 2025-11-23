import React from 'react';
import {t} from '../../shared/utils/i18n';

const Logo = () => {
    return <div className="table-title" dangerouslySetInnerHTML={{__html: t("colored_logo")}}></div>;
};

export default Logo;