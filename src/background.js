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

    this.auto_choice_speed = function () {
        let set_to = 1.0
        let player = self.get_html()
        let current_speed = player.playbackRate

        let controller = {
            1.0: {
                to: 1.5
            },
            1.25: {
                to: 1.5
            },
            1.5: {
                to: 2.0
            },
            2.0: {
                to: 1.0
            }
        }

        if (
            current_speed < 2.0
        ) {
            if (!(current_speed in controller)) {
                current_speed = round(current_speed, 0.25)
            }
            set_to = controller[current_speed].to
        }

        return set_to

    }

    this.ui_show_speed = function () {
        let player = self.get_html()
        self.get_control_ui().firstElementChild.textContent = `${player.playbackRate.toFixed(2)}x`
    }

    this.change_speed = function () {
        let player = self.get_html()
        player.playbackRate = self.auto_choice_speed()
        self.ui_show_speed()
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
        change_speed: {
            key: 'KeyH',
            make: self.make_operation,
            params: ['change_speed']
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
