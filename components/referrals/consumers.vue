<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Email</th>
          <th class="text-left">Universitas</th>
          <th class="text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in currentEdit.consumer" :key="item.id">
          <td>{{ item.email }}</td>
          <td>{{ JSON.parse(item.other).university }}</td>
          <td>{{ $moment(item.date).format("YYYY-MM-DD HH:mm:ss") }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { global, catchError } from "~/mixins"

export default {
  mixins: [global, catchError]
}
</script>
