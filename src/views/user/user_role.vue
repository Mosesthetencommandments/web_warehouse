<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="角色名称" v-model="listQuery.role_name">
      </el-input>
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :stripe="true" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="角色名">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.role_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="Code">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.role_code}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changeStatus($event, scope.row)"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleRoleAuth(scope.row)">权限管理</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 90%; margin-left:5%;'>
        <el-form-item label="角色名" prop="role_name">
          <el-input v-model="temp.role_name"></el-input>
        </el-form-item>
        <el-form-item label="code" prop="role_code">
          <el-input v-model="temp.role_code"></el-input>
        </el-form-item>
        <el-form-item label="屏蔽">
          <el-select v-model="temp.default_params">
            <el-option v-for="item in dafaulrOptions" :id="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogAuthTitle + '--权限设置'" :visible.sync="dialogAuthVisible" width="30%">
      <div class="tree_iconBox">
        <el-tree
          :data="data"
          size="font-size: 25px;"
          :props="defaultProps"
          ref="tree"
          show-checkbox
          node-key="idd"
          :default-expand-all="false"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAuthList">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getUserAccountRoleList, createUserAccountRole, updateUserAccountRole, deleteUserAccountRole } from '@/api/user_role'
  import { editUserAccountRolePermission, getPermissionByMenu, getAccountRolePermission } from '@/api/auth'
  import waves from '@/directive/waves'// 水波纹指令

  export default {
    name: 'rolesManagement',
    directives: {
      waves
    },
    data() {
      return {
        scrollTop: 0,
        tableKey: 0,
        list: null,
        total: null,
        data: [],
        relationID: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          page_size: 20,
          role_name: undefined,
          role_code: undefined,
          sort: '-id'
        },
        dafaulrOptions: [
          {
            value:'own',
            label:'只看自己'
          },
          {
            value:'grounp',
            label:'只看本组'
          },
          {
            value:'grounp_deliver',
            label:'看本组和子组'
          }
        ],
        defaultProps: {
          children: 'children',
          label: (data, node) => {
            return data.menu_name ? data.menu_name : data.permission_name
          }
        },
        checkedList: [],
        checkList: [],
        checkedId: [],
        dialogAuthVisible: false,
        dialogAuthTitle: undefined,
        importanceOptions: [1, 2, 3],
        sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showAuditor: false,
        temp: {
          id: undefined,
          role_name: undefined,
          role_code: undefined,
          default_params: undefined
        },
        tempData: {
          user_account_role_id: undefined,
          relation_list: []
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        authList: [],
        active: '',
        rules: {
          role_name: [{ required: true, message: '填写角色名', trigger: 'change' }],
          role_code: [{ required: true, message: '填写角色代码', trigger: 'change' }]
        }
      }
    },
    watch: {
      dialogAuthVisible(val) {
        if (val === false) {
          this.active = ''
          this.$refs.tree.setCheckedKeys([])
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      changeStatus(e, row) {
        const parm = {
          user_account_role_id: row.id,
          status: e
        }
        updateUserAccountRole(parm).then(() => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          row.status = e === 1 ? 0 : 1
        })
      },
      traverseTree(node) {
        if (!node) {
          return
        }
        this.traverseNode(node)
        if (node.children && node.children.length > 0) {
          var i = 0
          for (i = 0; i < node.children.length; i++) {
            this.traverseTree(node.children[i])
          }
        }
      },
      traverseNode(data) {
        if (data.permission_name) {
          data['idd'] = data['id']
          delete data['id']
        }
      },
      getList() {
        this.listLoading = true
        getUserAccountRoleList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          role_name: undefined,
          role_code: undefined,
          default_params: undefined
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createUserAccountRole(this.temp).then(response => {
              this.temp = response.data
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.total++
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.user_account_role_id = this.temp.id
            updateUserAccountRole(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      authority() {
        getPermissionByMenu().then(res => {
          for (const v of res.data) {
            this.traverseTree(v)
          }
          this.data = res.data
        })
      },
      handleRoleAuth(row) {
        this.authority()
        this.dialogAuthTitle = row.role_name
        this.dialogAuthVisible = true
        this.tempData.user_account_role_id = row.id
        const temp = {}
        temp.user_account_role_id = row.id
        getAccountRolePermission(temp).then(res => {
          console.log(res,11111)
          const temparr1 = []
          for (const v of res.data.user_permission) {
            temparr1.push(v.id)
          }
          this.$refs.tree.setCheckedKeys(temparr1)
        })
      },
      updateAuthList() {
        const keyArry = this.$refs.tree.getCheckedKeys()
        for (let v = 0; v < keyArry.length; v++) {
          if (keyArry[v] === undefined) {
            keyArry.splice(v, 1)
            v--
          }
        }
        this.tempData.permission_list = keyArry
        editUserAccountRolePermission(this.tempData).then(res => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.dialogAuthVisible = false
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ttempData = {
            user_account_role_id: row.id
          }
          deleteUserAccountRole(ttempData).then(response => {
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
    },
    deactivated() {
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    },
    activated() {
      this.getList()
      this.authority()
      window.scrollTo(0, this.scrollTop)
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
