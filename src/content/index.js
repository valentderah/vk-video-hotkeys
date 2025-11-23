import {playerConfig} from "../shared/config";
import {selectors} from "../shared/utils/constants";
import {PlayerController} from "./controllers/PlayerController";
import {InterfaceController} from "./controllers/InterfaceController";
import {HotkeysController} from "./controllers/HotkeysController";
import {EventEmitter} from "../shared/utils/EventEmitter";

class VKVideoHotkeys {
    constructor() {
        this.state = {
            isPlayerReady: false,
        };

        this.config = {
            intervalTime: 1000,
            maxRetries: 10,
        };

        const eventBus = new EventEmitter();

        // Initialize modules
        this.playerController = new PlayerController(
            eventBus,
            selectors,
            playerConfig
        );
        this.interfaceController = new InterfaceController(
            eventBus,
            selectors,
            playerConfig
        );
        this.hotkeysController = new HotkeysController(eventBus);

        eventBus.on("video:player_found", () => (this.state.isPlayerReady = true));
    }

    canInteract() {
        const element = document.activeElement;
        if (!element) return true;

        const isInput =
            element.tagName === "INPUT" || element.tagName === "TEXTAREA";
        const isContentEditable =
            element.isContentEditable || element.matches(selectors.inputs.editable);

        return !isInput && !isContentEditable && this.state.isPlayerReady;
    }

    // --- Initialization ---

    async waitForPlayer() {
        let retries = 0;
        return new Promise((resolve) => {
            const check = () => {
                // Check if video exists and UI exists
                this.playerController.checkAndEmitPlayerState();
                if (
                    this.state.isPlayerReady &&
                    document.querySelector(selectors.player.ui)
                ) {
                    resolve(true);
                } else if (retries >= this.config.maxRetries) {
                    resolve(false);
                } else {
                    retries++;
                    setTimeout(check, this.config.intervalTime);
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
            if (player && !this.interfaceController.rewindContainer) {
                this.interfaceController.injectControls();
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
            this.interfaceController.injectControls();
        }
    }

    init() {
        document.addEventListener(
            "keydown",
            (e) => {
                if (this.canInteract()) this.hotkeysController.handleKeydown(e);
            },
            true
        );
        document.addEventListener(
            "keyup",
            (e) => {
                if (this.canInteract()) this.hotkeysController.handleKeyup(e);
            },
            true
        );

        this.setup();
        this.initObserver();

        console.log("VK Video Hotkeys: Initialized");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        if (!window._vkVideoHotkeysInitialized) {
            window._vkVideoHotkeysInitialized = true;
            new VKVideoHotkeys().init();
        }
    });
} else {
    if (!window._vkVideoHotkeysInitialized) {
        window._vkVideoHotkeysInitialized = true;
        new VKVideoHotkeys().init();
    }
}
