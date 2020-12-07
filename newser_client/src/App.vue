<template>
  <v-app>
    <v-card color="grey lighten-4" flat tile>
      <v-toolbar dense style="width: 100%">
        <v-toolbar-title @click="$router.push('/')" style="cursor: pointer"
          >Панель управления системой Newser</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <div class="text-center">
          <v-bottom-sheet v-model="sheetQuery" inset>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="orange" dark v-bind="attrs" v-on="on">
                Добавить запрос в базу
              </v-btn>
            </template>
            <v-sheet class="text-center" height="700px">
              <v-btn
                class="mt-6"
                text
                color="error"
                @click="sheetQuery = !sheetQuery"
              >
                Закрыть
              </v-btn>
              <div class="my-3">
                <v-card>
                  <v-container fluid>
                    <v-row align="center">
                      <v-text-field
                        label="Запрос"
                        v-model="customQuery"
                      ></v-text-field>
                      <v-spacer></v-spacer>
                      <v-text-field
                        label="id_rquest"
                        type="number"
                        v-model="customId_request"
                      ></v-text-field>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="values"
                          :items="items"
                          outlined
                          dense
                          chips
                          small-chips
                          label="Outlined"
                          multiple
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-btn color="warning" @click="addCustomQuery">
                      Добавить
                    </v-btn>
                  </v-container>
                </v-card>
              </div>
            </v-sheet>
          </v-bottom-sheet>
        </div>
      </v-toolbar>

      <!-- <router-view /> -->

      <v-simple-table style="padding: 10px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Клиент</th>
              <th class="text-left">Время подключения</th>
              <th class="text-left">Действия</th>
              <th class="text-left">Конфиг</th>
              <th class="text-left">Логи</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in getClients" :key="item.name">
              <td class="itemName">
                {{ item.name }}
                <v-progress-circular
                  class="progressBar"
                  v-if="item.status === 2"
                  indeterminate
                  color="red"
                ></v-progress-circular>
              </td>
              <td class="timeConnect">
                {{ item.time }}
                <div style="min-height: 4px">
                  <v-progress-linear
                    v-if="item.status === 1"
                    color="green"
                    class="isWorkStatus"
                    :active="show"
                    :indeterminate="query"
                  ></v-progress-linear>
                </div>
              </td>
              <td>
                <div style="margin-top: 5px">
                  <v-btn
                    v-if="
                      item.status === 0 &&
                      item.name.split('_')[0] === 'puppeteer'
                    "
                    style="margin-right: 10px"
                    outlined
                    small
                    color="green"
                    @click="setClient(item)"
                    ><v-icon>mdi-play</v-icon>
                  </v-btn>

                  <v-btn
                    v-if="
                      item.status === 0 &&
                      item.name.split('_')[0] !== 'puppeteer'
                    "
                    style="margin-right: 10px"
                    outlined
                    small
                    color="green"
                    @click="
                      dialog = false;
                      client = item;
                      start(item);
                    "
                    ><v-icon>mdi-play</v-icon>
                  </v-btn>

                  <v-btn
                    v-if="
                      item.status === 1 ||
                      item.status === 2 ||
                      item.status === 3
                    "
                    :disabled="item.status === 2"
                    style="margin-right: 10px"
                    outlined
                    small
                    color="red"
                    @click="stop(item)"
                  >
                    <v-icon>mdi-stop</v-icon>
                  </v-btn>
                  <v-btn outlined small color="black" @click="restart(item)"
                    ><v-icon>mdi-sync</v-icon>
                  </v-btn>
                </div>
              </td>

              <td
                style="cursor: pointer"
                @click="
                  client = item;
                  sheetConfig = true;
                  checkClient = true;
                  getConfigAct();
                "
              >
                Изменить
              </td>
              <td
                style="cursor: pointer"
                @click="
                  client = item;
                  sheet = true;
                "
              >
                Смотреть
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <!-- <v-row style="margin: 0 auto">
      <v-btn style="width: 200px; margin-right:20px; margin-left: 20px;" outlined color="green" @click="startAll()">Запустить все</v-btn>
      <v-btn style="width: 200px; margin-right:20px;" outlined color="red" @click="stopAll()">Остановить все</v-btn>
      <v-btn style="width: 200px; margin-right:20px;" outlined color="black" @click="restartAll()">Перезапустить все</v-btn>
    </v-row> -->

    <div class="text-center">
      <v-bottom-sheet v-model="sheet" persistent>
        <v-sheet class="text-center logs_block">
          <v-btn class="mt-3 closeBtn" color="error" @click="sheet = !sheet">
            &#10006;
          </v-btn>
          <v-spacer></v-spacer>
          <span class="nameLogs">Логи {{ client.name }}</span>

          <ul class="logs">
            <li v-for="(log, i) in client.logs" :key="i">{{ log }}</li>
          </ul>
        </v-sheet>
      </v-bottom-sheet>

      <div class="text-center">
        <v-bottom-sheet v-model="sheetConfig" persistent>
          <v-sheet v-if="checkClient" class="text-center logs_block">
            <v-btn
              class="mt-3 closeBtn"
              color="error"
              @click="sheetConfig = !sheetConfig"
            >
              &#10006;
            </v-btn>
            <v-spacer></v-spacer>
            <span class="nameLogs">Конфигурация {{ client.name }}</span>
            <div class="both"></div>
            <div class="config">
              <vue-json-editor
                :show-btns="saveBtn"
                @json-save="onJsonSave"
                @json-change="onJsonChange"
                v-if="client.name.split('_')[0] === 'puppeteer'"
                v-model="getConfig"
                lang="en"
              />
            </div>
          </v-sheet>
        </v-bottom-sheet>
      </div>
    </div>

    <v-row justify="center" v-if="puppeteer">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Настройки запуска</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="
                  dialog = false;
                  start();
                "
              >
                Запуск
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list three-line subheader>
            <v-subheader>{{ client_name }}</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Источник запросов</v-list-item-title>
                <v-select v-model="source" :items="sources"></v-select>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  >Глубина поиска (в страницах)</v-list-item-title
                >
                <v-text-field type="number" v-model="pages"></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-subheader>Поисковые системы</v-subheader>
            <v-list-item v-for="(item, index) in getEngines" :key="index">
              <v-list-item-action>
                <v-checkbox v-model="engines[index]"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
                <v-list-item-subtitle
                  >Добавить поисковую систему {{ item }} в
                  поиск</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-row>

    <div v-if="snackbar" class="text-center ma-2">
      <v-snackbar v-model="snackbar" timeout="2000">
        Конфигурация
        {{ client.name.split("_")[0] + "_" + client.name.split("_")[1] }}
        обновлена
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Закрыть
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import vueJsonEditor from "vue-json-editor";
import axios from "axios";
export default {
  components: {
    vueJsonEditor,
  },

  mounted() {
    this.getEnginesAct();
    this.queryAndIndeterminate();
  },

  data() {
    return {
      client: "",
      client_name: "",
      puppeteer: false,
      dialog: false,
      pages: 1,
      sources: ["Удаленный сервер", "Локальное хранилище запросов"],
      source: "Удаленный сервер",
      engines: [false, false, false],
      sheet: false,
      logs: [],
      sheetConfig: false,
      checkClient: false,
      snackbar: "",
      saveBtn: false,
      query: false,
      show: true,
      interval: 0,
      sheetQuery: false,
      items: ["Yandex", "Rambler", "Google"],
      values: [],
      value: null,
      customQuery: "",
      customId_request: Number,
      customObject: {
        3: false,
        4: false,
        7: false,
      },
    };
  },

  computed: {
    ...mapGetters(["getClients", "getEngines", "getConfig"]),
    getConfig: {
      get() {
        return this.$store.state.config;
      },
      set(value) {
        this.config = value;
      },
    },
  },

  sockets: {
    connect: function () {
      this.whoami();
      this.getStatus();
    },
    update_clients: function (data) {
      this.getClientsAct(data);
      this.getStatus();
    },
    log: function ({ member, text, status }) {
      this.getClients.map((client) => {
        if (client.name === member) {
          if (client.status !== 2 || status === 0)
            client.status = Number(status);
          client.logs.unshift(text);
        }
      });
    },
    getStatusToClient: function ({ member, status }) {
      this.getClients.map((client) => {
        if (client.name === member) {
          if (client.status !== 2 || status === 0)
            client.status = Number(status);
          client.status = Number(status);
        }
      });
    },
  },

  methods: {
    ...mapActions(["clientsAct", "enginesAct", "configAct", "sendConfigAct"]),

    startAll() {},
    stopAll() {},
    restartAll() {},

    async addCustomQuery() {
      console.log(`Запрос: ${this.customQuery}`);
      console.log(`id_request: ${this.customId_request}`);
      this.customObject = {
        3: this.values.indexOf("Rambler") != -1,
        4: this.values.indexOf("Yandex") != -1,
        7: this.values.indexOf("Google") != -1,
      };
      console.log(`Engines: ${JSON.stringify(this.customObject)}`);
      let data = {
        query: this.customQuery,
        id_request: this.customId_request,
        engines: this.customObject,
      };
      await axios
        .post(`http://localhost:5000/api/addQuery`, data)
        .then(console.log("Успешно"));
    },
    setClient(client) {
      this.client = client;
      this.client_name = client.name;
      (this.puppeteer = this.client_name
        ? this.client_name.split("_")[0] === "puppeteer"
        : false),
        (this.dialog = true);
    },

    getClientsAct(data) {
      this.clientsAct(data);
    },

    async getEnginesAct() {
      await this.enginesAct();
    },

    async getConfigAct() {
      await this.configAct();
    },

    getStatus() {
      this.$socket.emit("getStatus");
    },

    onJsonSave(value) {
      if (Object.keys(value).length > 0) {
        this.sendConfigAct(value);
        this.snackbar = true;
      } else this.sheetConfig = false;
    },

    onJsonChange(value) {
      if (value) this.saveBtn = true;
    },

    /**               Socket Methods                  */
    whoami() {
      this.$socket.emit("who_am_i", "newser_client");
    },

    start() {
      let queryData = {};
      queryData.source = this.source;
      queryData.pages = this.pages;
      queryData.engines = this.engines;
      this.$socket.emit("start", this.client, queryData);
    },

    stop(client) {
      if (this.$socket.emit("stop", client)) client.status = "idle";
    },

    restart(client) {
      this.$socket.emit("restart", client);
    },

    viewLogs(name) {
      console.log(name);
      this.logs = this.getClients;
      console.log(this.logs);
      this.showLogsWindow = true;
    },

    queryAndIndeterminate() {
      this.query = true;
      this.show = true;
      this.interval = setInterval(() => {}, 1000);
    },
    /************************************************ */
  },
};
</script>

