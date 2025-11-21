import {t} from "./i18n";

export const selectors = {
    player: {
        ui: ".videoplayer_ui",
        video: ".videoplayer_media_provider",
        captions: ".videoplayer_btn_subtitles",
        controls: ".videoplayer_controls",
        time: ".videoplayer_time",
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

export const tableData = [
    {key: t("KeyJ"), action: t("backward_15")},
    {key: t("KeyK"), action: t("play_pause")},
    {key: t("KeyL"), action: t("forward_15")},
    {key: t("Key0_9"), action: t("percentage_rewind")},
    {key: t("KeyC"), action: t("turn_on_off_subs")},
    {key: t("KeyT"), action: t("turn_on_off_cinema")},
    {key: t("decrease_speed_button"), action: t("decrease_speed")},
    {key: t("increase_speed_button"), action: t("increase_speed")},
    {key: t("hold_space"), action: t("hold_space_desc")},
];

export const socialLinks = {
    vk: t("vk_channel_link"),
    tg: t("tg_channel_link"),
};
