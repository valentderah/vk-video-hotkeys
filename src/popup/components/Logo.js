import React from 'react';
import { t } from '../../shared/utils/i18n';

const Logo = () => {
    return (
        <div className="table-title">
            {t('logo_part_1')} <span className="logo-colored">{t('logo_part_2')}</span> {t('logo_part_3')}
        </div>
    );
};

export default Logo;