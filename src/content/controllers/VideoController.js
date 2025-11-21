export class VideoController {
    constructor(selectors, config) {
        this.config = config;
        this.selectors = selectors;
    }

    get video() {
        return document.querySelector(this.selectors.player.video);
    }

    toggleCinemaMode() {
        if (!this.video) return;
        const videoWrapper = this.video.closest(this.selectors.columns);
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
        if (video && video.textTracks.length > 0) {
            const track = video.textTracks[0];
            track.mode = track.mode === "showing" ? "hidden" : "showing";
        }
    }

    changeSpeed(gap, uiCallback) {
        const video = this.video;
        if (!video) return;

        let newSpeed = video.playbackRate + gap;

        // Clamp speed
        newSpeed = Math.max(
            this.config.minSpeed,
            Math.min(newSpeed, this.config.maxSpeed)
        );

        video.playbackRate = Math.round(newSpeed * 100) / 100;

        if (uiCallback) uiCallback();
    }

    get playbackRate() {
        return this.video ? this.video.playbackRate : 1.0;
    }

    set playbackRate(value) {
        if (this.video) {
            this.video.playbackRate = value;
        }
    }
}
