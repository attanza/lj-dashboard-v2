export const state = () => ({
  sidebar: false,
  token: null,
  currentEdit: null,
  permissions: null,
  dashboardData: null,
  comboData: null,
  chartData: null,
  referrals: []
})
export const mutations = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar
  },
  user(state, p) {
    state.auth.user = p
  },
  token(state, p) {
    state.token = p
  },
  currentEdit(state, p) {
    state.currentEdit = p
  },
  comboData(state, p) {
    state.comboData = p
  },

  permissions(state, p) {
    state.permissions = p
  },
  dashboardData(state, p) {
    state.dashboardData = p
  },
  chartData(state, p) {
    state.chartData = p
  },
  referrals(state, p) {
    state.referrals = p
  }
}
export const actions = {}

export const getters = {
  getPermissions: state => name => {
    return state.comboData.filter(
      item => item.name.toLowerCase().indexOf(name) > -1
    )
  },
  getRoles: state => name => {
    return state.comboData.filter(
      item => item.name.toLowerCase().indexOf(name) > -1
    )
  }
}
