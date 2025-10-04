import React from 'react';
import { t } from '../utils/i18n';

const SocialLinks = () => {
    const socialLinks = {
        vk: t('vk_channel_link'),
        tg: t('tg_channel_link')
    };

    const handleSocialClick = (platform) => {
        chrome.tabs.create({ url: socialLinks[platform] });
    };

    return (
        <div className="icon-row max-height-15px">
            <div className="icon cursor-pointer tg-link" onClick={() => handleSocialClick('tg')}>
                <img src="./images/social/tg.svg" width="30px" alt="icon" />
            </div>
            <div className="icon cursor-pointer vk-link" onClick={() => handleSocialClick('vk')}>
                <img src="./images/social/vk.svg" width="30px" alt="icon" />
            </div>
        </div>
    );
};

export default SocialLinks;