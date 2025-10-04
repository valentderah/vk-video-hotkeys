VKVideoPlayer = (
    function () {
        let self = this

        self._timeout = null
        self._inverval_time = 1000
        self._retrys = 10
        self._original_speed = 1.0
        self._space_press_timeout = null
        self._is_holding_space = false

        self.config = {
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
                time: ".videoplayer_time"
            },
            columns: ".vkuiSplitCol__host",
            ext_speed_label: "#ext-vk-video-controller",
            ext_rewind_label: "#ext-vk-video-rewind-controller",
            editable_input: ".vkitCommentInputContentEditable",
            ext: {
                speed_label: "#ext-vk-video-controller",
                back_label: "#ext-vk-video-back-controller",
                forward_label: "#ext-vk-video-forward-controller"
            }
        }

        self.ui = {
            ext_speed_label: `<div id="${self.selectors.ext.speed_label.slice(1)}" 
                style="top: 0; right: 0; position: absolute; 
                z-index: 9999999; margin: 10px 10px 10px 15px; padding: 0.5rem;
                opacity: 0.3; border-radius: 0.5rem; background: black;">
              <span style="" class="speed">{speed}</span>
            </div>`,
            forward_label: `<div class="videoplayer_controls_item videoplayer_btn videoplayer_btn_next" 
                role="button" tabindex="0" aria-label="Rewind">
                <svg fill="none" height="24" viewBox="0 0 24 24" width="24" 
                xmlns="http://www.w3.org/2000/svg">
                <path d="M14 10.83V7.5a1 1 0 1 1 2 0v9a1 1 0 0 1-2 0v-3.33l-
                8.15 4.66A1.23 1.23 0 0 1 4 16.77V7.23c0-.95 1.03-1.54 1.85-1.06z" fill="currentColor" 
                fill-rule="evenodd">
                </path></svg>
            </div>`,
            rewind_label: `<span id="ext-vk-video-rewind-controller" class="videoplayer_controls_item">
                <div id="${self.selectors.ext.back_label.slice(1)}" class="videoplayer_controls_item videoplayer_btn videoplayer_btn_rewind" 
                    role="button" tabindex="0" aria-label="Back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 7.33325V9.99992L8.66667 9.19436" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M6.25293 9.79399C6.78698 8.46245 7.78649 7.36307 9.07092 6.69442C10.3553 6.02578 11.84 5.83195 13.2567 6.14796C14.6734 6.46397 15.9288 7.26898 16.7961 8.41758C17.6634 9.56618 18.0853 10.9826 17.9858 12.4111C17.8863 13.8396 17.2718 15.1859 16.2534 16.2068C15.235 17.2277 13.8797 17.856 12.4325 17.9781C10.9852 18.1002 9.54141 17.7082 8.36177 16.8727" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </div>
                <div id="${self.selectors.ext.forward_label.slice(1)}" class="videoplayer_controls_item videoplayer_btn videoplayer_btn_rewind" 
                    role="button" tabindex="0" aria-label="Rewind">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 7.33325V9.99992L15.3333 9.19436" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M17.7471 9.79399C17.213 8.46245 16.2135 7.36307 14.9291 6.69442C13.6447 6.02578 12.16 5.83195 10.7433 6.14796C9.32655 6.46397 8.07118 7.26898 7.20391 8.41758C6.33665 9.56618 5.91466 10.9826 6.01419 12.4111C6.11371 13.8396 6.72818 15.1859 7.74661 16.2068C8.76503 17.2277 10.1203 17.856 11.5675 17.9781C13.0148 18.1002 14.4586 17.7082 15.6382 16.8727" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </div>
            </span>`
        }

        self.get_speed_label = function () {
            let el = document.querySelector(
                self.selectors.ext.speed_label
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
                self.selectors.ext.speed_label
            )
        }

        self.get_video = function () {
            return document.querySelector(
                self.selectors.player.video
            )
        }

        self.get_player = function () {
            return document.querySelector(
                self.selectors.player.ui
            )
        }

        self.get_rewind_label = function () {
            return document.querySelector(
                self.selectors.ext_rewind_label
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
            },
            handle_space_down: function () {
                self._space_press_timeout = setTimeout(() => {
                    self._space_press_timeout = null;
                    self._is_holding_space = true;

                    const video = self.get_video();
                    self._original_speed = video.playbackRate;
                    video.playbackRate = 2.0;
                }, 200);
            },
            handle_space_up: function () {
                if (self._space_press_timeout) {
                    clearTimeout(self._space_press_timeout);
                    self._space_press_timeout = null;
                    self.make_logic("pause_play");
                }

                if (self._is_holding_space) {
                    const video = self.get_video();
                    video.playbackRate = self._original_speed;
                    self.make_ui_logic("show_speed_label_temp");
                    self._is_holding_space = false;
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
            },
            show_rewind_label: function () {
                if (self.get_rewind_label()) {
                    return null
                }

                let rewind_label = new DOMParser().parseFromString(
                    self.ui.rewind_label,
                    "text/html"
                ).body.firstChild

                let time_selector = document.querySelector(
                    self.selectors.player.time
                )


                return time_selector.parentNode.insertBefore(
                    rewind_label,
                    time_selector
                )
            }
        }

        self.logic_config = {
            increase_speed: {
                key: "Period",
                event: "keydown",
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
                event: "keydown",
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
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["captions"]
                    }
                ]
            },
            cinema: {
                key: "KeyT",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["cinema_mode"]
                    }
                ]
            },
            forward: {
                key: "KeyL",
                event: "keydown",
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
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["pause_play"]
                    }
                ]
            },
            back: {
                key: "KeyJ",
                event: "keydown",
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
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 0]
                    }
                ]
            },
            to_10: {
                key: "Digit1",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 1]
                    }
                ]
            },
            to_20: {
                key: "Digit2",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 2]
                    }
                ]
            },
            to_30: {
                key: "Digit3",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 3]
                    }
                ]
            },
            to_40: {
                key: "Digit4",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 4]
                    }
                ]
            },
            to_50: {
                key: "Digit5",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 5]
                    }
                ]
            },
            to_60: {
                key: "Digit6",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 6]
                    }
                ]
            },
            to_70: {
                key: "Digit7",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 7]
                    }
                ]
            },
            to_80: {
                key: "Digit8",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 8]
                    }
                ]
            },
            to_90: {
                key: "Digit9",
                event: "keydown",
                make: [
                    {
                        func: self.make_logic,
                        params: ["move_to", 9]
                    }
                ]
            },
            handle_space_down: {
                key: 'Space',
                event: 'keydown',
                make: [
                    {
                        func: self.make_logic,
                        params: ['handle_space_down']
                    },
                    {
                        func: self.make_ui_logic,
                        params: ['show_speed_label_temp']
                    }
                ]
            },
            handle_space_up: {
                key: 'Space',
                event: 'keyup',
                make: [
                    {
                        func: self.make_logic,
                        params: ['handle_space_up']
                    },
                    {
                        func: self.make_ui_logic,
                        params: ['show_speed_label_temp']
                    }
                ]
            }
        }

        self.events_config = {
            forward_click: {
                element: self.selectors.ext.forward_label,
                action: "click",
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
            back_click: {
                element: self.selectors.ext.back_label,
                action: "click",
                make: [
                    {
                        func: self.make_logic,
                        params: [
                            "rewind",
                            -self.config.rewind_gap
                        ]
                    }
                ]
            }
        }

        self.init_hotkeys = function () {
            const key_actions = {
                keydown: {},
                keyup: {}
            };

            for (const name in self.logic_config) {
                const config = self.logic_config[name];
                if (!config.key || !config.make) continue;

                const event_type = config.event || 'keydown';

                if (!key_actions[event_type][config.key]) {
                    key_actions[event_type][config.key] = [];
                }

                key_actions[event_type][config.key].push(...config.make);
            }

            document.addEventListener(
                "keydown", e => {
                    if (!self.can_make_logic()) return;

                    const actions = key_actions.keydown[e.code];
                    if (actions) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (e.repeat) {
                            return;
                        }

                        for (const action of actions) {
                            action.func(...action.params);
                        }
                    }
                }, true);

            document.addEventListener(
                "keyup", e => {
                    if (!self.can_make_logic()) return;

                    const actions = key_actions.keyup[e.code];
                    if (actions) {
                        e.preventDefault();
                        e.stopPropagation();

                        for (const action of actions) {
                            action.func(...action.params);
                        }
                    }
                }, true);
        }

        self.wait_for_player = function () {
            return new Promise((resolve) => {
                let retries = 0

                const check = function () {
                    if (
                        self.get_video() &&
                        self.get_player()
                    ) {
                        return resolve(true)
                    }
                    if (retries >= self._retrys) {
                        return resolve(false)
                    }
                    retries++
                    setTimeout(
                        check,
                        self._inverval_time
                    )
                }
                check()
            })
        }

        self.init_events = function () {
            for (let event_name in self.events_config) {
                let event = self.events_config[event_name]
                document.querySelector(event.element).addEventListener(
                    event.action,
                    function () {
                        for (let i in event.make) {
                            event.make[i].func(...event.make[i].params)
                        }
                    }
                )
            }
        }

        self.init_ui = function () {
            function rewind() {
                self.wait_for_player().then(
                    function (ready) {
                        if (ready) {
                            if (self.ui_logic.show_rewind_label()) {
                                self.init_events()
                            }
                        }
                    }
                )
            }

            function observer() {
                let last_player = self.get_player()

                new MutationObserver(
                    function () {
                        let player = self.get_player()
                        if (player !== last_player) {
                            last_player = player
                            rewind()
                        }
                    }
                ).observe(
                    document,
                    {subtree: true, childList: true}
                )
            }

            observer()
        }

        self.init = function () {
            self.init_ui()
            self.init_hotkeys()
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
)();



