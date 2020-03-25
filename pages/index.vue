<template>
  <div>
    <v-row v-if="dashboardData">
      <v-col cols="12" sm="6">
        <v-card light class="elevation-2 mb-2" max-height="200px">
          <v-row class="px-3">
            <v-col cols="4">
              <v-icon color="primary" style="font-size: 3rem;">
                supervised_user_circle
              </v-icon>
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
              <v-icon color="primary" style="font-size: 3rem;">
                account_balance
              </v-icon>
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
    </v-row>
    <v-row>
      <v-col>
        <bar-chart :data="chartdata" :options="options" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { DASHBOARD_DATA_URL } from '~/utils/apis'
import { global, catchError } from '~/mixins'

export default {
  mixins: [global, catchError],
  data: () => ({
    chartdata: {
      labels: ['January', 'February', 'Maret'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [40, 20, 50],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),
  mounted() {
    this.seedData()
  },
  methods: {
    async seedData() {
      try {
        this.activateLoader()
        let resp = await this.$axios.$get(DASHBOARD_DATA_URL)
        if (resp) this.$store.commit('dashboardData', resp)
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    },
  },
}
</script>
<style scoped>
.flex-all-centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
