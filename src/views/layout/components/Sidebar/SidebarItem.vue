<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.meta.hidden">
      <el-submenu :index="item.name || item.path" :key="item.name">

        <template slot="title">
          <svg-icon class="sidebar-svg" v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon + '-sidebar'"></svg-icon>
          <span v-if="item.meta && item.meta.title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.meta.hidden">
          <sidebar-item v-if="child.children && child.children.length > 0" class="nest-menu"  :routes="[child]" :key="child.path">
          </sidebar-item>
          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item v-waves :index="item.path+'/'+child.path" >
              <div style="height: 100%;position: absolute;width: 100%;left:0;transition: all .8s" :style="{backgroundColor: isActive(item.path+'/'+child.path)? $store.getters.theme : 'transparent'}">
              </div>
              <span style="position: absolute;z-index: 999"
                    v-if="child.meta && child.meta.title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
  import waves from '@/directive/waves-theme' // 水波纹指令

  export default {
  name: 'SidebarItem',
  directives: {
    waves
  },
  props: {
    routes: {
      type: Array
    }
  },
  methods: {
    isActive(route) {
      return route === this.$route.path
    }
  }
}
</script>

<style scoped lang="scss">

  @import "../../../../styles/variables.scss";

  .el-submenu {
    /deep/ .el-submenu__title{
      height: 40px;
      line-height: 40px;
      font-size: $text-df;
      color: $color-white;
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
      color: $color-white;
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
        transition: all .8s;
        position: relative;
        &:after{
          background-color: transparent!important;
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

  .el-menu--collapse .el-menu .el-submenu{
    min-width: 180px!important;
  }

  /*.nest-menu .el-submenu>.el-submenu__title{*/
    /*min-width: 170px!important;*/
    /*padding-left:30px !important;*/
    /*background-color: red!important;*/
  /*}*/



  /*.el-menu-item.is-active:hover {*/
    /*background-color: #00c1de !important;*/
  /*}*/
  /*.el-menu-item, .el-submenu__title {*/
    /*height: 30px;*/
    /*line-height: 30px;*/
  /*}*/
  /*.el-submenu .el-menu-item {*/
    /*height: 42px;*/
    /*line-height: 42px;*/
  /*}*/
  /*.scroll-wrapper .el-submenu__title:hover {*/
    /*background-color: #00c1de;*/
  /*}*/
  /*.menu-wrapper >>> .sidebar-svg {*/
    /*font-size: 18px;*/
    /*vertical-align: middle;*/
  /*}*/
  /*.el-menu-item >>>.svg-icon{*/
    /*font-size: 18px;*/
    /*vertical-align: middle;*/
  /*}*/
</style>