<style scoped>
* {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.logs_block {
  height: 100vh;
}
.logs {
  text-align: left;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-y: scroll;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 3px 15px;
  font-size: 0.9rem;
  line-height: 1rem;
  font-weight: 400;
  width: 100%;
  -ms-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
}
.logs > li {
  list-style: none;
}
.btn {
  width: 200px;
  margin: 25px;
}
.closeBtn {
  opacity: 0.7;
  cursor: pointer;
  float: right;
  margin-right: 30px;
  font-size: 200%;
}
.nameLogs {
  margin-top: 10px;
  margin-bottom: 5px;
  float: left;
  margin-left: 15px;
  font-size: 20px;
  padding: 7px;
  /* font-style: italic; */
  border-radius: 8px;
  /* background: rgba(180, 25, 12, 0.3); */
}
.closeLogs > div:active {
  opacity: 0.9;
}
.footer {
  width: 100%;
}
.main {
  min-height: 85vh;
}
.both {
  clear: both;
}
.config {
  height: 82%;
  overflow-y: scroll;
}
.v-progress-circular {
  margin: 1rem;
}
.itemName {
  position: relative;
  text-indent: 30px;
}
.progressBar {
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  margin: auto;
}
.isWorkStatus {
  width: 150px;
}
.timeConnect {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
