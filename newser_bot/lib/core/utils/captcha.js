'use strict'
// import appRoot from 'app-root-path'
import anticaptcha from "@antiadmin/anticaptchaofficial"
import store from './../store'
import { log } from '.'

export async function solve(page, engine = 0) {

    const cur_page = await page.url()
    if ((cur_page.indexOf('showcaptcha') != -1) == true) {

        log(`Капча! ${new Date()}`)
        store.setCaptchaCounter()
        store.setIsCaptcha(true)
        throw new Error('Капча')
        // await anticaptcha_implementation(page)

    } else {
        log(`Капчи нет!`)
        if (engine === 4) store.setIsCaptcha(false)
    }
}

async function anticaptcha_implementation(page) {

    let configuration = await store.getConfig()
    let captcha_input = await page.$(configuration.common.captchaSelectors.input)

    const element = await page.$(configuration.common.captchaSelectors.img)

    // await element.screenshot({ path: `${appRoot}/cap_img/captcha_${Date.now()}.png` });

    const base64image = await element.screenshot({ encoding: "base64" })

    log(`Посылаю на обработку!`)

    anticaptcha.setAPIKey(process.env.ANTICAPTCHA_ID);
    anticaptcha.getBalance()
        .then(balance => log(`На балансе ${balance} $`))
        .catch(error => log(`Получена ошибка ${error}`))
    await anticaptcha.solveImage(base64image, true)
        .then(async text => {
            log(`Расшифрованный текст ${text}`)
            await captcha_input.type(text)
            await page.keyboard.press('Enter')
            log(`Капча решена (${text})`)
        })
        .catch(error => log(`Получена ошибка ${error}`));
}