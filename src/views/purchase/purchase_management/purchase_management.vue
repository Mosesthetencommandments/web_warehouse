<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="filter-item">
        <div class="filter-label">日期</div>
        <el-date-picker size="small"
                        v-model="listQuery.date_range"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        align="right"
                        unlink-panels
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @change='handleFilter'>
        </el-date-picker>
      </div>
      <div class="filter-item">
        <div class="filter-label">日期</div>
        <el-select  size="small"
                    style="width:100px;"
                    @change='handleFilter'
                    v-model="listQuery.status"
                    clearable
                    placeholder="状态">
          <el-option  v-for="item in purchaseOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
          </el-option>
        </el-select>
      </div>
      <!--<el-select class="filter-item"-->
                 <!--v-model="listQuery.warehouse_id"-->
                 <!--filterable-->
                 <!--@change="handleFilter"-->
                 <!--clearable-->
                 <!--placeholder="仓库">-->
        <!--<el-option  v-for="item in warehouseOptions"-->
                    <!--:key="item.id"-->
                    <!--:label="item.name"-->
                    <!--:value="item.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <div class="filter-float">
        <el-button class="filter-item" size="small" @click="handleFilter" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" size="small" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      </div>
    </div>

    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border
              fit
              highlight-current-row
              style="width: 100%"
              stripe>
      <el-table-column align="center" label="仓库" min-width="150" >
        <template slot-scope="scope">
          <span>{{scope.row.warehouse_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品" min-width="150" >
        <template slot-scope="scope">
          <span>{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" min-width="100" >
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="到货状态" min-width="100" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | handleTypeClass">{{scope.row.status | handleType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预定时间" min-width="170" >
        <template slot-scope="scope">
          <span>{{scope.row.deliver_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" min-width="160" >
        <template slot-scope="scope">
          <span>{{scope.row.operator_account_name}}</span><br>
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" >
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)" type="primary">编辑</el-button>
          <el-button size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px" style='width: 80%; margin-left:10%;'>
        <el-form-item label="仓库" prop="warehouse_id">
          <el-select v-model="temp.warehouse_id"
                     @change="resetProductGoods"
            filterable
            v-if="dialogStatus == 'create'"
            clearable
            placeholder="仓库">
          <el-option  v-for="item in warehouseOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
          </el-select>
        <span v-else>{{temp.warehouse_name}}</span>
        </el-form-item>
        <el-form-item label="商品" prop="product_goods_id">
          <el-select v-model="temp.product_goods_id"
                     style="width: 100%"
                     @focus="getProductGoodsCommonBaseList(' ')"
                     filterable
                     v-if="dialogStatus == 'create'"
                     clearable
                     remote
                     placeholder="选择商品"
                     :remote-method="getProductGoodsCommonBaseList"
                     :loading="commonBaseLoading">
            <el-option  v-for="item in commonBaseOptions"
                        :key="item.id"
                        :label="item.goods_name"
                        :value="item.id">
            </el-option>
          </el-select>
          <span v-else>{{temp.goods_name}}</span>
        </el-form-item>
        <el-form-item label="商品数量" prop="number">
          <el-input-number v-model.number="temp.number" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status"
                     style="width: 100%"
                     remote
                     placeholder="状态">
            <el-option  v-for="item in purchaseOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import { getProductStorageOrderList } from '@/api/product'
  import { getProductGoodsList } from '@/api/product_goods'
  import { getWarehouseList} from '@/api/product'
  import { createProductStorageOrder } from '@/api/product'
  import { updateProductStorageOrder } from '@/api/product'
  import { deleteProductStorageOrder } from '@/api/product'
  import { parseTime } from '@/utils/index'

  export default {
    components: { },
    name: 'purchaseItemManagement',
    directives: {
      waves
    },
    data() {
      const validate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入数量'))
        } else if (typeof value !== 'number') {
          callback(new Error('输入数字'))
        } else if (value < 0) {
          callback(new Error('大于0'))
        } else if (/[^\w]/g.test(value + '')) {
          callback(new Error('输入整数!'))
        } else {
          callback()
        }
      }
      return {
        tableKey: 0,
        scrollTop: 0,
        list: null,
        total: null,
        listLoading: false,
        dialogStatus: '',
        dialogFormVisible: false,
        purchaseOptions: [
          { id: 0, label: '全部到货' },
          { id: 1, label: '部分到货' },
          { id: 2, label: '未到货' }
        ],
        productOptions: [],
        productLoading: false,
        commonBaseLoading: false,
        commonBaseOptions: [],
        importGoodsLoading: false,
        importGoodsOptions: [],
        listQuery: {
          status: undefined,
          // warehouse_id: undefined,
          date_range: [
            parseTime(new Date(new Date().getTime() - 1000 * 3600 * 24 * 7), '{y}-{m}-{d}'),
            parseTime(new Date(), '{y}-{m}-{d}')],
          page: 1,
          page_size: 20,
          sort: '-id'
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        temp: {
          product_storage_order_id: undefined,
          product_goods_id: undefined,
          warehouse_id: undefined,
          number: undefined,
          status: undefined
        },
        rules: {
          product_goods_id: [{ required: true, message: '选择商品', trigger: 'change' }],
          // warehouse_id: [{ required: true, message: '选择仓库', trigger: 'change' }],
          number: [
            { validator: validate, trigger: 'change' }
          ],
          status: [{ required: true, message: '选择状态', trigger: 'change' }]
        },
        warehouseOptions: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    filters: {
      handleType(status) {
        const statusMap = {
          '0': '全部到货',
          '1': '部分到货',
          '2': '未到货'
        }
        return statusMap[status]
      },
      handleTypeClass(status) {
        const statusMap = {
          '0': 'success',
          '1': 'warning',
          '2': 'primary'
        }
        return statusMap[status]
      }
    },
    watch: {
      dialogFormVisible(val) {
        if (!val) {
          this.$refs['dataForm'].resetFields()
          this.resetTemp()
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      resetTemp() {
        this.temp = {
          product_storage_order_id: undefined,
          product_goods_id: undefined,
          warehouse_id: undefined,
          number: undefined,
          status: undefined
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        getProductStorageOrderList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
          this.listLoading = false
        })
      },
      getWarehouseList() {
        getWarehouseList().then(response => {
          this.warehouseOptions = response.data.data
        })
      },
      resetProductGoods() {
        this.commonBaseOptions = []
        this.temp.product_goods_id = undefined
      },
      getProductGoodsCommonBaseList(query) {
        if (query !== '') {
          this.commonBaseLoading = true
          getProductGoodsList({ goods_name: query, warehouse_id: this.temp.warehouse_id }).then(response => {
            this.commonBaseOptions = response.data.data
            this.commonBaseLoading = false
          })
        }
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      getProductList(query) {
        if (query !== '') {
          this.productLoading = true
          getProductGoodsList({ goods_name: query, status: 1 }).then(response => {
            this.productOptions = response.data.data
            this.productLoading = false
          })
        }
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createProductStorageOrder(this.temp).then(() => {
              this.getList()
              this.dialogFormVisible = false
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateProductStorageOrder(this.temp).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.temp = Object.assign({}, row)
        this.temp.product_storage_order_id = row.id
        this.temp.product_commonBase_id = 0
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const parms = {
            product_storage_order_id: row.id
          }
          deleteProductStorageOrder(parms).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    created() {
      this.getList()
      this.getWarehouseList()
    }
  }
</script>



