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
        <div class="filter-label">商品</div>
        <el-select  size="small" style="width:200px"
                    @change='handleFilter'
                    @focus="getWarehouseProductGoodsStorageList(' ')"
                    v-model="listQuery.product_goods_id"
                    filterable
                    clearable
                    remote
                    placeholder="选择"
                    :remote-method="getWarehouseProductGoodsStorageList"
                    :loading="productLoading">
          <el-option  v-for="item in productOptions"
                      :key="item.id"
                      :label="item.product_goods.goods_name"
                      :value="item.id">
          </el-option>
        </el-select>
      </div>

      <!--<el-select  class="filter-item"-->
                  <!--style="width:200px"-->
                  <!--@change='handleWarehouse'-->
                  <!--v-model="listQuery.warehouse_id"-->
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
          <span>{{scope.row.warehouse.warehouse_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称" min-width="150" >
        <template slot-scope="scope">
          <span>{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账面数量"  >
        <template slot-scope="scope">
          <span>{{scope.row.origin_num}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="稽查数量" >
        <template slot-scope="scope">
          <span>{{scope.row.checked_num}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="差异数量">
        <template slot-scope="scope">
          <span v-if="scope.row.origin_num > scope.row.checked_num" style="color: #f56c6c;font-size: 20px;font-weight: 600;">{{scope.row.checked_num - scope.row.origin_num}}</span>
          <span v-else style="color: #67c23a;font-size: 20px;font-weight: 600;">{{scope.row.checked_num - scope.row.origin_num}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="差异原因">
        <template slot-scope="scope">
          <span>{{scope.row.adjust_type_id | handleType}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="150" >
        <template slot-scope="scope">
          <span>{{scope.row.info}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="稽查人" min-width="150" >
        <template slot-scope="scope">
          <span>{{scope.row.operator_account_name}}</span><br/>
          <span>{{scope.row.datetime}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="操作" min-width="150" >-->
      <!--<template slot-scope="scope">-->
      <!--<el-button @click="handleUpdate" type="primary">编辑</el-button>-->
      <!--<el-button @click="handleDelete" type="danger">删除</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px" style='width: 80%; margin-left:10%;'>
        <!--<el-form-item label="仓库" prop="warehouse_id">-->
        <!--<el-select  style="width:100%"-->
        <!--v-model="temp.warehouse_id"-->
        <!--clearable-->
        <!--@change="handleFilterWarehouse"-->
        <!--placeholder="仓库">-->
        <!--<el-option  v-for="item in warehouseOptions"-->
        <!--:key="item.id"-->
        <!--:label="item.name"-->
        <!--:value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="选择商品" prop="product_goods_storage_id">
          <el-select v-model="temp.product_goods_storage_id"
                     style="width: 100%"
                     @change="temp.origin_num = productOptions2.find( d => d.id === temp.product_goods_storage_id).stock;
                                temp.checked_num = productOptions2.find( d => d.id === temp.product_goods_storage_id).stock;"
                     filterable
                     clearable
                     remote
                     placeholder="请选择商品"
                     :remote-method="getProductList2"
                     :loading="productLoading2">
            <el-option  v-for="item in productOptions2"
                        :key="item.id"
                        :label="item.product_goods.goods_name"
                        :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账面数量" prop="origin_num">
          <div style="text-align: center">{{temp.origin_num}}</div>
        </el-form-item>
        <el-form-item label="稽查数量" prop="checked_num">
          <el-input-number v-model.number="temp.checked_num" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="差异原因" prop="adjust_type_id">
          <el-select v-model="temp.adjust_type_id"
                     style="width: 100%"
                     placeholder="原因">
            <el-option v-for="item in causeOptions"
                       :label="item.label"
                       :key="item.id"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="info">
          <el-input v-model="temp.info"
                    style="width: 100%"
                    type="textarea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="createData">确 定</el-button>
        <!--<el-button v-else type="primary" @click="updateData">确 定</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import { getWarehouseProductGoodsStorageList } from '@/api/warehouse'
  import { getWarehouseList} from '@/api/product'
  import { getProductStorageAdjustList } from '@/api/product'
  import { createProductStorageAdjust } from '@/api/product'
  export default {
    components: { },
    name: 'inventoryManagement',
    directives: {
      waves
    },
    data() {
      const validate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入数量'))
        } else if (typeof value !== 'number') {
          callback(new Error('输入数字'))
        } else if (/[^\w]/g.test(value + '')) {
          callback(new Error('输入正整数'))
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
        textMap: {
          update: '编辑',
          create: '创建'
        },
        warehouseLoading: false,
        warehouseOptions: [],
        dialogStatus: undefined,
        dialogFormVisible: false,
        productOptions: [],
        productOptions2: [],
        productLoading: false,
        productLoading2: false,
        listQuery: {
          product_id: undefined,
          warehouse_id: undefined,
          date_range: '',
          page: 1,
          page_size: 20,
          sort: '-id'
        },
        stateOptions: [
          { id: 0, label: '有效操作' },
          { id: 1, label: '无效操作' }
        ],
        causeOptions: [
          { id: 0, label: '系统原因' },
          { id: 1, label: '发货错误' }
        ],
        temp: {
          warehouse_id: undefined,
          product_goods_storage_id: undefined,
          origin_num: undefined,
          checked_num: undefined,
          adjust_type_id: undefined,
          info: undefined
        },
        rules: {
          warehouse_id: [{ required: true, message: '选择仓库', trigger: 'change' }],
          product_goods_storage_id: [{ required: true, message: '选择商品', trigger: 'change' }],
          checked_num: [
            { validator: validate, trigger: 'change' }
          ],
          adjust_type_id: [{ required: true, message: '必选差异原因', trigger: 'change' }],
          info: [{ required: true, message: '备注', trigger: 'change' }]
        },
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
    methods: {
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleFilterWarehouse() {
        this.temp.product_goods_storage_id = undefined
        this.productOptions2 = []
        this.origin_num = undefined
        this.checked_num = undefined
      },
      handleWarehouse() {
        this.listQuery.product_goods_id = undefined
        this.productOptions = []
        this.handleFilter()
      },
      getList() {
        this.listLoading = true
        getProductStorageAdjustList(this.listQuery).then(response => {
          this.list = response.data.data
          this.listLoading = false
          this.total = response.data.total
        })
      },
      getWarehouseList() {
        getWarehouseList().then(response => {
          this.warehouseOptions = response.data.data
        })
      },
      getWarehouseProductGoodsStorageList(query) {
        // if (! this.listQuery.warehouse_id) {
        //   this.$message.error('先选择仓库')
        //   return false
        // }
        if (query !== '') {
          this.productLoading = true
          getWarehouseProductGoodsStorageList({ warehouse_id: this.listQuery.warehouse_id, goods_name: query }).then(response => {
            this.productOptions = response.data.data
            this.productLoading = false
          })
        }
      },
      getProductList2(query) {
        // if (! this.temp.warehouse_id) {
        //   this.$message.error('先选择仓库')
        //   return false
        // }
        if (query !== '') {
          this.productLoading2 = true
          getWarehouseProductGoodsStorageList({ warehouse_id: this.temp.warehouse_id, goods_name: query }).then(response => {
            this.productOptions2 = response.data.data
            this.productLoading2 = false
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
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createProductStorageAdjust(this.temp).then(res => {
              this.getList()
            })
            this.dialogFormVisible = false
          }
        })
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
    },
    watch: {
      dialogFormVisible(val) {
        if (!val) {
          this.$refs['dataForm'].resetFields()
          this.productOptions2 = []
          this.temp = {
            warehouse_id: undefined,
            product_goods_storage_id: undefined,
            origin_num: undefined,
            checked_num: undefined,
            adjust_type_id: undefined,
            info: undefined
          }
        }
      }
    },
    filters: {
      handleType(status) {
        const statusMap = {
          '0': '系统原因',
          '1': '发货错误'
        }
        return statusMap[status]
      },
      handleTypeClass(status) {
        const statusMap = {
          '0': 'success',
          '1': 'primary'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
      this.getWarehouseList()
    }
  }
</script>
