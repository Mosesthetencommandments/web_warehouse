<template>
  <scroll-bar>
    <el-menu mode="vertical"
             :default-active="$route.path"
             :collapse="isCollapse">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from './ScrollBar'

  export default {
    components: { SidebarItem, ScrollBar },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      }
    }
  }
</script>
<style scoped>
  .el-menu {
    border: none;
    width: 100%;
  }
</style>
<style lang="scss">
  @import "../../../../styles/variables.scss";
    .el-menu--vertical {
      /deep/ .el-menu {
        background: $sidebar-children-bg;
      }
      /deep/ .el-submenu__title{
        height: 40px;
        min-width: 180px;
        line-height: 40px;
        font-size: $text-df;
        color: $color-gray;
        background: $sidebar-bg;
        padding-left: 10px!important;
        &:hover{
          color: $color-white;
          background-color: $sidebar-bg!important;
        }
        span {
          margin-left: 4px;
        }
        i {
          color: inherit;
        }
      }
      /deep/ .el-menu-item{
        height: 40px;
        line-height: 40px;
        color: $color-gray;
        width: 100%;
        min-width: 100%;
        padding-left: 40px;
        box-sizing: border-box;
        background-color: $sidebar-children-bg!important;
        &:hover {
          color: $color-white;
        }
        &.is-active{
          color: #fff !important;
          position: relative;
          background-color: $color-theme!important;
          &:after{
            content: '';
            width: 4px;
            height: 100%;
            top: 0;
            left: 0;
            background-color: $color-theme;
            position: absolute;
          }
        }
      }
    }

    .nest-menu{
      /deep/ .el-submenu__title {
        font-size: $text-df;
        background-color: $sidebar-children-bg!important;
        padding-left:20px !important;
        &:hover{
          background-color: $sidebar-children-bg!important;
        }
      }
    }
    .nest-menu .el-menu-item {
      font-size: $text-sm;
      padding-left:60px !important;
    }
</style>
