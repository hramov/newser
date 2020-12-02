'use strict'

import dotenv from 'dotenv'
dotenv.config();
import TelegramBot from 'node-telegram-bot-api'
import io from 'socket.io-client'

const socket = io.connect(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);

const token = process.env.TOKEN
const CHAT_ID = process.env.CHAT_ID

const bot = new TelegramBot(token, { polling: true })

let bot_status = "off"

socket.on('startBot', () => {
    bot.sendMessage(CHAT_ID, `Бот запускаю бота!`)
    bot_status = 'working'
})

socket.on('stopBot', () => {
    bot.sendMessage(CHAT_ID, 'Останавливаю бота!')
    bot_status = 'waiting'
})

socket.on('message', (message) => {
    if (message.message) {
        bot.sendMessage(CHAT_ID, message.message)
    }
})

bot.on('message', (msg) => {

    if (msg.text.toString().toLowerCase().indexOf('start') === 0) {
        bot.sendMessage(CHAT_ID, `Запускаю бота!`);
        socket.emit('startBot')
        bot_status = 'working'
        bot.sendMessage(CHAT_ID, `Статус бота ${bot_status}`);
    }

    if (msg.text.toString().toLowerCase().indexOf('stop') === 0) {
        if (bot_status === 'working') {
            socket.emit('stopBot')
            bot.sendMessage(CHAT_ID, 'Останавливаю бота!')
        } else {
            bot.sendMessage(CHAT_ID, 'Бот не запущен!')
        }
    }

})

bot.on("polling_error", (err) => console.log(err));