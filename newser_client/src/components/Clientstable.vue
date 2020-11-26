<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Клиент</th>
          <th class="text-left">Время подключения</th>
          <th class="text-left">Действия</th>
          <th class="text-left">Логи</th>
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
          <td @click="showLogs(item)" style="cursor: pointer">Смотреть</td>
          <td @click="$router.push('/config')" style="cursor: pointer">
            Изменить
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>