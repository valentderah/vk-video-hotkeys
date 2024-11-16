VkVideoPlayer = function () {
    let self = this

    this.html_selector = ".videoplayer_media_provider"

    this.get_html = function () {
        return document.querySelector(self.html_selector)
    }

    this.can_start_operations = function () {
        let cant_classes = ['reply_field', 'ui_search_field']

        let has_activity = !!Array.from(document.activeElement.classList).filter(
            active_classes => cant_classes.includes(active_classes)
        ).length

        return !has_activity && self.get_html()
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

    this.operations = {
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
    }

    return this
}

vk_video_player = function () {
    return new VkVideoPlayer()
}

vk_video_player().set_custom_control()
