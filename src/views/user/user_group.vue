<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--<el-select @change='handleFilter' style="width: 200px" class="filter-item" v-model="listQuery.user_account_department_id" clearable placeholder="部门">-->
        <!--<el-option v-for="item in userDepaerOptions" :key="item.key" :label="item.label" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="组名称" v-model="listQuery.group_name">
      </el-input>
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加小组</el-button>
    </div>

    <el-table :stripe="true" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="用户组名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.group_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="用户组类型">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.user_account_type.type_name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="320" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 90%;margin-left: 5%'>
        <el-form-item label="小组名称" prop="group_name">
          <el-input style="width: 200px" v-model="temp.group_name"></el-input>
        </el-form-item>
        <el-form-item label="小组关系" v-if="dialogStatus == 'create'">
          <span style="color: red;line-height: 20px">
            选择父级小组,不选择将视为根级小组
          </span>
          <el-tree :data="userAccountGroupTree"
                   ref="tree"
                   style="border: 1px solid #e4e4e4"
                   show-checkbox
                   check-strictly
                   node-key="id"
                   :props="defaultProps"
                   @check="handlecheck"></el-tree>
        </el-form-item>
        <!--<el-form-item label="分成归属" prop="pay_for_user_account_id">-->
          <!--<el-select filterable-->
                     <!--clearable-->
                     <!--remote-->
                     <!--placeholder="搜索"-->
                     <!--:remote-method="getUserAccountList"-->
                     <!--:loading="payLoading"-->
                     <!--v-model="temp.pay_for_user_account_id">-->
            <!--<el-option v-for="item in payOptions" :label="item.nickname" :key="item.id" :value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserAccountGroupList, getUserAccountGroupTree, createUserAccountGroup, updateUserAccountGroup, deleteUserAccountGroup } from '@/api/user_group'
import { getUserAccountDepartmentList } from '@/api/user_department'
import { getSupportMemberList } from '@/api/support_member'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'userGroupManagement',
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
      listQuery: {
        page: 1,
        page_size: 20,
        user_account_department_id: undefined,
        group_name: undefined,
        sort: '-id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showAuditor: false,
      temp: {
        id: undefined,
        group_name: '',
        pid: undefined
      },
      defaultProps: {
        children: 'child',
        label: 'group_name'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        group_name: [{ required: true, message: '填写小组名称', trigger: 'change' }]
      },
      userAccountGroupTree: [],
      payOptions: [],
      userDepaerOptions: [],
      payLoading: false,
      typeDisable: false,
      groupBackground: 'danger'
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
    this.getUserAccountGroupTree()
  },
  deactivated() {
    this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  },
  activated() {
    this.getList()
    this.getUserAccountGroupTree()
    window.scrollTo(0, this.scrollTop)
  },
  methods: {
    handlecheck(obj) {
      const checked = this.$refs.tree.getCheckedKeys()
      if (checked.length === 1) {
        this.$refs.tree.setCheckedKeys([obj.id])
        this.temp.pid = obj.id
      } else if (checked.length === 0) {
        this.$refs.tree.setCheckedKeys([])
        this.temp.pid = undefined
      } else {
        this.$refs.tree.setCheckedKeys([obj.id])
        this.temp.pid = obj.id
      }
    },
    getUserAccountGroupTree() {
      getUserAccountGroupTree().then(res=> {
        this.userAccountGroupTree = res.data
      })
    },
    getUserAccountList(query) {
      if (query !== '') {
        this.payLoading = true
        getSupportMemberList({ nickname: query, status: 1 }).then(response => {
          this.payOptions = response.data.data.map(v => ({
            id: v.id,
            nickname: v.nickname
          }))
          this.payLoading = false
        })
      }
    },
    getList() {
      this.listLoading = true
      getUserAccountGroupList(this.listQuery).then(response => {
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
        group_name: '',
        pid: undefined,
      }
    },
    handleCreate() {
      this.getUserAccountGroupTree()
      this.resetTemp()
      this.typeDisable = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUserAccountGroup(this.temp).then(response => {
            this.getList()
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
      this.payOptions = []
      if (row.pay_to_user_account !== null && row.pay_to_user_account !== 0) {
        this.payOptions = [row.pay_to_user_account]
      }
      this.temp = Object.assign({}, row) // copy obj
      this.typeDisable = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {}
          tempData.group_name = this.temp.group_name
          tempData.user_account_group_id = this.temp.id
          tempData.user_account_department_id = this.temp.user_account_department_id
          tempData.user_account_type_id = this.temp.user_account_type.id
          updateUserAccountGroup(tempData).then(() => {
            this.getList()
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
    handleDelete(row) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ttempData = {
          user_account_group_id: row.id
        }
        deleteUserAccountGroup(ttempData).then(response => {
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
