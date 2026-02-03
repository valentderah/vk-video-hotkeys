import {queryShadowSelector} from "../../shared/utils/shadowDom";

export class PlayerController {
    constructor(eventBus, selectors, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.selectors = selectors;
        this.originalSpeed = 1.0;

        this.listenToEvents();
    }

    listenToEvents() {
        this.eventBus.on('request:changeSpeed', ({gap}) => this.changeSpeed(gap));
        this.eventBus.on('request:toggleCaptions', () => this.toggleCaptions());
        this.eventBus.on('request:toggleCinema', () => this.toggleCinemaMode());
        this.eventBus.on('request:seek', ({gap}) => this.seek(gap));
        this.eventBus.on('request:togglePlay', () => this.togglePlay());
        this.eventBus.on('request:seekToPercent', ({percent}) => this.seekToPercent(percent));
        this.eventBus.on('request:holdSpeed', ({holdSpeed}) => {
            this.originalSpeed = this.playbackRate;
            this.playbackRate = holdSpeed;
            this.eventBus.emit('video:speedChanged');
        });
        this.eventBus.on('request:releaseHoldSpeed', () => {
            this.playbackRate = this.originalSpeed;
            this.eventBus.emit('video:speedChanged');
        });
        this.eventBus.on('request:flipHorizontal', () => this.flipHorizontal());
    }

    flipHorizontal() {
        const video = this.video;
        if (!video) return;

        const matrix = new DOMMatrix(getComputedStyle(video).transform);
        matrix.scaleSelf(-1, 1, 1); // Flips horizontally

        video.style.setProperty('transform', matrix.toString(), 'important');
    }

    checkAndEmitPlayerState() {
        if (this.video) {
            this.eventBus.emit('video:player_found');
        }
    }

    get video() {
        return queryShadowSelector(this.selectors.player.video);
    }

    toggleCinemaMode() {
        if (!this.video) return;

        const shadowContainer = document.querySelector(this.selectors.shadowContainer);
        if (!shadowContainer) return;
        
        const videoWrapper = shadowContainer.closest(this.selectors.columns);
        if (!videoWrapper) return;

        const recommendations = videoWrapper.nextElementSibling;
        if (recommendations) {
            recommendations.style.display =
                recommendations.style.display === "none" ? "" : "none";
        }
    }

    togglePlay() {
        const video = this.video;
        if (!video) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    seek(gap) {
        const video = this.video;
        if (!video) return;

        video.currentTime = Math.min(
            Math.max(video.currentTime + gap, 0),
            video.duration
        );
    }

    seekToPercent(percent) {
        const video = this.video;
        if (video && video.duration) {
            video.currentTime = video.duration * (percent / 100);
        }
    }

    toggleCaptions() {
        const video = this.video;
        if (!video) return;

        const captionsBtn = queryShadowSelector(this.selectors.player.captions);
        if (captionsBtn) {
            captionsBtn.click();
            return;
        }

        if (video.textTracks.length > 0) {
            const track = video.textTracks[0];
            track.mode = track.mode === "showing" ? "hidden" : "showing";
        }
    }

    changeSpeed(gap) {
        const video = this.video;
        if (!video) return;

        let newSpeed = video.playbackRate + gap;

        newSpeed = Math.max(
            this.config.minSpeed,
            Math.min(newSpeed, this.config.maxSpeed)
        );

        video.playbackRate = Math.round(newSpeed * 100) / 100;

        this.eventBus.emit('video:speedChanged');
    }

    get playbackRate() {
        const video = this.video;
        return video ? video.playbackRate : 1.0;
    }

    set playbackRate(value) {
        if (this.video) {
            this.video.playbackRate = value;
        }
    }
}
