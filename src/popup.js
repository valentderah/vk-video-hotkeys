const Components = {
    Thread: (key, action, is_main = false) => {
        let result = `
        <tr>
            <th class="text-left">${key}</th>
            <th class="text-left">${action}</th>
        </tr>
        `

        if (is_main) {
            result = `<thead>${result}</thead>`
        }

        return result
    },
    Table: (threads) => {
        const rows = threads.map((thread, index) => Components.Thread(
            thread.key,
            thread.action,
            thread.is_main
        )).join('')

        return `
    <table class="table-fill styled-table">
        <tbody class="">
            ${rows}
        </tbody>
    </table>
    `
    },
    Title: (title) => {
        return `<div class="table-title">${title}</div>`
    },

    Button: (name, classes) => {
        return `<button class="table-button ${classes}">${name}</button>
        `
    },
    Text: (name, classes) => {
        return `<a class="${classes}">${name}</a>`
    }
}

const Messages = {}

const Message = (key) => {
    if (chrome.i18n.getMessage(key)) {
        return chrome.i18n.getMessage(key)
    }
    if (Messages && Messages[key]) {
        return Messages[key].message
    }
    return key
}

const Context = {
    TableData: {
        threads: [
            {
                key: Message("key"),
                action: Message("action"),
                is_main: true
            },
            {
                key: Message("KeyJ"),
                action: Message("backward_15")
            },
            {
                key: Message("KeyK"),
                action: Message("play_pause")
            },
            {
                key: Message("KeyL"),
                action: Message("forward_15")
            },
            {
                key: Message("Key0_9"),
                action: Message("percentage_rewind")
            },
            {
                key: Message("KeyC"),
                action: Message("turn_on_off_subs")
            },
            {
                key: Message("KeyT"),
                action: Message("turn_on_off_cinema")
            },
            {
                key: Message("decrease_speed_button"),
                action: Message("decrease_speed")
            },
            {
                key: Message("increase_speed_button"),
                action: Message("increase_speed")
            }
        ]
    },
    Social: {
        vk: Message('vk_channel_link'),
        tg: Message('tg_channel_link')
    }
}

const handleSocialClick = (event) => {
    const platform = event.currentTarget.getAttribute('data-s')
    chrome.tabs.create({url: Context.Social[platform]})
}

const BindEvents = () => {
    document.querySelectorAll('.s-link').forEach(element => {
        element.addEventListener('click', handleSocialClick)
    })
}

const Render = () => {
    const titleElement = document.getElementById('title')
    const versionElement = document.getElementById('version')
    const tableElement = document.getElementById('table')

    if (
        !titleElement ||
        !versionElement ||
        !tableElement
    ) {
        return
    }

    titleElement.innerHTML = Components.Title(
        Message("colored_logo")
    )

    versionElement.innerHTML = Components.Text(
        `${Message('ext_version')}: ${chrome.runtime.getManifest().version}`,
        'gray-small-text center-text xx-small w-100'
    )

    tableElement.innerHTML = Components.Table(
        Context.TableData.threads
    )
}

Page = (
    () => {
        let self = this

        self.render = function () {
            Render()
        }

        self.load = function () {
            self.render()
            self.bind_events()
        }

        self.bind_events = function () {
            BindEvents()
        }

        return {
            load: self.load
        }
    }
)()

Page.load()