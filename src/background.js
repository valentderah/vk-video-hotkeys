function round(value, step) {
    step || (step = 1.0);
    let inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}

VkVideoPlayer = function () {
    let self = this

    this.html_selector = ".videoplayer_media_provider"
    this.captions_selector = ".videoplayer_btn_subtitles"
    this.columns_selector = '.vkuiSplitCol__host'
    this.control_selector = '#ext-vk-video-controller'
    this.control_template = `
        <div id="ext-vk-video-controller" 
        style="top: 0; right: 0; position: absolute; 
            z-index: 9999999; margin: 10px 10px 10px 15px; padding: 0.5rem;
            opacity: 0.3; border-radius: 0.5rem; background: black;">
          <span style="" class="speed">{speed}</span>
        </div>`
    this.show_timeout = null
    this.max_speed = 2.00
    this.min_speed = 0.25

    this.get_control_ui = function () {
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
    this.get_html = function () {
        return document.querySelector(self.html_selector)
    }

    this.can_start_operations = function () {
        let has_activity = document.activeElement.classList.toString().includes(
            'vkitCommentInputContentEditable'
        )

        return !has_activity && self.get_html()
    }

    this.ui_show_speed = function () {
        let player = self.get_html()
        self.get_control_ui().firstElementChild.textContent = `${player.playbackRate.toFixed(2)}x`
    }

    this.ui_hide_speed = function () {
        self.get_control_ui().remove()
    }

    this.change_speed = function (
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

    this.make_operation = function (
        name,
        params
    ) {
        if (self.can_start_operations()) {
            self[name].apply(this, [params])
        }
    }

    this.pause_play = function () {
        let player = self.get_html()
        return player[(player.paused) ? ('play') : ('pause')]()
    }

    this.rewind = function (gap) {
        let player = self.get_html()
        return player.currentTime = player.currentTime + gap
    }

    this.move_to = function (
        number
    ) {
        let player = self.get_html()

        if (number === 0) {
            return player.currentTime = 0
        }

        return player.currentTime = player.duration * number / 10
    }

    this.captions = function () {
        // профессиАнальный костыль
        document.querySelector(self.captions_selector).click()
        document.querySelector(self.captions_selector).click()
    }

    this.cinema_mode = function () {
        let recs = document.querySelector(self.columns_selector).nextElementSibling

        if (recs && recs.style.display === 'none') {
            recs.style.display = null
        } else {
            recs.style.display = 'none'
        }
    }

    this.operations = {
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

    this.set_custom_control = function () {
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

    return this
}

vk_video_player = function () {
    return new VkVideoPlayer()
}

vk_video_player().set_custom_control()
