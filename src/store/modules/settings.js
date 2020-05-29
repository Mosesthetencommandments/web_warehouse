import { getTheme } from '@/utils/auth'

const settings = {
  state: {
    theme: getTheme(),
  },
  mutations: {
    SET_THEME: (state, color) => {
      state.theme = color
    }
  },
  actions: {}
}

export default settings
