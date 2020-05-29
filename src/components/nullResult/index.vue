<template>
  <div class="components_warpper">
    <div class="img"></div>
    <p>无搜索结果</p>
  </div>
</template>

<script>
export default {
  name: 'NullResult',
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  .components_warpper {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .img {
    width: 150px;
    height: 150px;
    background: url('../../assets/default.jpg') no-repeat -720px -200px;
  }
  p {
    color: #393f3d;
  }
</style>
