'use strict'

import express from 'express'
import { getMercurySelectors, sendMercurySelectors } from './../postgres'
import { sendDataTest } from './../rabbitmq'
import { getQuery } from './../query'
import { getConfig, setConfig, addQueryToQueue } from './../../filemanager'
import { log } from './../../logger'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Welcome to API handler')
})

router.post('/drawPoint', (req, res) => {
    res.send('Success')
})

router.get('/getQuery/:source', async(req, res) => {
    let source = req.params.source
    res.json(await getQuery(source))
})

router.get('/getConfig', (req, res) => {
    let config = getConfig()
    res.json(config)
})

router.post('/setConfig', (req, res) => {
    let config = req.body.config
    if (setConfig(config)) res.send('Success')
    else res.send('Error')
})

router.post('/sendDataToRabbitMQ', async(req, res) => {
    const queue = req.body.queue
    const data = req.body.data
    const result = await sendDataTest(queue, data)
    if (result.status) {
        res.status(200).end(`Данные успешно отправлены в очередь ${queue}`)
        log(`Данные успешно отправлены в очередь ${queue}`)
    } else {
        res.status(500).end(`Ошибка отправки данных в очередь ${queue}: ${result.error}`)
        log(`Ошибка отправки данных в очередь ${queue}: ${result.error}`)
    }
})

/** PostgreSQL API Section */
router.get('/getMercurySelectors/:domain', async(req, res) => {
    const result = await getMercurySelectors(req.params.domain)
    if (result.status) res.status(200).json(result.data)
    else res.status(500).end(`Ошибка получения данных: ${result.error}`)
})

router.post('/sendMercurySelectors', (req, res) => {
    const result = sendMercurySelectors(req.body.data)
    if (result.status) res.status(200).end(`Селекторы для домена ${req.body.data.domain} успешно записаны в базу`)
    else res.status(500).end(`Ошибка записи селекторов: ${ressult.error}`)
})

/*****Client area*********/
router.get('/getEngines', (req, res) => {

    const engines = [
        'Google.News',
        'Yandex.News',
        'Rambler.News'
    ]

    res.send(engines)
})

router.post('/addQuery', (req, res) => {
    const data = req.body
    console.log(data)
    const result = addQueryToQueue(data)
    if (result.status) res.status(201).end(`Запрос ${data.query} успешно добавлен в очередь`)
    else res.status(500).end(`Не смог добавить запрос ${data.query}`)
})

export default router