<template>
  <div class="login-container">
    <el-dialog title="选择账号登录"
               :visible.sync="dialogFormVisible"
               width="60%"
               center
               :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false">
      <div slot class="account-box">
        <div class="account" v-for="item in accountList" :key="item.id" @click="changeAccount(item)">
          <img :src="item.head_img" alt="">
          <div class="info">
            <span >账号：{{item.nickname}}</span>
            <span >部门：{{item.user_account_group.group_name}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { loginAccount } from '@/api/login'
  import { getUserToken, getAccountToken, setAccountToken, removeUserToken, removeAccountToken } from '@/utils/auth'
  export default {
    name: 'selectAccount',
    data() {
      return {
        dialogFormVisible: false,
        accountList: []
      }
    },
    created() {
      this.getAccountList()
    },
    methods: {
      getAccountList() {
        loginAccount({
          token: getUserToken()
        }).then(res => {
          this.dialogFormVisible = true
          this.accountList = res.data
        })
      },
      changeAccount(item) {
        this.$store.dispatch('LoginAccount', item.id).then(res => {
          setAccountToken(res.data)
          this.$router.push('/')
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    @include relative;
    height: 100vh;
    background-color: $bg;
    display: flex;
    justify-content: center;
    align-items: center;
    .account-box {
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-around;
      align-items: center;
      align-content: flex-start;
      .account {
        padding: 10px;
        width: 45%;
        display: flex;
        margin-bottom: 20px;
        cursor: pointer;
        border: solid 2px #eee;
        &:hover{
          background: #eee;
        }
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        .info {
          display: flex;
          flex-flow: column;
          justify-content: space-around;
          align-items: flex-start;
          margin-left: 20px;
        }
      }
    }
  }
</style>
