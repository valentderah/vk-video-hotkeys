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
