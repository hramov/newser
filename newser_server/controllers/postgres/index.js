'use strict'

import pgPromise from 'pg-promise';
import store from './../../state'
import { log } from './../../logger'

export async function PGConnect() {
    const pgp = pgPromise();
    const db = pgp(`postgres://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`);
    if (db) log(`Успешно подключился к ${process.env.PG_DB}`)
    else log(`Проблемы с подключением к ${process.env.PG_DB}`)
    return db
}

export async function getMercurySelectors(domain) {
    let tableName = "resources"
    let db = await store.getDB()
    let res = await db.query(`SELECT *  FROM ${tableName} WHERE name_resource='${domain}'`)
    return {
        status: true,
        data: res
    }
}

export async function sendMercurySelectors({ domain,  url_resource, settings_mercury }) {
    const tableName = 'resources'
    const db = await store.getDB()
    try {
        if(await db.query(`SELECT domain FROM ${tableName} WHERE name_resource='${domain}'`).length === 0) {
            await db.query(`INSERT INTO ${tableName} (name_resource, url_resource, show_it, source_id, settings_mercury) 
                            VALUES (${domain}, ${url_resource}, yes, 1, ${settings_mercury})`)
        } else {
            await db.query(`UPDATE ${tableName} SET settings_mercury='${settings_mercury}' WHERE name_resource='${domain}'`)
        }
    } catch (err) {
        log(`Error: ${err}`)
        return {
            status: false,
            error: err
        }
    }
    return {
        status: true,
        error: ''
    }
}