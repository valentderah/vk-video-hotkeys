import {defaultHotkeys, playerConfig} from "../shared/config";
import {selectors} from "../shared/utils/constants";
import {VideoController} from "./controllers/VideoController";
import {UIController} from "./controllers/UIController";

class VKVideoHotkeys {
    constructor() {
        this.timeouts = {
            spacePress: null,
        };

        this.state = {
            isHoldingSpace: false,
            originalSpeed: 1.0,
            retries: 0,
            intervalTime: 1000,
            maxRetries: 10,
            baseUiTimeout: 200,
        };

        this.keyConfig = {...defaultHotkeys};

        // Initialize modules
        this.videoController = new VideoController(selectors, playerConfig);
        this.uiController = new UIController(
            this.videoController,
            selectors,
            playerConfig
        );

        this.actions = {
            increaseSpeed: () =>
                this.videoController.changeSpeed(playerConfig.speedGap, () => {
                    this.uiController.showSpeedLabelTemp();
                }),
            decreaseSpeed: () =>
                this.videoController.changeSpeed(-playerConfig.speedGap, () => {
                    this.uiController.showSpeedLabelTemp();
                }),
            toggleCaptions: () => this.videoController.toggleCaptions(),
            toggleCinema: () => this.videoController.toggleCinemaMode(),
            forward: () => this.videoController.seek(playerConfig.rewindGap),
            playPause: () => this.videoController.togglePlay(),
            back: () => this.videoController.seek(-playerConfig.rewindGap),
            seek0: () => this.videoController.seekToPercent(0),
            seek10: () => this.videoController.seekToPercent(10),
            seek20: () => this.videoController.seekToPercent(20),
            seek30: () => this.videoController.seekToPercent(30),
            seek40: () => this.videoController.seekToPercent(40),
            seek50: () => this.videoController.seekToPercent(50),
            seek60: () => this.videoController.seekToPercent(60),
            seek70: () => this.videoController.seekToPercent(70),
            seek80: () => this.videoController.seekToPercent(80),
            seek90: () => this.videoController.seekToPercent(90),
            speedHold: (e) => this.handleSpaceDown(e),
        };
    }

    canInteract() {
        const element = document.activeElement;
        if (!element) return true;

        const isInput =
            element.tagName === "INPUT" || element.tagName === "TEXTAREA";
        const isContentEditable =
            element.isContentEditable ||
            element.classList.contains(selectors.inputs.editable.slice(1));

        return !isInput && !isContentEditable && !!this.videoController.video;
    }

    // --- Spacebar Hold Logic ---

    handleSpaceDown(e) {
        if (e.repeat || this.state.isHoldingSpace) return;

        this.timeouts.spacePress = setTimeout(() => {
            this.timeouts.spacePress = null;
            this.state.isHoldingSpace = true;
            this.state.originalSpeed = this.videoController.playbackRate;
            this.videoController.playbackRate = 2.0;
            this.uiController.showSpeedLabelTemp();
        }, this.state.baseUiTimeout);
    }

    handleSpaceUp() {
        if (this.timeouts.spacePress) {
            clearTimeout(this.timeouts.spacePress);
            this.timeouts.spacePress = null;

            if (!this.state.isHoldingSpace) {
                this.videoController.togglePlay();
            }
        }

        if (this.state.isHoldingSpace) {
            this.videoController.playbackRate = this.state.originalSpeed;
            this.state.isHoldingSpace = false;
            this.uiController.showSpeedLabelTemp();
        }
    }

    // --- Event Listeners ---

    handleKeydown(e) {
        if (!this.canInteract()) return;

        const actionName = Object.keys(this.keyConfig).find(
            (key) => this.keyConfig[key] === e.code
        );

        if (actionName && this.actions[actionName]) {
            e.preventDefault();
            e.stopPropagation();
            this.actions[actionName](e);
        }
    }

    handleKeyup(e) {
        if (!this.canInteract()) return;

        if (e.code === this.keyConfig.speedHold) {
            e.preventDefault();
            e.stopPropagation();
            this.handleSpaceUp();
        }
    }

    // --- Initialization ---

    async waitForPlayer() {
        let retries = 0;
        return new Promise((resolve) => {
            const check = () => {
                // Check if video exists and UI exists
                if (
                    this.videoController.video &&
                    document.querySelector(selectors.player.ui)
                ) {
                    resolve(true);
                } else if (retries >= this.state.maxRetries) {
                    resolve(false);
                } else {
                    retries++;
                    setTimeout(check, this.state.intervalTime);
                }
            };
            check();
        });
    }

    initObserver() {
        let lastPlayer = document.querySelector(selectors.player.ui);

        const observer = new MutationObserver(() => {
            const player = document.querySelector(selectors.player.ui);
            if (player && player !== lastPlayer) {
                lastPlayer = player;
                this.setup();
            }
            if (player && !this.uiController.rewindContainer) {
                this.uiController.injectControls();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    async setup() {
        const ready = await this.waitForPlayer();
        if (ready) {
            this.uiController.injectControls();
        }
    }

    init() {
        document.addEventListener("keydown", (e) => this.handleKeydown(e), true);
        document.addEventListener("keyup", (e) => this.handleKeyup(e), true);

        this.setup();
        this.initObserver();

        console.log("VK Video Hotkeys: Initialized");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
        new VKVideoHotkeys().init()
    );
} else {
    new VKVideoHotkeys().init();
}
