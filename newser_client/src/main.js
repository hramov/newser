import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
import vuetify from './plugins/vuetify'
import VJsoneditor from 'v-jsoneditor/src/index'

Vue.use(VJsoneditor)
Vue.config.productionTip = false
Vue.use(new VueSocketIO({
    debug: false,
    connection: `http://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}`,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')