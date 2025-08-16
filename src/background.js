VKVideoPlayer = (
    function () {
        let self = this

        self.html_selector = ".videoplayer_media_provider"
        self.captions_selector = ".videoplayer_btn_subtitles"
        self.columns_selector = '.vkuiSplitCol__host'
        self.control_selector = '#ext-vk-video-controller'
        self.control_template = `
        <div id="ext-vk-video-controller" 
        style="top: 0; right: 0; position: absolute; 
            z-index: 9999999; margin: 10px 10px 10px 15px; padding: 0.5rem;
            opacity: 0.3; border-radius: 0.5rem; background: black;">
          <span style="" class="speed">{speed}</span>
        </div>
    `
        self.show_timeout = null
        self.max_speed = 2.00
        self.min_speed = 0.25

        self.get_control_ui = function () {
            let el = document.querySelector(self.control_selector)
            let player = self.get_html()

            if (el) {
                return el
            }

            el = new DOMParser().parseFromString(
                self.control_template.replace('{speed}', player.playbackRate),
                'text/html'
            ).body.firstChild


            player.parentNode.insertBefore(el, player)

            return document.querySelector(self.control_selector)
        }

        self.get_html = function () {
            return document.querySelector(self.html_selector)
        }

        self.can_start_operations = function () {
            let has_activity = document.activeElement.classList.toString().includes(
                'vkitCommentInputContentEditable'
            )

            return !has_activity && self.get_html()
        }

        self.ui_show_speed = function () {
            let player = self.get_html()
            self.get_control_ui().firstElementChild.textContent = `${player.playbackRate.toFixed(2)}x`
        }

        self.ui_hide_speed = function () {
            self.get_control_ui().remove()
        }

        self.change_speed = function (
            gap
        ) {
            let player = self.get_html()
            let end_speed = player.playbackRate + gap

            if (
                end_speed <= self.max_speed &&
                end_speed >= self.min_speed
            ) {
                player.playbackRate = end_speed
            }

            self.ui_show_speed()

            if (self.show_timeout) {
                clearTimeout(self.show_timeout)
            }

            self.show_timeout = setTimeout(
                self.ui_hide_speed,
                1000
            )
        }

        self.make_operation = function (
            name,
            params
        ) {
            if (self.can_start_operations()) {
                self[name].apply(this, [params])
            }
        }

        self.pause_play = function () {
            let player = self.get_html()
            return player[(player.paused) ? ('play') : ('pause')]()
        }

        self.rewind = function (gap) {
            let player = self.get_html()
            return player.currentTime = player.currentTime + gap
        }

        self.move_to = function (
            number
        ) {
            let player = self.get_html()

            if (number === 0) {
                return player.currentTime = 0
            }

            return player.currentTime = player.duration * number / 10
        }

        self.captions = function () {
            // профессиАнальный костыль
            document.querySelector(self.captions_selector).click()
            document.querySelector(self.captions_selector).click()
        }

        self.cinema_mode = function () {
            let recs = document.querySelector('video').closest(
                self.columns_selector
            ).nextElementSibling

            if (recs && recs.style.display === 'none') {
                recs.style.display = null
            } else {
                recs.style.display = 'none'
            }
        }

        self.operations = {
            increase_speed: {
                key: 'Period',
                make: self.make_operation,
                params: ['change_speed', 0.25]
            },
            decrease_speed: {
                key: 'Comma',
                make: self.make_operation,
                params: ['change_speed', -0.25]
            },
            captions: {
                key: 'KeyC',
                make: self.make_operation,
                params: ['captions']
            },
            cinema: {
                key: 'KeyT',
                make: self.make_operation,
                params: ['cinema_mode']
            },
            forward: {
                key: 'KeyL',
                make: self.make_operation,
                params: ['rewind', 15]
            },
            play_pause: {
                key: 'KeyK',
                make: self.make_operation,
                params: ['pause_play']
            },
            back: {
                key: 'KeyJ',
                make: self.make_operation,
                params: ['rewind', -15]
            },
            to_0: {
                key: 'Digit0',
                make: self.make_operation,
                params: ['move_to', 0]
            },
            to_10: {
                key: 'Digit1',
                make: self.make_operation,
                params: ['move_to', 1]
            },
            to_20: {
                key: 'Digit2',
                make: self.make_operation,
                params: ['move_to', 2]
            },
            to_30: {
                key: 'Digit3',
                make: self.make_operation,
                params: ['move_to', 3]
            },
            to_40: {
                key: 'Digit4',
                make: self.make_operation,
                params: ['move_to', 4]
            },
            to_50: {
                key: 'Digit5',
                make: self.make_operation,
                params: ['move_to', 5]
            },
            to_60: {
                key: 'Digit6',
                make: self.make_operation,
                params: ['move_to', 6]
            },
            to_70: {
                key: 'Digit7',
                make: self.make_operation,
                params: ['move_to', 7]
            },
            to_80: {
                key: 'Digit8',
                make: self.make_operation,
                params: ['move_to', 8]
            },
            to_90: {
                key: 'Digit9',
                make: self.make_operation,
                params: ['move_to', 9]
            }
        }

        self.set_custom_control = function () {
            let key_dict = {}

            for (let operation_name in self.operations) {
                let operation = self.operations[operation_name]
                key_dict[operation.key] = operation
            }

            document.addEventListener(
                'keydown',
                (e) => {

                    if (e.code in key_dict) {
                        let operation = key_dict[e.code]
                        operation.make(...operation.params)
                    }
                }
            )


            let c = 0
            let max = 5

            let _i = setInterval(
                () => {
                    let player = self.get_html()

                    if (c >= max) {
                        clearInterval(_i)
                    }

                    if (player) {
                        player.addEventListener(
                            'ratechange',
                            function () {
                                self.ui_show_speed()
                            }
                        )
                        clearInterval(_i)
                    }

                    c++
                },
                1000
            )


        }

        return {
            operations: self.operations,
            set_custom_control: self.set_custom_control,
            get_html: self.get_html,
            make_operation: self.make_operation
        }
    }
)()


VKVideoPlayer.set_custom_control()
