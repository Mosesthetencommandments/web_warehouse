<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <navbar></navbar>
    <homesidebar class="homesidebar-container"></homesidebar>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, homesidebar } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    homesidebar,
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .main-container {
    min-height: calc(100% - 40px);
    /*transition: margin-left 0.28s;*/
    margin-left: 220px;
  }
  .homesidebar-container {
    height: auto;
    top: 40px;
    left: 0;
    z-index: 1001;
    position: fixed;
  }
  .sidebar-container {
    width: 180px!important;
    height: 100%;
    position: fixed!important;
    top: 40px;
    bottom: 0;
    left: 40px;
    z-index: 1000;
  }
</style>
