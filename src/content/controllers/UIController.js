import {getSpeedLabel} from "../templates/speedLabel";
import {getControls} from "../templates/controls";

export class UIController {
    constructor(videoController, selectors, config) {
        this.videoController = videoController;
        this.selectors = selectors;
        this.config = config;
        this.timeouts = {
            showSpeed: null,
        };
        this.intervalTime = 1000;
    }

    get video() {
        return this.videoController.video;
    }

    get speedLabel() {
        return document.querySelector(this.selectors.ext.speedLabel);
    }

    get rewindContainer() {
        return document.querySelector(this.selectors.ext.rewindContainer);
    }

    ensureSpeedLabel() {
        let label = this.speedLabel;
        if (!label) {
            const video = this.video;
            if (!video) return null;

            const html = getSpeedLabel(
                video.playbackRate,
                this.selectors.ext.speedLabel.slice(1)
            );

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            label = doc.body.firstElementChild;

            video.parentNode.insertBefore(label, video);
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

        const timeSelector = document.querySelector(this.selectors.player.time);
        if (!timeSelector) return;

        const parser = new DOMParser();
        const html = getControls(
            this.selectors.ext.backLabel.slice(1),
            this.selectors.ext.forwardLabel.slice(1)
        );
        const doc = parser.parseFromString(html, "text/html");
        const controls = doc.body.firstElementChild;

        timeSelector.parentNode.insertBefore(controls, timeSelector);
        this.initControlEvents();
    }

    initControlEvents() {
        const backBtn = document.querySelector(this.selectors.ext.backLabel);
        const forwardBtn = document.querySelector(this.selectors.ext.forwardLabel);

        if (backBtn) {
            backBtn.onclick = (e) => {
                e.stopPropagation();
                this.videoController.seek(-this.config.rewindGap);
            };
        }

        if (forwardBtn) {
            forwardBtn.onclick = (e) => {
                e.stopPropagation();
                this.videoController.seek(this.config.rewindGap);
            };
        }
    }
}
