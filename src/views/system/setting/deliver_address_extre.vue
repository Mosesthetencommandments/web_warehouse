<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="filter-float">
        <el-button class="filter-item" size="small" @click="handleCreate" type="primary" icon="el-icon-edit">添加物流额外信息</el-button>
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
      <el-table-column align="center" label="ID" width="60" >
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="仓库" min-width="300">
        <template slot-scope="scope">
          <span type="primary">{{scope.row.warehouse.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="物流" min-width="300">
        <template slot-scope="scope">
          <span type="primary">{{logisticsTypeOptions.find( d => d.id == scope.row.order_logistics_type_id).name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" min-width="300">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)" type="primary">编辑</el-button>
          <!--<el-button @click="handleDelete" type="danger">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px" style='width: 80%;margin-left: 10%'>
        <el-form-item label="仓库" prop="warehouse_id">
          <el-select
            v-model="temp.warehouse_id"
            filterable
            style="width: 100%"
            clearable
            :disabled="disabled_order_logistics_type_id"
            remote
            placeholder="请选择仓库"
            :remote-method="queryWarehouseList"
            :loading="warehouseLoading">
            <el-option v-for="item in warehouseOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司" prop="order_logistics_type_id">
          <el-select
            v-model="temp.order_logistics_type_id"
            filterable
            style="width: 100%"
            clearable
            :disabled="disabled_order_logistics_type_id"
            remote
            placeholder="请选择物流公司"
            :remote-method="queryLogisticsTypeList"
            :loading="logisticsTypeLoading">
            <el-option v-for="item in logisticsTypeOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="额外信息名称" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
        <el-form-item label="发货产品名称" prop="configs.delivery_product_name">
          <el-input v-model="temp.configs.delivery_product_name"></el-input>
        </el-form-item>
        <!--顺丰配置-->
        <el-form-item v-if="temp.order_logistics_type_id === 1" label="月结账号" prop="configs.sf_monthly_account">
          <el-input v-model="temp.configs.sf_monthly_account"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 1" label="CHECK_HEADER" prop="configs.check_header">
          <el-input v-model="temp.configs.check_header"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 1" label="CHECK_BODY" prop="configs.check_body">
          <el-input v-model="temp.configs.check_body"></el-input>
        </el-form-item>
        <!--圆通配置-->
        <el-form-item v-if="temp.order_logistics_type_id === 6" label="PARTNER_ID" prop="configs.partner_id">
          <el-input v-model="temp.configs.partner_id"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 6" label="CLIENT_ID" prop="configs.client_id">
          <el-input v-model="temp.configs.client_id"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 6" label="API_URL" prop="configs.api_url">
          <el-input v-model="temp.configs.api_url"></el-input>
        </el-form-item>
        <!--德邦配置-->
        <el-form-item v-if="temp.order_logistics_type_id === 9" label="sign" prop="configs.sign">
          <el-input v-model="temp.configs.sign"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 9" label="company_code" prop="configs.company_code">
          <el-input v-model="temp.configs.company_code"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 9" label="customer_code" prop="configs.customer_code">
          <el-input v-model="temp.configs.customer_code"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 9" label="app_key" prop="configs.app_key">
          <el-input v-model="temp.configs.app_key"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 9" label="receive_loan_account" prop="configs.receive_loan_account">
          <el-input v-model="temp.configs.receive_loan_account"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 9" label="receive_account_name" prop="configs.receive_account_name">
          <el-input v-model="temp.configs.receive_account_name"></el-input>
        </el-form-item>
        <!--中通配置-->
        <el-form-item v-if="temp.order_logistics_type_id === 12" label="company_id" prop="configs.company_id">
          <el-input v-model="temp.configs.company_id"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 12" label="key" prop="configs.key">
          <el-input v-model="temp.configs.key"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.order_logistics_type_id === 12" label="partner" prop="configs.partner">
          <el-input v-model="temp.configs.partner"></el-input>
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
  import { updateWarehouseLogisticsExtra, getWarehouseLogisticsExtraList, createWarehouseExtra, getWarehouseList } from '@/api/product'
  import { getOrdersLogisticsTypeList } from '@/api/orders'
  export default {
    components: { },
    name: 'deliverAddressExtre',
    directives: {
      waves
    },
    data() {
      return {
        temp_id: undefined,
        tableKey: 0,
        scrollTop: 0,
        list: null,
        total: null,
        listLoading: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        disabled_order_logistics_type_id: false,
        dialogStatus: undefined,
        dialogFormVisible: false,
        logisticsTypeOptions: [],
        logisticsTypeLoading: false,
        warehouseOptions: [],
        warehouseLoading: false,
        productOptions: [],
        productLoading: false,
        listQuery: {
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
          description: undefined,
          warehouse_id: undefined,
          order_logistics_type_id: undefined,
          configs: {
            sf_monthly_account: undefined,
            delivery_product_name: undefined,
            check_header: undefined,
            check_body: undefined,
            partner_id: undefined,
            client_id: undefined,
            api_url: undefined,
            sign: undefined,
            company_code: undefined,
            customer_code: undefined,
            app_key: undefined,
            receive_loan_account: undefined,
            receive_account_name: undefined,
            company_id: undefined,
            key: undefined,
            partner: undefined
          }
        },
        rules: {
          description: [{ required: true, message: '填写额外信息', trigger: 'change' }],
          order_logistics_type_id: [{ required: true, message: '选择物流', trigger: 'change' }],
          warehouse_id: [{ required: true, message: '选择仓库', trigger: 'change' }],
          configs: {
            sf_monthly_account: [{ required: true, message: '填写月结账户', trigger: 'change' }],
            delivery_product_name: [{ required: true, message: '填写发货产品名称', trigger: 'change' }]
          }
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
    created() {
      this.getList()
      this.queryLogisticsTypeList(' ')
      this.queryWarehouseList(' ')
    },
    methods: {
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      queryLogisticsTypeList(query) {
        if (query !== '') {
          this.logisticsTypeLoading = true
          getOrdersLogisticsTypeList({ logistics_name: query }).then(response => {
            this.logisticsTypeOptions = response.data.data
            this.logisticsTypeLoading = false
          })
        }
      },
      queryWarehouseList(query) {
        if (query !== '') {
          this.warehouseLoading = true
          getWarehouseList({ logistics_name: query }).then(response => {
            this.warehouseOptions = response.data.data
            this.warehouseLoading = false
          })
        }
      },
      getList() {
        this.listLoading = true
        getWarehouseLogisticsExtraList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.resetTemp()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      resetTemp() {
        this.disabled_order_logistics_type_id = false
        this.temp = {
          description: undefined,
          warehouse_id: undefined,
          order_logistics_type_id: undefined,
          configs: {
            sf_monthly_account: null,
            delivery_product_name: null
          }
        }
      },
      createData() {
        console.log(1)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createWarehouseExtra(this.temp).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        console.log(row)
        this.disabled_order_logistics_type_id = true
        this.temp_id = row.id
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        // this.temp.description = row.description
        // this.temp.warehouse_id = row.warehouse_id
        // this.temp.order_logistics_type_id = row.order_logistics_type_id
        // this.temp.configs.delivery_product_name = row.configs.delivery_product_name
        // this.temp.configs.sf_monthly_account = row.configs.sf_monthly_account
        this.temp = Object.assign({}, row)
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const temp = Object.assign({ id: this.temp_id }, this.temp)
            updateWarehouseLogisticsExtra(temp).then(res => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
            })
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
      }
    }
  }
</script>
