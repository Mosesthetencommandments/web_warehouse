<template>
  <div class="app-container calendar-list-container">

    <el-card style="width: 60%">
      <template slot="header">
        <el-button type="primary"
                   @click="append(' ')" >
          创建根目录
        </el-button>
      </template>
    <el-tree
      :data="data"
      :props="defaultProps"
      node-key="id"
      @node-drop="handleDrop"
      draggable
      :default-expand-all="false"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span style="position: absolute;right: 0;top: 0;">
           <el-button
             type="text"
             size="mini"
             style="font-size: 12px;text-align: right;"
             @click="() => exit(node, data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            style="font-size: 12px;text-align: right;"
            @click="() => append(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            style="font-size: 12px;text-align: right;"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="innerDataForm1" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="菜单名称" prop="auth_name">
          <el-input v-model="temp.menu_name"></el-input>
        </el-form-item>
        <el-form-item label="菜单编码" prop="auth_code">
          <el-input v-model="temp.menu_code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData(currentData)">确 定</el-button>
        <el-button v-else type="primary" @click="updataData(currentData)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getUserMenu, createUserMenu, updateUserMenu, deleteUserMenu } from '@/api/auth'
  export default {
    name: '',
    data() {
      return {
        listLoading: true,
        dialogFormVisible: false,
        currentData: {},
        data: [],
        menunode: undefined,
        temp: {
          menu_name: undefined,
          menu_code: undefined
        },
        defaultProps: {
          children: 'children',
          label: 'menu_name'
        },
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dragtemp: {
          pid: undefined,
          user_menu_id: undefined
        },
        draggingNodelist: []
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      getMenuList() {
        this.listLoading = true
        getUserMenu().then(response => {
          this.data = response.data
          this.listLoading = false
        })
      },
      append(data) {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.currentData = data
      },
      exit(node, data) {
        this.menunode = node
        this.temp = {
          menu_name: data.menu_name,
          menu_code: data.menu_code
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.currentData = data
      },
      updataData(data) {
        const tempData = this.temp
        tempData.user_menu_id = data.id
        updateUserMenu(tempData).then(response => {
          const parent = this.menunode.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children[index].menu_name = tempData.menu_name
          children[index].menu_code = tempData.menu_code
          this.dialogFormVisible = false
        })
      },
      remove(node, data) {
        this.$confirm('此操作将永久删除该域名, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tempData = {
            user_menu_id: data.id
          }
          deleteUserMenu(tempData).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      resetTemp() {
        this.temp = {
          menu_name: undefined,
          menu_code: undefined
        }
      },
      createData(data) {
        if (data === ' ') {
          this.temp.pid = 0
        } else {
          this.temp.pid = data.id
        }
        createUserMenu(this.temp).then(response => {
          const newChild = { id: response.data.id, menu_name: this.temp.menu_name, menu_code: this.temp.menu_code, children: [] }
          if (data === ' ') {
            this.data.push(newChild)
            this.dialogFormVisible = false
          } else {
            if (!data.children) {
              this.$set(data, 'children', [])
            }
            data.children.push(newChild)
            this.dialogFormVisible = false
          }
        })
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        this.dragtemp.user_menu_id = draggingNode.data.id
        if (dropType === 'inner') {
          this.dragtemp.pid = dropNode.data.id
        } else if (dropNode.data.pid === 0) {
          this.dragtemp.pid = 0
        } else {
          this.dragtemp.pid = dropNode.data.pid
        }
        updateUserMenu(this.dragtemp).then(response => {
          draggingNode.data.pid = response.data.pid
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-tree-node__content{
    position: relative;
  }
</style>
<style scoped>
  /*.el-tree >>> .el-tree-node__content:hover {*/
    /*background-color: #eee;*/
  /*}*/
  /*.el-tree >>> .el-tree-node__expand-icon {*/
    /*color: #aaa;*/
  /*}*/
  /*.el-tree-node:focus>.el-tree-node__content {*/
    /*background-color: red;*/
  /*}*/
</style>
