<template>
  <v-container fluid>
    <marketingTable :data="currentEdit" />
    <contactTable />
    <yearsTable />
    <attachmentTable />
    <table class="table is-fullwidth mt-3">
      <tbody>
        <tr>
          <th width="30%">
            Perizinan
          </th>
          <td width="70%">
            {{ currentEdit.terms }}
          </td>
        </tr>
        <tr>
          <th>Hasil</th>
          <td>{{ currentEdit.result }}</td>
        </tr>
        <tr>
          <th>Catatan</th>
          <td>{{ currentEdit.note }}</td>
        </tr>
        <tr>
          <th>Deskripsi</th>
          <td>{{ currentEdit.description }}</td>
        </tr>
      </tbody>
    </table>
  </v-container>
</template>

<script>
import { global } from "~/mixins"
import marketingTable from "./marketingTable"
import contactTable from "./contactTable"
import yearsTable from "./yearsTable/yearsTable"
import attachmentTable from "./attachmentTable"

export default {
  components: { marketingTable, contactTable, yearsTable, attachmentTable },
  mixins: [global]
}
</script>

<style scoped></style>
