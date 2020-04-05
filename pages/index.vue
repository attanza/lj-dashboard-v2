<template>
  <div>
    <v-row v-if="dashboardData">
      <v-col cols="12" sm="6">
        <v-card light class="elevation-2 mb-2" max-height="200px">
          <v-row class="px-3">
            <v-col cols="4">
              <v-icon color="primary" style="font-size: 3rem;"
                >supervised_user_circle</v-icon
              >
            </v-col>
            <v-col cols="8">
              <div>Active Marketings</div>
              <div class="title primary--text">
                {{ dashboardData.total_marketings }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-row class="px-3">
            <v-col cols="4" align-self="center">
              <v-icon color="primary" style="font-size: 3rem;"
                >account_balance</v-icon
              >
            </v-col>
            <v-col cols="8">
              <div>Registered Universities</div>
              <div class="title primary--text">
                {{ dashboardData.total_universities }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-row class="px-3">
            <v-col cols="4" align-self="center">
              <v-icon color="primary" style="font-size: 3rem;">devices</v-icon>
            </v-col>
            <v-col cols="8">
              <div>Registered Products</div>
              <div class="title primary--text">
                {{ dashboardData.total_products }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="chartData">
      <v-col>
        <bar-chart :chart-data="chartData" :options="options" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { DASHBOARD_DATA_URL } from "~/utils/apis"
import { global, catchError } from "~/mixins"

export default {
  mixins: [global, catchError],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),
  mounted() {
    this.seedData()
  },
  methods: {
    async seedData() {
      try {
        this.activateLoader()
        let resp = await this.$axios.$get(DASHBOARD_DATA_URL)
        if (resp) this.$store.commit("dashboardData", resp)
        this.generateChartData()
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    },
    generateChartData() {
      if (this.dashboardData) {
        const onlineOrders = this.dashboardData.onlineOrders
        const data = []
        const labels = []
        onlineOrders.map(o => {
          data.push(o.total)
          labels.push(
            this.$moment()
              .month(o.month - 1)
              .format("MMM")
          )
        })
        const datasets = [
          {
            label: `Online Product Order Year of ${this.$moment().format(
              "YYYY"
            )}`,
            backgroundColor: "#EF6C00",
            data: data
          }
        ]
        const chartData = {
          labels,
          datasets
        }
        this.$store.commit("chartData", chartData)
      }
    }
  }
}
</script>
<style scoped>
.flex-all-centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
