<template>
  <div class="navbar-warpper">
    <div class="navbar">
      <!--<div class="home">-->
        <!--<svg-icon class="svg_icon" :icon-class="gateway_code + '_dashboard'" />-->
      <!--</div>-->
      <div class="gateway-name">
        <router-link to="/">
          <el-button type="text" class="name">{{project_name}}</el-button>
        </router-link>
      </div>
      <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
      <!--<breadcrumb></breadcrumb>-->
      <theme-picker @change="pickTheme"></theme-picker>
      <el-menu class="menu-box" text-color="#fff" background-color="#3f4650" mode="horizontal">
        <el-submenu index="1" class="messageNotification">
          <div slot="title">
            <el-badge :value="(system_notice + important_notice)" :hidden="(system_notice + important_notice) === 0 ? true : false"  class="item">
              <i class="el-icon-message"></i>
            </el-badge>
          </div>
          <div class="message-menu">
            <a url="" class="message-a">
              <span class="link-hover">重要通知</span>
              <span class="message-icon" v-show="important_notice!=0">{{important_notice}}</span>
            </a>
            <a url="" class="message-a">
              <span class="link-hover">系统消息</span>
              <span class="message-icon" v-show="system_notice!=0">{{system_notice}}</span>
            </a>
          </div>
        </el-submenu>

        <el-submenu index="2" class="avatar-container">
          <img slot="title" style="cursor: pointer" class="user-img" :src="avatar">
          <div class="message-menu">
            <div class="user-dropdown-top">
              <router-link class="user-dropdown-top-a" to="/user_center/user_center/user_info">
                <img class="user-dropdown-user-img" :src="avatar">
                <span class="link-hover user-dropdown-user-name">{{$store.state.user.name}}</span>
              </router-link>
            </div>
            <router-link to="/user_center/user_center/integral_query" class="link-hover user-dropdown-item">
              <svg-icon icon-class="accumulate_points" class="svg_icon"/>
              积分:<span></span>
            </router-link>
            <router-link to="/user_center/user_center/user_info" class="link-hover user-dropdown-item">
              <svg-icon icon-class="account_setting" class="svg_icon"/>
              账户设置
            </router-link>
            <div class="user-dropdown-bottom">
              <span class="link-hover" @click="selectAccount">切换账号</span>
            </div>
            <div class="user-dropdown-bottom">
              <span @click="logout" class="logout">退出登录</span>
            </div>
          </div>
        </el-submenu>
      </el-menu>
      <!--<div class="logout-box">-->
        <!--<svg-icon class="svg_icon" icon-class="exit" />-->
      <!--</div>-->
    </div>

    <el-dialog title="提示"
                style="font-size: 20px"
                :visible.sync="centerDialogVisible"
                width="30%"
                class="el-title"
                center>
      <p style="text-align: center;font-size: 25px">你有新的未读消息</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
 </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUnreadNoticeData } from '@/api/user'
import { setTheme } from '@/utils/auth'
import { removeAccountToken } from '@/utils/auth'
import Breadcrumb from '@/components/Breadcrumb'
import themePicker from '@/components/themePicker'
import Hamburger from '@/components/Hamburger'
import CountUp from 'countup.js'
export default {
  data() {
    return {
      gateway_code: process.env.PRO_CODE,
      project_name: process.env.PRO_NAME,
      showIcon: false,
      showName: false,
      performance: 0,
      oldPerformance: 0,
      curperformance: 0,
      ranking_number: '--',
      system_notice: 0,
      important_notice: 0,
      centerDialogVisible: false,
      themeDialogVisible: false,
      original_important_notice: 0,
      numAnim: null
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    themePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    opened() {
      return this.$store.state.app.sidebar.opened
    }
  },
  mounted() {
  },
  created() {
    // this.getCount()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    selectAccount() {
      removeAccountToken()
      location.reload() // 为了重新实例化vue-router对象 避免bug
    },
    handleChangeTheme() {
      this.themeDialogVisible = true
    },
    pickTheme(color) {
      setTheme(color)
      this.$store.commit('SET_THEME',color)
    },
    getCount() {
      getUnreadNoticeData({}).then(response => {
        this.system_notice = response.data.system_notice
        this.important_notice = response.data.important_notice
        if (this.$store.state.user.important_notice < this.important_notice) {
          this.centerDialogVisible = true
          this.$store.state.user.important_notice = this.important_notice
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../styles/variables.scss";

  .navbar-warpper {
    width: 100%;
    height: 40px;
    position: relative;
    .navbar {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      position: fixed;
      background-color: $nav-bg;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1002;
      /*.project-opened {*/
         /*width: 80px;*/
       /*}*/
      .home {
        width: 40px;
        height: 100%;
      }
      .gateway-name {
        padding-left: 40px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .name {
          color: $color-white;
          user-select:none;
          font-size: 16px;
          letter-spacing: 2px;
          white-space: nowrap;
        }
      }
      .menu-box {
        height: 100%;
        display: flex;
        align-items: stretch;
        justify-content: center;
        border: none;
        margin-left: 20px;
        background: transparent;
        /deep/ .el-submenu__icon-arrow {
          display: none;
        }
        /deep/ .el-submenu{
          margin: 0 10px;
        }
        /deep/ .el-submenu__title{
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          line-height: 100%;
          padding: 0;
          margin: 0;
          &:hover {
            background-color: $nav-bg!important;
          }
        }
        .svg_icon {
          color: $color-gray;
          &:hover {
            color: $color-white;
          }
        }
      }
      .logout-box {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          color: white;
          cursor: pointer;
          font-size: 22px;
        }
      }
      .realtime-container{
        text-align: right;
        cursor: default;
        .el-dropdown-link-i {
          color: #E6A23c!important;
          font-size: 28px;
        }
      }
    }
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }

  .messageNotification {
    i {
      font-size: 20px;
      color: $color-gray;
      &:hover {
        color: $color-white;
      }
    }
  }
  .avatar-container {
    .user-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
    }
  }
  .el-icon-star-on {
    color: #ffe600;
  }
  .el-title{
    .el-dialog__title{
      line-height: 24px;
      font-size: 33px !important;
      color: #303133;
    }
  }
  .message-menu {
    min-height: 60px;
    padding: 10px;
    margin: 0;
    font-size: $text-sm;
    background-color: $nav-bg;
    color: white;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    .message-a {
      display: flex;
      justify-content: space-between;
      width: 100px;
      margin: 10px 0;
    }
    .message-icon {
      background:#f56c6c;
      border: 1px solid white;
      width: 20px;
      color: #fff;
      height: 20px;
      border-radius: 50%;
      line-height: 20px;
      text-align: center;
    }
    .user-dropdown-top {
      width: 100%;
      font-size: $text-sm;
      padding: 0 0 10px 0;
      border-bottom: 1px solid #9e9e9e;
      .user-dropdown-top-a {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
      }
      .user-dropdown-user-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .user-dropdown-user-name {
        padding: 0 4px;
        max-width: 140px;
        flex: 1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
      }
    }
    .user-dropdown-item {
      width: 100%;
      margin: 10px 0;
    }
    .user-dropdown-bottom {
      width: 100%;
      text-align: center;
      padding-top: 10px;
      border-top: 1px solid #9e9e9e;
      .logout {
        cursor: pointer;
        &:hover {
          transition: all .3s;
          color: red;
        }
      }
    }
  }


</style>

