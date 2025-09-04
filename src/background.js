VKVideoPlayer = (
    function () {
        let self = this

        self._timeout = null
        self._inverval_time = 1000
        self._retrys = 5

        self.config = {
            logic_config: self.logic_config,
            speed_gap: 0.25, // decimal
            min_speed: 0.25, // decimal
            max_speed: 2.00, // decimal
            rewind_gap: 15 // seconds
        }

        self.selectors = {
            player: {
                ui: '.videoplayer_ui',
                video: ".videoplayer_media_provider",
                captions: ".videoplayer_btn_subtitles",
                controls: ".videoplayer_controls",
            },
            columns: ".vkuiSplitCol__host",
            ext_speed_label: "#ext-vk-video-controller",
            editable_input: ".vkitCommentInputContentEditable"
        }

        self.ui = {
            ext_speed_label: `<div id="${self.selectors.ext_speed_label.slice(1)}" 
                style="top: 0; right: 0; position: absolute; 
                z-index: 9999999; margin: 10px 10px 10px 15px; padding: 0.5rem;
                opacity: 0.3; border-radius: 0.5rem; background: black;">
              <span style="" class="speed">{speed}</span>
            </div>`
        }

        self.get_speed_label = function () {
            let el = document.querySelector(
                self.selectors.ext_speed_label
            )
            let video = self.get_video()

            if (el) {
                return el
            }

            el = new DOMParser().parseFromString(
                self.ui.ext_speed_label.replace(
                    "{speed}",
                    video.playbackRate
                ),
                "text/html"
            ).body.firstChild


            video.parentNode.insertBefore(el, video)

            return document.querySelector(
                self.selectors.ext_speed_label
            )
        }

        self.get_video = function () {
            return document.querySelector(
                self.selectors.player.video
            )
        }

        self.can_make_logic = function () {
            let classes = document.activeElement.classList

            let has_activity = classes.toString().includes(
                self.selectors.editable_input.slice(1)
            )

            return (
                !has_activity &&
                self.get_video()
            )
        }

        self.make_logic = function (
            name,
            params
        ) {
            if (self.can_make_logic()) {
                self.logic[name].apply(this, [params])
            }
        }

        self.make_ui_logic = function (
            name,
            params
        ) {
            if (self.can_make_logic()) {
                self.ui_logic[name].apply(this, [params])
            }
        }

        self.logic = {
            cinema_mode: function () {
                let recs = self.get_video().closest(
                    self.selectors.columns
                ).nextElementSibling

                if (
                    recs &&
                    recs.style.display === "none"
                ) {
                    recs.style.display = null
                } else {
                    recs.style.display = "none"
                }
            },
            pause_play: function () {
                let video = self.get_video()
                return video[(video.paused) ? ("play") : ("pause")]()
            },
            rewind: function (gap) {
                let video = self.get_video()
                return video.currentTime = video.currentTime + gap
            },
            captions: function () {
                let video = self.get_video()
                if (video && video.textTracks.length > 0) {
                    let track = video.textTracks[0]
                    if (!track) {
                        return null
                    }
                    track.mode = track.mode === 'showing' ? 'hidden' : 'showing'
                    return track.mode
                }
            },
            move_to: function (number) {
                let video = self.get_video()
                return video.currentTime = video.duration * number / 10
            },
            change_speed: function (gap) {
                let video = self.get_video()
                let end_speed = video.playbackRate + gap

                if (
                    end_speed <= self.config.max_speed &&
                    end_speed >= self.config.min_speed
                ) {
                    video.playbackRate = end_speed
                }
            }
        }

        self.ui_logic = {
            show_speed_label: function () {
                let video = self.get_video()
                let label = self.get_speed_label()
                let rate = video.playbackRate.toFixed(2)
                return label.firstElementChild.textContent = `${rate}x`
            },
            hide_speed_label: function () {
                self.get_speed_label().remove()
            },
            show_speed_label_temp: function () {
                self.ui_logic.show_speed_label()

                if (self._timeout) {
                    clearTimeout(self._timeout)
                }

                self._timeout = setTimeout(
                    self.ui_logic.hide_speed_label,
                    1000
                )
            }
        }

        self.logic_config = {
            increase_speed: {
                key: "Period",
                make: [
                    {
                        func: self.make_logic,
                        params: [
                            "change_speed",
                            self.config.speed_gap
                        ]
                    },
                    {
                        func: self.make_ui_logic,
                        params: ["show_speed_label_temp"]
                    }
                ]
            },
            decrease_speed: {
                key: "Comma",
                make: [
                    {
                        func: self.make_logic,
                        params: [
                            "change_speed",
                            -self.config.speed_gap
                        ]
                    },
                    {
                        func: self.make_ui_logic,
                        params: ["show_speed_label_temp"]
                    }
                ]
            },
            captions: {
                key: "KeyC",
                make: [
                    {
                        func: self.make_logic,
                        params: ["captions"]
                    }
                ]
            },
            cinema: {
                key: "KeyT",
                make: [
                    {
                        func: self.make_logic,
                        params: ["cinema_mode"]
                    }
                ]
            },
            forward: {
                key: "KeyL",
                make: [
                    {
                        func: self.make_logic,
                        params: [
                            "rewind",
                            self.config.rewind_gap
                        ]
                    }
                ]
            },
            play_pause: {
                key: "KeyK",
                make: [
                    {
                        func: self.make_logic,
                        params: ["pause_play"]
                    }
                ]
            },
            back: {
                key: "KeyJ",
                make: [
                    {
                        func: self.make_logic,
                        params: [
                            "rewind",
                            -self.config.rewind_gap
                        ]
                    }
                ]
            },
            to_0: {
                key: "Digit0",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 0]
                    }
                ]
            },
            to_10: {
                key: "Digit1",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 1]
                    }
                ]
            },
            to_20: {
                key: "Digit2",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 2]
                    }
                ]
            },
            to_30: {
                key: "Digit3",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 3]
                    }
                ]
            },
            to_40: {
                key: "Digit4",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 4]
                    }
                ]
            },
            to_50: {
                key: "Digit5",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 5]
                    }
                ]
            },
            to_60: {
                key: "Digit6",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 6]
                    }
                ]
            },
            to_70: {
                key: "Digit7",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 7]
                    }
                ]
            },
            to_80: {
                key: "Digit8",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 8]
                    }
                ]
            },
            to_90: {
                key: "Digit9",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 9]
                    }
                ]
            }
        }

        self.init = function () {
            let key_dict = {}

            for (let logic_name in self.logic_config) {
                let logic = self.logic_config[logic_name]
                if ('key' in logic) {
                    key_dict[logic.key] = logic
                }
            }

            document.addEventListener(
                "keydown",
                (e) => {

                    if (e.code in key_dict) {
                        let logic = key_dict[e.code]
                        // multiple funcs call
                        for (let i in logic.make) {
                            logic.make[i].func(...logic.make[i].params)
                        }
                    }
                }
            )
        }

        return {
            config: self.config,
            init: self.init
        }
    }
)();

(
    function () {
        if (document.readyState === "loading") {
            document.addEventListener(
                "DOMContentLoaded",
                function () {
                    VKVideoPlayer.init()
                }
            )
        } else {
            VKVideoPlayer.init()
        }
    }
)()



