import {t} from "./i18n";

export const selectors = {
    shadowContainer: ".shadow-root-container",
    player: {
        ui: ".vk-vp-root, .player-wrapper",
        video: ".player-media",
        captions: "[data-testid='subtitles-btn']",
        controls: "[data-testid='player_controls']",
        time: ".time, [data-testid='current_time']",
    },
    columns: ".vkuiSplitCol__host",
    inputs: {
        editable: ".vkitCommentInputContentEditable",
        search: ".vkuiSearch__nativeInput",
    },
    ext: {
        speedLabel: "#ext-vk-video-controller",
        backLabel: "#ext-vk-video-back-controller",
        forwardLabel: "#ext-vk-video-forward-controller",
        rewindContainer: "#ext-vk-video-rewind-container",
    },
};

export const actionDescriptions = {
    back: "backward_15",
    playPause: "play_pause",
    forward: "forward_15",
    toggleCaptions: "turn_on_off_subs",
    toggleCinema: "turn_on_off_cinema",
    decreaseSpeed: "decrease_speed",
    increaseSpeed: "increase_speed",
    speedHold: "hold_space_desc",
};

export const socialLinks = {
    vk: t("vk_channel_link"),
    tg: t("tg_channel_link"),
};

export const EXT_VERSION = chrome.runtime.getManifest().version;

export const STORAGE_KEYS = {
    HOTKEYS: "hotkeys",
};
