<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 300px;" clearable class="filter-item" placeholder="接口名称" v-model="listQuery.auth_name">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 300px;" clearable class="filter-item" placeholder="代码名称" v-model="listQuery.auth_code">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate">创建接口</el-button>
    </div>
    <el-table stripe
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border
              fit
              :key='tableKey'
              highlight-current-row
              style="width: 100%">
      <!--<el-table-column align="center" label="序号" width="180">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.id}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column min-width="70px" align="center" label="接口名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.auth_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="接口代码">
        <template slot-scope="scope">
          <span>{{scope.row.auth_code}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="50" align="center" label="权限细分">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sub_auth" type="primary">{{scope.row.sub_auth}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="50" align="center" label="权限等级">
        <template slot-scope="scope">
          <el-tag :type="scope.row.auth_grade | statusGradeColor">{{scope.row.auth_grade | statusGradeText}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleInnerSizeChange1" @current-change="handleInnerCurrentChange1" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle[dialogStatus]"
      :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="innerDataForm1" :model="temp" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>
          <el-form-item label="权限名称" prop="auth_name">
            <el-input v-model="temp.auth_name"></el-input>
          </el-form-item>
          <el-form-item label="权限API" prop="auth_code">
            <el-input v-model="temp.auth_code">
              <template slot="append">使用 / 间隔</template>
            </el-input>
          </el-form-item>
          <el-form-item label="权限细分" prop="sub_auth">
            <el-input v-model="temp.sub_auth"></el-input>
          </el-form-item>
          <el-form-item label="允许传递参数">
            <el-input v-model="temp.filter_params">
              <template slot="append">使用 , 间隔</template>
            </el-input>
          </el-form-item>
          <el-form-item label="限制参数">
            <el-input v-model="temp.default_params">
              <template slot="append">使用 , 间隔</template>
            </el-input>
          </el-form-item>
          <el-form-item label="权限等级">
            <el-select v-model="temp.auth_grade">
              <el-option v-for="item in dafaulrOptions" :id="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus === 'create'"  @click="createAuth">创 建</el-button>
        <el-button type="primary" v-if="dialogStatus === 'update'"  @click="updateAuth">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getAllAuthList, createAuth, deleteAuth, updateAuth } from '@/api/auth'
  export default {
    name: 'PortSetting',
    data() {
      const validateAuth = (rule, value, callback) => {
        const myreg = /^[a-zA-Z_]*\/[a-zA-Z_]*\/[a-zA-Z_]*$/
        if (!myreg.test(this.temp.auth_code)) {
          callback(new Error('请输入正确格式'))
        } else {
          callback()
        }
      }
      return {
        list: [],
        data: [],
        total: null,
        menuArry: [],
        listLoading: false,
        dialogFormVisible: false,
        tableKey: 0,
        dialogStatus: '',
        dialogTitle: {
          update: '编辑',
          create: '创建'
        },
        dafaulrOptions: [
          {
            value: 0,
            label:'全部数据'
          },
          {
            value:1,
            label:'本人数据'
          },
          {
            value:2,
            label:'本组数据'
          },
          {
            value:3,
            label:'本组及其子组数据'
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'menu_name'
        },
        listQuery: {
          page: 1,
          page_size: 20,
          sort: '-created_at',
          auth_code: undefined,
          auth_name: undefined
        },
        temp: {
          user_account_auth_id: undefined,
          auth_name: undefined,
          auth_code: undefined,
          auth_grade: undefined,
          sub_auth: undefined,
          filter_params: undefined,
          default_params: undefined
        },
        tempData: {
          user_account_auth_id: undefined,
          menu_list: []
        },
        rules: {
          auth_name: [{ required: true, message: '接口名称', trigger: 'change' }],
          auth_code: [{ required: true, trigger: 'blur', validator: validateAuth }]
        },
        updataData: undefined
      }
    },
    filters: {
      statusGradeColor(status) {
        const statusMap = {
          0: 'success',
          1: 'danger',
          2: 'warning',
          3: 'info',
        }
        return statusMap[status]
      },
      statusGradeText(status) {
        const statusMap = {
          0: '全部数据',
          1: '本人数据',
          2: '本组数据',
          3: '本组及子组数据',
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getAllAuthList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleInnerSizeChange1(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleInnerCurrentChange1(val) {
        this.listQuery.page = val
        this.getList()
      },
      resetTemp() {
        this.temp = {
          user_account_auth_id: undefined,
          auth_name: undefined,
          auth_code: undefined,
          sub_auth: undefined,
          filter_params: undefined,
          default_params: undefined
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['innerDataForm1'].clearValidate()
        })
      },
      createAuth() {
        this.$refs['innerDataForm1'].validate((valid) => {
          if (valid) {
            createAuth(this.temp).then(respone => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({ user_account_auth_id: row.id},row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      updateAuth() {
        this.$refs['innerDataForm1'].validate((valid) => {
          if (valid) {
            updateAuth(this.temp).then(response => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAuth({ user_account_auth_id: row.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.total--
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
