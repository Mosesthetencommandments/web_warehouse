<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <keep-alive :include='cachedViews'>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>

export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
<style>
  .app-main {
    position: relative;
    min-height: calc(100vh - 74px);
    /*background-color: #f8f8f8;*/
  }
</style>
