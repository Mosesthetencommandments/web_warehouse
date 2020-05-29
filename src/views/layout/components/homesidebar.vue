<template>
  <div class="sidebar-warrper" @mouseenter="mouseEnter">
    <div class="sidebar">
      <div class="sidebar-item" v-for="item in $store.state.user.getaways" :key="item.type_code">
        <a :href="item.api_url" class="sidebar-item-a" :class="item.type_code == gateway_code? 'current': ''">
          <div class="stamp-div" v-if="item.type_code == gateway_code"></div>
          <svg-icon :icon-class="item.type_code + '_dashboard'" class="svg_icon"/>
          <!--<svg-icon icon-class="example-sidebar" class="svg_icon"/>-->
          <span class="gateway-name">{{item.type_name}}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gateway_code: process.env.PRO_CODE,
    }
  },
  methods: {
    mouseEnter() {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../styles/variables.scss";

  .sidebar-warrper {
    /*border-top: 2px solid #a9a9a9;*/
  }

  .sidebar {
    width: 40px;
    height: 100vh;
    background-color: $home-sidebar-bg;
    transition: width .5s;
    &:hover {
      width: 220px;
    }
    .sidebar-item {
      width: 100%;
      height: 40px;
      overflow: hidden;
      text-align: center;
      white-space: nowrap;
      cursor: pointer;
      .current {
        background-color: $sidebar-bg !important;
        color: white!important;
      }
      .sidebar-item-a {
        color: $color-gray;
        width: 220px;
        display: flex;
        position: relative;
        justify-content: space-between;
        align-items: center;
        .stamp-div {
          position: absolute;
          width: 4px;
          height: 36px;
          top: 2px;
          left: 0;
          background: $color-theme;
        }
        .svg_icon {
          width: 20px;
          height: 20px;
          margin: 10px;
        }
        .gateway-name {
          width: 170px;
          font-size: $text-df;
          padding-left: 10px;
          text-align: left;
        }
      }
      &:hover .svg_icon{
        color: white;
      }
      &:hover .gateway-name{
        color: white;
      }
    }
  }
</style>
