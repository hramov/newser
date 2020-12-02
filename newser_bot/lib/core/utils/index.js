'use strict'

import store from "./../store";
// import { toTextFile } from "./logger";

export async function autoscroll(page) {
    await page.evaluate(async() => {
        await new Promise((resolve) => {
            let distance = 200;
            let timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;
                setTimeout(() => {
                    clearInterval(timer);
                    resolve();
                }, 2000);
            }, 200);
        });
    });
}

export async function sleep(ms, msg = "") {
    const newMS = getRandom(ms, ms + 7000);
    log("Задержка " + (newMS / 1000).toFixed(2) + " секунд (" + msg + ")")
    return new Promise((resolve) => setTimeout(resolve, newMS));
}

export function getRandom(min, max) {
    return Number(Math.floor(Math.random() * (max - min)) + min)
}

export function secToMinToHoursConvert(seconds) {
    seconds = Number(seconds);
    if (seconds <= 60) {
        return `${seconds} секунд`;
    }
    if (seconds > 60 && seconds <= 3600) {
        let minutes = Math.floor(seconds / 60);
        let sec = Math.floor(seconds - minutes * 60);
        return `${minutes} минут и ${sec} секунд`;
    }
    if (seconds > 3600) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds - hours * 3600) / 60);
        let sec = Math.floor(seconds - hours * 3600 - minutes * 60);
        return `${hours} часов, ${minutes} минут и ${sec} секунд`;
    }
}

export function calculateStatistics(allNews, resNum, goTime, now) {
    allNews = allNews + Number(resNum);
    let curTime = new Date();
    let fullTimeWorking = (curTime - goTime) / 1000;
    let queryTime = (curTime - now) / 1000;
    return {
        allNews: allNews,
        fullTimeWorking: fullTimeWorking,
        queryTime: queryTime,
    };
}

/**
 * @function log
 * @description Логирует информацию в консоль, локальный файл и передает на сервер через сокет
 * @param {*} text Данные
 * @param {*} status Статус работы приложения
 */
export function log(text, status = 1) {
    const logString = `${new Date(Date.now()).toLocaleDateString()} ${new Date(Date.now()).toLocaleTimeString()} | ${text}`
    console.log(logString);
    // toTextFile(logString);
    try {
        store.getSocket().emit('log', { text, status })
    } catch (err) {
        log('Ошибка ' + err)
    }
}

export function setStatus(status) {
    store.getSocket().emit('setStatus', status);
}