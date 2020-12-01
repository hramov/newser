'use strict'

import path from 'path'
import underscore from 'underscore'
import axios from 'axios'

class Store {
    constructor() {
        if (Store.exists) return Store.instance

        this.db = {}
        this.path = path
        this.underscore = underscore
        this.cli = {}
        this.socket = {}
        this.isGo = false
        this.status = 0

        Store.exists = true
        Store.instance = this
    }

    /** Mutations */
    setDB(data) {
        this.db = data
    }
    setStatus(data) {
        this.status = data
    }
    setUnderscore(data) {
        this.underscore = data
    }
    setPath(data) {
        this.path = data
    }
    setSocket(data) {
        this.socket = data
    }
    async setNews(data, queue) {
        console.log(data)
        await axios.post(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/sendDataToRabbitMQ`, {
            queue: queue,
            data: data
        })
    }
    setIsGo(data) {
        this.isGo = data
    }

    /** Getters */
    getDB() {
        return this.db
    }
    getUnderscore() {
        return this.underscore
    }
    getPath() {
        return this.path
    }
    getSocket() {
        return this.socket
    }
    async getExtractor(domain) {
        let data = await axios.get(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/getMercurySelectors/${domain}`)
        return data.data
    }
    getIsGo() {
        return this.isGo
    }
    getStatus() {
        return this.status
    }
}

export default new Store()