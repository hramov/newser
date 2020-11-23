'use strict'

import * as amqp from 'amqplib'
import { log } from './../../logger'
import _ from 'underscore'

// export async function getData(queue) {
//     const open = await amqp.connect(`amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`);
//     const channel = open.createChannel()
//     await channel.assertQueue(queue)
//     await channel.consume(queue, msg => {

//     });
// }

export async function sendDataTest(queue, data) {
    try {
        const open = await amqp.connect(`amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`);
        const channel = await open.createChannel()
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        log('Отправил данные, закрываю соединение')
        await channel.close()
        await open.close()
        log('Закрыл канал')
    } catch (err) {
        return {
            status: false,
            error: err
        }
    }
    return {
        status: true,
        error: null
    }
}