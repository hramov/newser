'use strict'

import store from '../state'
import fs from 'fs'
import path from 'path'

export async function sleep(ms, msg = '') {
    const newMS = getRandom(ms, ms + 1000)
    log(`Задержка ${(newMS / 1000).toFixed(2)} секунд ${msg}`)
    return new Promise(resolve => setTimeout(resolve, newMS));
}

export function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function log(text, status = 1) {
    const logString = `${new Date(Date.now()).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()} | ${text}`
    console.log(logString)
    logger(logString)
    store.getSocket().emit('log', { text, status })
}

export function logger(data) {
    try {
        if (!fs.existsSync(`${path.resolve()}/logs/mercury - logs.txt `)) {
            fs.open(`${ path.resolve() }/logs/mercury - logs.txt `, 'w', (err) => {
                if (err) throw err;
            });
        }
        fs.appendFileSync(`${ path.resolve() }/logs/mercury - logs.txt `, new Date(Date.now()) + ' ' + data + '\n');
    } catch (err) {
        console.log(err)
    }
}