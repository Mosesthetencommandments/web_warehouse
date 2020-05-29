<template>
  <div class="hamburger-container" @click="toggleClick">
    <div class="hamburger-box">
      <svg-icon style="margin: 0" icon-class="sidebar-show" class="svg_icon hamburger" :class="{'sidebar-is-active':isActive}"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/variables.scss";

  .hamburger-container {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $sidebar-bg;
    &:before{
      content: '';
      width: 0;
      height: 0;
      bottom: -4px;
      left: 0;
      border-left: 8px solid $sidebar-bg;
      border-top: 2px solid $sidebar-bg;
      border-right: 8px solid transparent;
      border-bottom: 2px solid transparent;
      position: absolute;
    }
    &:after{
      content: '';
      width: 0;
      height: 0;
      top: -4px;
      left: 0;
      border-left: 8px solid $sidebar-bg;
      border-top: 2px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 2px solid $sidebar-bg;
      position: absolute;
    }
  }
  .hamburger {
    font-size: 14px;
    display: inline-block;
    transform: rotate(0deg);
    transform-origin: 50% 50%;
  }
  .sidebar-is-active {
      transform: rotate(180deg);
  }
</style>
