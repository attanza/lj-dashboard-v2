<template>
  <v-toolbar flat>
    <span class="title">IDR {{ revenue.toLocaleString() }}</span>
    <v-spacer></v-spacer>
    <span>
      <date-picker
        ref="datepicker"
        v-model="date1"
        :shortcuts="shortcuts"
        :not-after="today"
        range
        lang="eng"
        width="100%"
        placeholder="Pilih range tanggal"
      />
    </span>
  </v-toolbar>
</template>

<script>
import { global, catchError, datePickerShortcut } from "~/mixins"
export default {
  mixins: [global, catchError, datePickerShortcut],
  props: {
    marketingId: {
      type: String,
      required: false,
      default: ""
    }
  },
  data: () => ({
    revenue: 0
  }),
  watch: {
    date1() {
      if (!this.date1[0] || !this.date1[1]) {
        this.revenue = 0
      } else {
        this.dateChange()
      }
    }
  },
  methods: {
    async dateChange() {
      try {
        this.activateLoader()
        let query = `?start_date=${this.$moment(this.date1[0]).format(
          "YYYY-MM-DD"
        )}&end_date=${this.$moment(this.date1[1]).format("YYYY-MM-DD")}`
        if (this.marketingId !== "") {
          query += `&marketing_id=${this.marketingId}`
        }
        let resp = await this.$axios.$get(`/revenue${query}`)
        this.revenue = resp.data.revenue
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    }
  }
}
</script>
