import Vue from 'vue'
import { Bar } from 'vue-chartjs'

Vue.component('bar-chart', {
  extends: Bar,
  props: {
    data: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.renderChart(this.data, this.options)
  },
})
