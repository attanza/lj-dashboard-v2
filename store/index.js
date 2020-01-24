export const state = () => ({
  sidebar: false,
  user: {},
  token: null,
  currentEdit: null,
  currentEdit2: null,
  comboData: null,
  comboData2: null,
  comboData3: null,
  permissions: null,
  dashboardData: null,
  universityId: null,
  studyId: null,
  targetId: null,
  schedulleId: null
});
export const mutations = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar;
  },
  user(state, p) {
    state.user = p;
  },
  token(state, p) {
    state.token = p;
  },
  currentEdit(state, p) {
    state.currentEdit = p;
  },
  currentEdit2(state, p) {
    state.currentEdit = p;
  },
  comboData(state, p) {
    state.comboData = p;
  },
  comboData2(state, p) {
    state.comboData2 = p;
  },
  comboData3(state, p) {
    state.comboData3 = p;
  },
  permissions(state, p) {
    state.permissions = p;
  },
  dashboardData(state, p) {
    state.dashboardData = p;
  },
  universityId(state, p) {
    state.universityId = p;
  },
  studyId(state, p) {
    state.studyId = p;
  },
  targetId(state, p) {
    state.targetId = p;
  },
  schedulleId(state, p) {
    state.schedulleId = p;
  }
};
export const actions = {};

export const getters = {
  getPermissions: state => name => {
    return state.comboData.filter(
      item => item.name.toLowerCase().indexOf(name) > -1
    );
  },
  getRoles: state => name => {
    return state.comboData.filter(
      item => item.name.toLowerCase().indexOf(name) > -1
    );
  }
};
