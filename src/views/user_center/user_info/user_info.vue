<template>
  <div class="app-container calendar-list-container">
    <el-form  ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 60%;margin-left:20%;'>
      <pan-thumb style="display: block;margin: 20px auto" :image="temp.head_img" @update="show = true"></pan-thumb>
      <my-upload field="image"
                 @crop-success="cropSuccess"
                 @crop-upload-success="cropUploadSuccess"
                 @crop-upload-fail="cropUploadFail"
                 v-model="show"
                 :width="300"
                 :height="300"
                 :url="uploadBaseUrl"
                 :params="params"
                 :headers="headers"
                 img-format="png"></my-upload>
      <el-form-item label="用户名:" prop="nickname">
        <el-input v-model="temp.nickname" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <el-input v-model="temp.user.phone" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="部门:" prop="group_name">
        <el-input v-model="temp.user_account_group.group_name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="temp.password">
          <template slot="append">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="changePassword">修改密码</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo } from '@/api/login'
import { updateOwnUserPassword, updateOwnUserAccount } from '@/api/user'
import waves from '@/directive/waves'
import myUpload from 'vue-image-crop-upload'
import PanThumb from '@/components/PanThumb'
// 水波纹指令

export default {
  components: { 'my-upload': myUpload, PanThumb },
  name: 'infoSetting',
  directives: {
    waves
  },
  props: {
    data: {
      type: String
    }
  },
  data() {
    return {
      scrollTop: 0,
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20,
        copyright: undefined,
        domain_name: undefined,
        ip: undefined,
        sort: '-id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showAuditor: false,
      temp: {
        id: undefined,
        nickname: '',
        user: {
          id: '',
          phone: ''
        },
        user_account_type: {
          id: undefined,
          type_name: ''
        },
        user_account_group: {
          id: undefined,
          group_name: ''
        },
        user_account_role: {
          id: undefined,
          role_name: ''
        },
        password: '',
        head_img: ''
      },
      show: false,
      params: { },
      headers: { },
      imgDataUrl: '',
      uploadBaseUrl: process.env.BASE_API + '/api/document/uploadAvatarImage'
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'gray',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusTranslator(status) {
      const statusTransMap = {
        0: '冻结',
        1: '开启',
        2: '已删除'
      }
      return statusTransMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changePassword() {
      const tempData = {}
      tempData.user_id = this.temp.user.id
      tempData.phone = this.temp.user.phone
      tempData.password = this.temp.password
      updateOwnUserPassword(tempData).then(() => {
        this.temp.password = ''
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    getList() {
      this.listLoading = true
      this.list = []
      getInfo(this.$store.state.user.token).then(response => {
        this.temp = response.data
        this.listLoading = false
      })
    },
    toggleShow() {
      this.show = !this.show
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
      this.imgDataUrl = imgDataUrl
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      console.log(jsonData)
      console.log('field: ' + field)
      if (jsonData.code === 200) {
        const tempData = {}
        tempData.head_img = jsonData.data.url
        tempData.user_account_id = this.temp.id
        updateOwnUserAccount(tempData).then(response => {
          this.temp.head_img = response.data.head_img
        })
      } else {
        this.$message({
          type: 'error',
          message: '头像上传失败'
        })
      }
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  },
  deactivated() {
    this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  },
  activated() {
    window.scrollTo(0, this.scrollTop)
  }
}
</script>
