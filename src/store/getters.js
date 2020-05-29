const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  user_account_id: state => state.user.user_account_id,
  user_account_group_id: state => state.user.user_account_group_id,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  important_notice: state => state.user.important_notice,
  theme: state => state.settings.theme
  // achievement: state => state.user.achievement
}
export default getters
