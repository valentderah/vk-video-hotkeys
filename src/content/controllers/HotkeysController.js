import {defaultHotkeys, playerConfig} from "../../shared/config";
import {getHotkeys} from "../../shared/utils/storage";
import {STORAGE_KEYS} from "../../shared/utils/constants";

export class HotkeysController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.timeouts = {
            spacePress: null,
        };

        this.state = {
            isHoldingSpace: false,
            originalSpeed: 1.0,
        };

        this.config = {
            baseUiTimeout: 200,
        };

        this.keyConfig = {...defaultHotkeys};
        this.actionMap = {};

        this.loadHotkeys();

        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === "sync" && changes[STORAGE_KEYS.HOTKEYS]) {
                this.updateKeyConfig(changes[STORAGE_KEYS.HOTKEYS].newValue);
            }
        });

        this.actions = {
            increaseSpeed: () =>
                this.eventBus.emit("request:changeSpeed", {
                    gap: playerConfig.speedGap,
                }),
            decreaseSpeed: () =>
                this.eventBus.emit("request:changeSpeed", {
                    gap: -playerConfig.speedGap,
                }),
            toggleCaptions: () => this.eventBus.emit("request:toggleCaptions"),
            toggleCinema: () => this.eventBus.emit("request:toggleCinema"),
            forward: () =>
                this.eventBus.emit("request:seek", {gap: playerConfig.rewindGap}),
            playPause: () => this.eventBus.emit("request:togglePlay"),
            back: () =>
                this.eventBus.emit("request:seek", {gap: -playerConfig.rewindGap}),
            seek0: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 0}),
            seek10: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 10}),
            seek20: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 20}),
            seek30: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 30}),
            seek40: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 40}),
            seek50: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 50}),
            seek60: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 60}),
            seek70: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 70}),
            seek80: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 80}),
            seek90: () =>
                this.eventBus.emit("request:seekToPercent", {percent: 90}),
            speedHold: (e) => this.handleSpaceDown(e),
        };
    }

    async loadHotkeys() {
        const hotkeys = await getHotkeys();
        this.updateKeyConfig(hotkeys);
    }

    updateKeyConfig(hotkeys) {
        this.keyConfig = {...defaultHotkeys, ...hotkeys};
        this.actionMap = Object.entries(this.keyConfig).reduce(
            (acc, [action, code]) => {
                acc[code] = action;
                return acc;
            },
            {}
        );
    }

    handleKeydown(e) {
        const actionName = this.actionMap[e.code];
        if (actionName && this.actions[actionName]) {
            e.preventDefault();
            e.stopPropagation();
            this.actions[actionName](e);
        }
    }

    handleKeyup(e) {
        if (e.code === this.keyConfig.speedHold) {
            e.preventDefault();
            e.stopPropagation();
            this.handleSpaceUp();
        }
    }

    handleSpaceDown(e) {
        if (e.repeat || this.state.isHoldingSpace) return;

        this.timeouts.spacePress = setTimeout(() => {
            this.timeouts.spacePress = null;
            this.state.isHoldingSpace = true;
            this.eventBus.emit('request:holdSpeed', {holdSpeed: playerConfig.holdSpeed});
        }, this.config.baseUiTimeout);
    }

    handleSpaceUp() {
        if (this.timeouts.spacePress) {
            clearTimeout(this.timeouts.spacePress);
            this.timeouts.spacePress = null;

            if (!this.state.isHoldingSpace) {
                this.eventBus.emit('request:togglePlay');
            }
        } else if (this.state.isHoldingSpace) {
            this.state.isHoldingSpace = false;
            this.eventBus.emit('request:releaseHoldSpeed');
        }
    }
}