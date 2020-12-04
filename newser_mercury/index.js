'use strict'

import store from './src/state'
import io from "socket.io-client";
import dotenv from 'dotenv'
dotenv.config()

import { log } from './src/utils'
import { run } from './src/core/run'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const socket = io.connect(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
store.setSocket(socket)

socket.emit("who_am_i", `mercury_${process.env.CUSTOM_NAME}`);
log('Ожидаю команды СТАРТ', 0)

socket.on('start', (data) => {
    console.log("Started")
    store.setIsGo(true)
    store.setStatus(1)
    run()
})

socket.on('getStatusToBot', () => {
    const status = store.getStatus()
    socket.emit('setStatus', status)
})

socket.on('restart', () => {
    log('Получена команда ПЕРЕЗАПУСК', 0)
    store.setStatus(0)
    process.exit(0)
})

socket.on('stop', () => {
    log('Получена команда СТОП', 2)
    store.setStatus(2)
    store.setIsGo(false)
})

socket.on('disconnect', () => {
    log('Сервер отключился. Завершение работы', 0)
    process.exit(0)
})

setTimeout(() => process.exit(0), 3600000)