'use strict'

import * as amqp from 'amqplib/callback_api'
import { sleep } from './../utils'
import { log } from './../utils'
import store from './../state'

export async function getData(queue, callback) {

    log(`Получаю данные`)
    try {
        amqp.connect(`amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`,
            function(error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(async function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(queue, {
                        durable: true
                    });
                    channel.prefetch(1);
                    log(`Ожидаю новых собщений`)
                    channel.consume(queue, async function(msg) {
                        if (store.getIsGo()) {
                            try {
                                await callback(JSON.parse(msg.content.toString()))
                                await sleep(1000)
                                channel.ack(msg)
                            } catch (err) {
                                log(`Error: ${err}`)
                            }
                        } else {
                            log('Парсер остановлен', 0)
                            store.setStatus(0)
                            return
                        }
                    });
                });
            });
    } catch (err) {
        log(err)
        return {
            error: true,
            message: err,
            failed: true
        }
    }
}