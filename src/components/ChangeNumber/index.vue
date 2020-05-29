<template>
  <div class="components-warpper">
    <p v-if="!visible" @click="edit">{{number}}</p>
    <template v-else>
      <el-input-number controls-position="right" class="input" :min="min" :max="max" v-model="numberCom"></el-input-number>
      <el-button class="button" icon="el-icon-circle-close-outline" size="mini" type="warning" @click="visible = !visible">取消</el-button>
      <el-button class="button" icon="el-icon-circle-check-outline" size="mini" type="success" @click="confirm">确定</el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NullResult',
  data() {
    return {
      numberCom: this.number,
      visible: false
    }
  },
  props: {
    number: {
      type: Number
    },
    min: Number,
    max: Number
  },
  methods: {
    confirm() {
      this.$emit('success', this.numberCom)
      this.visible = false
    },
    edit() {
      this.numberCom = this.number
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="scss" scoped>
  .components-warpper {
    height: auto;
    width: 100%;
    max-width: 150px;
    min-height: 60px;
    text-align: center;
    overflow: hidden;
    p{
      cursor: pointer;
      margin: 0;
      font-weight: 600;
      height: 100%;
      line-height: 60px;
    }
    .button {
      margin: 4px 0 0 0;
      text-align: center;
      padding: 5px 10px;
      display: inline-block;
      width: 45%;
    }
    .input{
      width: 100%;
      text-align: center;
    }
  }
</style>
