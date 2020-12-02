import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        clients: [],
        engines: [],
        config: []
    },
    mutations: {
        clients(state, data) {
            const newClients = []

            data.forEach(client => {
                newClients.push({
                    name: client.name,
                    time: client.time,
                    status: 0,
                    message: 'Подключился!',
                    logs: []
                })
            })

            state.clients = newClients
        },
        engines(state, data) {
            state.engines = data
        },
        config(state, data) {
            state.config = data
        },
        setConfig(state, data) {
            state.config = data
        }
    },
    actions: {
        clientsAct({ commit }, data) {
            commit('clients', data)
        },
        async enginesAct({ commit }) {
            await axios.get(`http://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}/api/getEngines`)
                .then(data => {
                    commit('engines', data.data)
                })
        },
        async configAct({ commit }) {
            await axios.get(`http://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}/api/getConfig`)
                .then(data => {
                    commit('config', data.data)
                    console.log(data)
                })
        },
        async sendConfigAct({ commit }, data) {
            commit('setConfig', data)
            await axios.post(`http://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}/api/setConfig`, { config: data })
        }
    },
    modules: {},
    getters: {
        getClients: state => state.clients,
        getEngines: state => state.engines,
        getConfig: state => state.config
    }
})