'use strict'

import { getData } from './connect'
import { start } from './proceed'
import { log } from './../utils'
import store from './../state'

export async function run() {
    await getData(process.env.UNPROCESSED, async(message) => {

        log(`Обрабатываю ${message.title} (${message.href})`)

        message = await start(message)
        if (message === null || message === undefined) {
            log(`Следующее сообщение...`)
            return
        } else {
            if (message.error) {
                log(`${message.message}`)
                await store.setNews(message.message, process.env.ERROR)
            } else {
                await store.setNews(message, process.env.PROCESSED)
            }
        }
    })
}