import {getSpeedLabel} from "../templates/speedLabel";
import {getControls} from "../templates/controls";
import {queryShadowSelector} from "../../shared/utils/shadowDom";
import {getRewindGap} from "../../shared/utils/storage";
import {STORAGE_KEYS} from "../../shared/utils/constants";
import {playerConfig} from "../../shared/config";

export class InterfaceController {
    constructor(eventBus, selectors, config) {
        this.eventBus = eventBus;
        this.selectors = selectors;
        this.config = config;
        this.state = {
            rewindGap: config.rewindGap,
        };
        this.timeouts = {
            showSpeed: null,
        };
        this.intervalTime = 1000;

        this.loadRewindGap();
        this.listenToEvents();
        this.listenToStorageChanges();
    }

    listenToEvents() {
        this.eventBus.on("video:speedChanged", () => this.showSpeedLabelTemp());
    }

    listenToStorageChanges() {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === "sync" && changes[STORAGE_KEYS.REWIND_GAP]) {
                this.state.rewindGap = changes[STORAGE_KEYS.REWIND_GAP].newValue ?? this.config.rewindGap;
            }
        });
    }

    async loadRewindGap() {
        const gap = await getRewindGap();
        this.state.rewindGap = gap;
    }

    get video() {
        return queryShadowSelector(this.selectors.player.video);
    }

    get speedLabel() {
        // Метка скорости должна быть в Shadow DOM рядом с видео
        return queryShadowSelector(this.selectors.ext.speedLabel);
    }

    get rewindContainer() {
        // Контейнер перемотки должен быть в Shadow DOM
        return queryShadowSelector(this.selectors.ext.rewindContainer);
    }

    ensureSpeedLabel() {
        let label = this.speedLabel;
        if (!label) {
            const video = this.video;
            if (!video) return null;

            const videoContainer = video.parentNode;
            if (!videoContainer) return null;
            
            videoContainer.style.position = "relative";

            const html = getSpeedLabel(
                video.playbackRate,
                this.selectors.ext.speedLabel.slice(1)
            );

            // Вставляем в Shadow DOM
            videoContainer.insertAdjacentHTML("afterbegin", html);
            label = this.speedLabel;
        }
        return label;
    }

    updateSpeedLabelText() {
        const label = this.ensureSpeedLabel();
        if (label && this.video) {
            const speed = this.video.playbackRate;
            const textSpan = label.querySelector(".speed");
            if (textSpan) textSpan.textContent = `${speed.toFixed(2)}x`;
        }
    }

    hideSpeedLabel() {
        const label = this.speedLabel;
        if (label) {
            label.remove();
        }
    }

    showSpeedLabelTemp() {
        clearTimeout(this.timeouts.showSpeed);
        this.updateSpeedLabelText();

        this.timeouts.showSpeed = setTimeout(() => {
            this.hideSpeedLabel();
        }, this.intervalTime);
    }

    injectControls() {
        if (this.rewindContainer) return;

        // Ищем элемент времени в Shadow DOM
        const timeSelector = queryShadowSelector(this.selectors.player.time);
        if (!timeSelector) return;

        const html = getControls(
            this.selectors.ext.backLabel.slice(1),
            this.selectors.ext.forwardLabel.slice(1)
        );

        timeSelector.insertAdjacentHTML("beforebegin", html);
        this.initControlEvents();
    }

    initControlEvents() {
        const backBtn = queryShadowSelector(this.selectors.ext.backLabel);
        const forwardBtn = queryShadowSelector(this.selectors.ext.forwardLabel);

        if (backBtn) {
            backBtn.onclick = (e) => {
                e.stopPropagation();
                this.eventBus.emit("request:seek", {gap: -this.state.rewindGap});
            };
        }

        if (forwardBtn) {
            forwardBtn.onclick = (e) => {
                e.stopPropagation();
                this.eventBus.emit("request:seek", {gap: this.state.rewindGap});
            };
        }
    }
}
