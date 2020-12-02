<template>
  <v-container>
    <v-card-title>Подключенные клиенты</v-card-title>
    <div class="clients">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Клиент</th>
              <th class="text-left">Время подключения</th>
              <th class="text-left">Действия</th>
              <th class="text-left">Статус</th>
              <th class="text-left">Конфиг</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in getClients" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.time }}</td>
              <td>
                <div style="margin-top: 5px">
                  <v-btn
                    v-if="item.status === 'idle'"
                    style="margin-right: 10px"
                    outlined
                    small
                    color="green"
                    @click="start(item)"
                    ><v-icon>mdi-play</v-icon></v-btn
                  >
                  <v-btn
                    v-if="item.status === 'running'"
                    style="margin-right: 10px"
                    outlined
                    small
                    color="red"
                    @click="stop(item)"
                    ><v-icon>mdi-stop</v-icon>
                  </v-btn>
                  <v-btn outlined small color="black" @click="restart(item)"
                    ><v-icon>mdi-sync</v-icon>
                  </v-btn>
                </div>
              </td>
              <td>{{ item.message }}</td>
              <td @click="$router.push('/config')" style="cursor: pointer">
                Изменить
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "App",
  computed: {
    ...mapGetters(["getClients"]),
  },
  sockets: {
    connect: function () {
      this.whoami();
    },
    update_clients: function (data) {
      this.getClientsAct(data);
    },
    log: function({ member, data }) {
      this.getClients.map(client => {
        if(client.name === member) client.message = data
      })
    }
  },
  methods: {
    ...mapActions(["clientsAct"]),
    getClientsAct(data) {
      this.clientsAct(data);
    },

    /**               Socket Methods                  */
    whoami() {
      this.$socket.emit("who_am_i", "newser_client");
    },
    start(client) {
      if (this.$socket.emit("start", client)) client.status = "running";
    },
    stop(client) {
      if (this.$socket.emit("stop", client)) client.status = "idle";
    },
    restart(client) {
      this.$socket.emit("restart", client);
    },
    /************************************************ */
  },
  mounted() {
  },
  data: () => ({
  }),
};
</script>

<style scoped>
  * {
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
  }
</style>