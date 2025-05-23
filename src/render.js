const Components = {
    Thread: function (key, action, is_main = false) {
        let result = `
        <tr>
            <th class="text-left">${key}</th>
            <th class="text-left">${action}</th>
        </tr>
        `

        let wrapper = `<thead>{child}</thead>`

        if (is_main) {
            result = wrapper.replace('{child}', result)
        }

        return result
    },
    Table: function (
        threads
    ) {
        return `
    <table class="table-fill styled-table">
        <tbody class="">
        ${
            threads.map(
                (_, i) => Components.Thread(
                    threads[i].key,
                    threads[i].action,
                    threads[i].is_main
                )
            ).join('')
        }
        </tbody>
    </table>
    `
    },
    Title: function (
        title
    ) {
        return `
    <div class="table-title">${title}</div>
    `
    }
}

const Messages = {}

const Message = function (key) {
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
                "key": Message("key"),
                "action": Message("action"),
                "is_main": true
            },
            {
                "key": Message("KeyJ"),
                "action": Message("backward_15")
            },
            {
                "key": Message("KeyK"),
                "action": Message("play_pause")
            },
            {
                "key": Message("KeyL"),
                "action": Message("forward_15")
            },
            {
                "key": Message("Key0_9"),
                "action": Message("percentage_rewind")
            },
            {
                "key": Message("KeyC"),
                "action": Message("turn_on_off_subs")
            },
            {
                "key": Message("KeyT"),
                "action": Message("turn_on_off_cinema")
            },
            {
                "key": Message("KeyH"),
                "action": Message("change_speed")
            }
        ]
    }
}

const Render = function () {
    document.getElementById('table').innerHTML = Components.Table(
        Context.TableData.threads
    )
    document.getElementById('title').innerHTML = Components.Title(
        Message("colored_logo")
    )
}

Render()