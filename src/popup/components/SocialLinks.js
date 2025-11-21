import React from 'react';
import {socialLinks} from '../../shared/utils/constants';

const SocialLinks = () => {
    const handleSocialClick = (url) => {
        chrome.tabs.create({url});
    };

    return (
        <div className="icon-row max-height-15px">
            {Object.entries(socialLinks).map(([platform, url]) => (
                <div
                    key={platform}
                    className={`icon cursor-pointer ${platform}-link`}
                    onClick={() => handleSocialClick(url)}
                >
                    <img src={`./images/social/${platform}.svg`} width="30px" alt={`${platform} icon`}/>
                </div>
            ))}
        </div>
    );
};

export default SocialLinks;