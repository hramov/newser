'use strict'

import fs from 'fs'
import { log } from './../utils'
import path from 'path'

function getDomainFromUrl(url) {
    return url.split(/\/+/)[1].replace('www.', '');
}

function sortByFreq(badDomains) {
    return badDomains.sort((a, b) => a.freq < b.freq ? 1 : -1);
}

function addDomain(href, domain) {
    log(`Не нашел селектор для ${domain} (${href})`)

    let badDomains = Array.from(JSON.parse(fs.readFileSync(`${path}/logs/badDomains.json`, 'utf-8')))
    let found = false
    if (badDomains.length > 0) {
        for (let i = 0; i < badDomains.length; i++) {
            if (badDomains[i].domain == domain) {
                badDomains[i].freq += 1
                found = true
                break
            }
        }
        if (!found) {
            badDomains.push({
                href: href,
                domain: domain,
                freq: 1
            })
        }
    } else {
        badDomains.push({
            href: href,
            domain: domain,
            freq: 1
        })
    }
    badDomains = sortByFreq(badDomains)

    if (!fs.existsSync(`${path}/logs/badDomains.json`)) {
        fs.open(`${path}/logs/badDomains.json`, 'w', (err) => {
            if (err) throw err;
            console.log('Создан файл доменов');
        });
    }
    fs.writeFileSync(`${path}/logs/badDomains.json`, JSON.stringify(badDomains))
    return
}

export function custom(href) {
    const domain = getDomainFromUrl(href)
    const customSelectors = [{
            domain: 'ria.ru',
            lead_image_url: {
                selectors: ['img']
            },
            content: {
                selectors: ['article__body'],
            }
        },
        {
            domain: 'vk.com',
            lead_image_url: {
                selectors: ['img']
            },
            content: {
                selectors: ['article__body'],
            }
        }
    ]
    customSelectors.forEach(selector => {
        if (selector.domain === domain) {
            log(`Нашел селектор для ${domain}!`)
            return selector
        }
    })
    addDomain(href, domain)
    return {}
}