<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 350px;" clearable class="filter-item" placeholder="操作名称" v-model="listQuery.permission_name">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 350px;" clearable class="filter-item" placeholder="菜单搜索" v-model="listQuery.menu_name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" >创建权限组</el-button>
    </div>
    <el-table :stripe="true"
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
      <el-table-column min-width="70px" align="center" label="操作名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.permission_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="路径">
        <template slot-scope="scope">
          <span >{{scope.row.menu_path}}</span>
        </template>
      </el-table-column>
      <el-table-column width="130px" align="center" label="菜单名称">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.user_menu.menu_name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="接口名称 / 权限等级">
        <template slot-scope="scope">
          <div v-for="item in scope.row.user_account_auth">
            <el-tag type="primary" v-if="scope.row.user_account_auth.length !== 0">{{item.auth_name}}</el-tag>
            <el-tag :type="item.auth_grade | statusGradeColor">{{item.auth_grade | statusGradeText}}</el-tag>
            <br>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleAddAuth(scope.row)">编辑API</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleInnerSizeChange1" @current-change="handleInnerCurrentChange1" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,50, 100]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
      :title="dialogTitle[dialogStatus]"
      :visible.sync="dialogFormVisible" width="70%" >
      <el-form :rules="rules" ref="innerDataForm" :model="temp1" label-position="left" label-width="100px" style='width: 100%;'>
        <el-form-item label="权限名称" prop="auth_name">
          <el-select
            v-model="temp1.id"
            multiple
            filterable
            remote
            style="width: 100%"
            placeholder="请选择api"
            :remote-method="getAllAuth"
            :loading="allAuthLoading"
          >
            <el-option
              v-for="item in allAuthOptions"
              :key="item.id"
              :label="item.auth_name"
              :value="item.id">
              <el-tag class="select_tag" :type="item.auth_grade | statusGradeColor">{{item.auth_grade | statusGradeText}}</el-tag>
              <span >{{ item.auth_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;margin-right: 20px">{{ item.auth_code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="CreateAuth">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle[dialogStatus]" :visible.sync="dialogAuthVisible">
      <el-form :rules="rules2" ref="innerDataForm2" :model="temp" label-position="left" label-width="100px" style='width: 80%; margin-left:10%;'>
        <el-form-item label="权限组名称" prop="permission_name">
          <el-input v-model="temp.permission_name"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuArry">
          <el-cascader
            change-on-select
            :options="data"
            v-model="temp.menuArry"
            @active-item-change="handleItemChange"
            :props="props"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"  type="primary" @click="CreateAuthManager">确 定</el-button>
        <el-button v-else type="primary" @click="updataAuthManager">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import { editUserPermissionAuth, deleteUserPermission, getPermissionList, getAllAuthList, getUserMenu, createUserPermission, updateUserPermission } from '@/api/auth'
  export default {
    name: 'AuthSetting',
    data() {
      const validateAuth = (rule, value, callback) => {
        const myreg = /^[a-zA-Z]*\/[a-zA-Z]*\/[a-zA-Z]*$/
        if (!myreg.test(this.temp.auth_code)) {
          callback(new Error('请输入权限'))
        } else {
          callback()
        }
      }
      return {
        list: [],
        data: [],
        menuArry: [],
        total: null,
        tempid: undefined,
        listQuery: {
          page: 1,
          page_size: 20,
          sort: '-created_at',
          permission_name: undefined,
          menu_name: undefined
        },
        allAuthOptions: [],
        i: 0,
        allAuthLoading: false,
        listLoading: false,
        dialogAuthGroupVisible: false,
        dialogFormVisible: false,
        dialogAuthVisible: false,
        tableKey: 0,
        dialogStatus: '',
        dialogTitle: {
          update: '编辑',
          create: '创建'
        },
        defaultProps: {
          children: 'children',
          label: 'menu_name'
        },
        props: {
          value: 'id',
          label: 'menu_name',
          children: 'children'
        },
        temp1: {
          id: [],
          auth_name: undefined,
          auth_code: undefined
        },
        temp: {
          id: undefined,
          user_menu_id: undefined,
          permission_name: undefined,
          menuArry: undefined
        },
        tempData: {
          user_account_auth_id: undefined,
          menu_list: []
        },
        rules: {
          auth_code: [{ required: true, trigger: 'blur', validator: validateAuth }]
        },
        rules2: {
          permission_name: [{ required: true, trigger: 'change', message: '必填' }]
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
      this.getMenuList()
      this.getList()
    },
    methods: {
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
      getMenuList() {
        getUserMenu().then(response => {
          this.data = response.data
        })
      },
      getList() {
        this.listLoading = true
        getPermissionList(this.listQuery).then(response => {
          this.total = response.data.total
          this.list = response.data.data
          this.listLoading = false
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          user_menu_id: undefined,
          permission_name: undefined,
          menuArry: undefined
        }
      },
      handleCreate() {
        this.resetTemp()
        this.menuArry = []
        this.dialogStatus = 'create'
        this.dialogAuthVisible = true
        this.$nextTick(() => {
          this.$refs['innerDataForm2'].clearValidate()
        })
      },
      CreateAuth() {
        const tempData = {
          permission_id: this.tempid,
          auth_list: this.temp1.id
        }
        editUserPermissionAuth(tempData).then(response => {
          for (const v in this.list) {
            if (this.list[v].id === this.temp.id) {
              this.list[v].user_account_auth = response.data.user_account_auth
            }
          }
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row)
        this.temp.menuArry = row.menu_root
        this.dialogStatus = 'update'
        this.dialogAuthVisible = true
        this.$nextTick(() => {
          this.$refs['innerDataForm2'].clearValidate()
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该权限组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUserPermission({ permission_id: row.id }).then(response => {
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
      },
      CreateAuthManager() {
        this.$refs['innerDataForm2'].validate((valid) => {
          if (valid) {
            this.temp.user_menu_id = this.temp.menuArry[this.temp.menuArry.length - 1]
            createUserPermission(this.temp).then(response => {
              this.dialogAuthVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      updataAuthManager() {
        this.$refs['innerDataForm2'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.user_menu_id = this.temp.menuArry[this.temp.menuArry.length - 1]
            tempData.permission_id = this.temp.id
            updateUserPermission(tempData).then(response => {
              this.getList()
              this.dialogAuthVisible = false
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
      getAllAuth(query) {
        if (query !== '') {
          this.allAuthLoading = true
          getAllAuthList({ auth_code: query, page_size: 0 }).then(response => {
            this.allAuthOptions = response.data
            this.allAuthLoading = false
          })
        }
      },
      handleAddAuth(row) {
        console.log(row)
        this.tempid = row.id
        this.allAuthOptions = []
        this.temp1.id = []
        for (const v of row.user_account_auth) {
          this.allAuthOptions.push(v)
          this.temp1.id.push(v.id)
        }
        this.dialogFormVisible = true
      },
      handleItemChange(val) {
        console.log('active item:', val)
      }
    }
  }
</script>
<style scoped lang="scss">
  .select_tag {
    margin-right: 20px;
    line-height: 20px;
    height: 20px;
  }
</style>
