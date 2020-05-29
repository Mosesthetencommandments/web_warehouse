<template>
  <div class="app-container calendar-list-container">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClickTab">
      <el-tab-pane label="重要通知" name="importantNotifications">
        <el-table :stripe="true" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
          <el-table-column align="center" label="序号" width="65">
            <template slot-scope="scope">
              <span class="link-type">
                {{scope.row.id}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发送人" width="150">
            <template slot-scope="scope">
              <span class="link-type">
                {{scope.row.sender.nickname}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="标题" min-width="200">
            <template slot-scope="scope">
              <span class="link-type" @click="handleClick(scope.row)">
                {{scope.row.title}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="时间" wimin-width="150">
            <template slot-scope="scope">
              <span class="link-type">
                {{scope.row.created_at}}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="50" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | readStatusFilter">{{scope.row.status|readStatusTranslator}}</el-tag>
              <!--<el-tag v-if="scope.row.cash_date" :type="'success'">{{scope.row.cash_date}}</el-tag>-->
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                         :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="系统消息" name="systemMessage">
        <el-table :stripe="true" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
          <el-table-column align="center" label="序号" width="65">
            <template slot-scope="scope">
              <span class="link-type">
                {{scope.row.id}}
              </span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="发送人" width="150">
            <template slot-scope="scope">
              <span class="link-type">
                {{scope.row.sender.nickname}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="标题" min-width="200">
            <template slot-scope="scope">
              <span class="link-type" @click="handleClick(scope.row)">
                {{scope.row.title}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="时间" wimin-width="150">
            <template slot-scope="scope">
              <span class="link-type">
                {{scope.row.created_at}}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="50" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | readStatusFilter">{{scope.row.status|readStatusTranslator}}</el-tag>
              <!--<el-tag v-if="scope.row.cash_date" :type="'success'">{{scope.row.cash_date}}</el-tag>-->
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                         :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog custom-class="message_dialog" :visible.sync="dialogTableVisible">
      <p>{{temp.content}}</p>
      <div slot="footer" class="dialog-footer location">
        <el-button @click="closeMessageDialog" >已阅读</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getNoticeList, readNotice } from '@/api/user'
  import waves from '@/directive/waves'
  // 水波纹指令
  export default {
    components: { },
    name: 'messageNotification',
    directives: {
      waves
    },
    data() {
      return {
        scrollTop: 0,
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        activeName: 'importantNotifications',
        systemMessageSelect: false,
        listQuery: {
          type_code: '',
          page: 1,
          page_size: 20
        },
        temp: {
          content: ''
        },
        messageTitle: '',
        content: '',
        dialogTableVisible: false
      }
    },
    filters: {
      readStatusFilter(status) {
        const statusMap = {
          0: 'info',
          1: 'success'
        }
        return statusMap[status]
      },
      readStatusTranslator(status) {
        const statusMap = {
          0: '未读',
          1: '已读'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getNoticeList()
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getNoticeList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getNoticeList()
      },
      handleClickTab(tab, event) {
        if (tab.name === 'systemMessage') {
          this.systemMessageSelect = true
        } else {
          this.systemMessageSelect = false
        }
        this.handleFilter()
      },
      handleFilter() {
        // if (this.activeName === 'importantNotifications') {
        //   this.getNoticeList()
        // } else if (this.activeName === 'systemMessage') {
        //   this.getSystemMessageList()
        // }
        this.getNoticeList()
      },
      getNoticeList() {
        this.listLoading = true
        if (this.activeName === 'importantNotifications') {
          this.listQuery.type_code = 'important_notice'
          getNoticeList(this.listQuery).then(response => {
            this.list = response.data.data
            this.total = response.data.total
            this.listLoading = false
          })
        } else if (this.activeName === 'systemMessage') {
          this.listQuery.type_code = 'system_notice'
          getNoticeList(this.listQuery).then(response => {
            this.list = response.data.data
            this.total = response.data.total
            this.listLoading = false
          })
        }
      },
      // getSystemMessageList() {
      //   this.listLoading = true
      //   getNoticeList({ type_code: 'important_notice' }).then(response => {
      //     this.list = response.data.data
      //     this.total = response.data.total
      //     this.listLoading = false
      //   })
      // },
      handleClick(row) {
        this.dialogTableVisible = true
        this.temp = Object.assign({}, row)
        // alert(JSON.stringify(this.temp))
      },
      closeMessageDialog() {
        this.dialogTableVisible = false
        readNotice({ notice_id: this.temp.id }).then(response => {
          if (this.temp.status === 0) {
            this.$store.state.user.important_notice--
          }
          this.temp.status = 1
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.$notify({
            title: '已阅读',
            message: '已阅读',
            type: 'success',
            duration: 2000
          })
        })
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

<style>
  .message_dialog {
    height: 500px !important;
    background: url('../../../../static/fe08c19c13127d29fe3d56a8d937b759.jpg') no-repeat;
    background-size: 100% 100%;
    padding: 100px;
  }
  .location {
    padding: 50px;
  }
</style>
