'use strict'

import Mercury from '@postlight/mercury-parser'
import { getRandom } from '../utils'
import { userAgents } from '../data/config'
import store from '../state'

import { RemoveJavaScriptFunctions, RemoveEmptyStrings, RemoveMiltipleSpaces } from '../utils/cleaners'
import { log } from '../utils'

function handle(message, result) {
    log('Начинаю обработку сообщения')

    message.content = result.content
    message.content = RemoveJavaScriptFunctions(message.content)
    message.content = RemoveEmptyStrings(message.content)
    message.content = RemoveMiltipleSpaces(message.content)

    if (message.content.length < 100) {
        return null
    }

    /**
     * Some other
     * cleaners
     */

    message.lead_img = result.lead_image_url

    if (result.date_published) message.date = result.date_published

    if (result.excerpt) message.desc = result.excerpt
    if (message.lead_img === null) {
        log(`Не смог поолучить картинку ${message.href}`)
    }
    return message
}

export async function start(message) {
    let url = message.href
    const userAgent = userAgents[getRandom(0, userAgents.length)]
    log(userAgent)

    let customExtractor = await store.getExtractor(new URL(url).hostname)
        // log(JSON.stringify(customExtractor))

    if (customExtractor.length > 0 && customExtractor[0].settings_mercury) {
        log(customExtractor[0].settings_mercury)
        await Mercury.addExtractor(customExtractor[0].settings_mercury)
    } else {
        log(`Не смог найти экстракторы для ${url}`)
    }

    await Mercury.parse(message.href, {
        contentType: 'text',
        headers: {
            'User-Agent': userAgent
        }
    }).
    then(async result => {
        if (result.error) {
            message = result
            message.href = url
            return message
        }

        if (result.content.length < 10) {
            log(`Не смог получить контент!`)
            return message
        } else {
            message = handle(message, result)
        }
    });
    return message
}