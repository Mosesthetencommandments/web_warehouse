<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="filter-float">
        <el-button class="filter-item" size="small" @click="handleCreate" type="primary" icon="el-icon-edit">创建发货库</el-button>
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
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="仓库名" min-width="300">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属库管部门" min-width="300">
        <template slot-scope="scope">
          <span>{{scope.row.warehouse_group.group_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属财务部门" min-width="300">
        <template slot-scope="scope">
          <span>{{scope.row.finance_group.group_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)" type="primary">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30]" :page-size="listQuery.page_size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px"
               style='width: 100%;'>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="库名称" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item label="寄件地（省）" prop="delivery_province">
              <el-input v-model="temp.delivery_province"></el-input>
            </el-form-item>
            <el-form-item label="寄件地（市）" prop="delivery_city">
              <el-input v-model="temp.delivery_city"></el-input>
            </el-form-item>
            <el-form-item label="寄件地（区）" prop="delivery_district">
              <el-input v-model="temp.delivery_district"></el-input>
            </el-form-item>
            <el-form-item label="寄件邮编" prop="delivery_post_code">
              <el-input v-model="temp.delivery_post_code"></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="发货地址（详细）" prop="delivery_address">
              <el-input v-model="temp.delivery_address"></el-input>
            </el-form-item>
            <el-form-item label="发货人姓名" prop="sender_name">
              <el-input v-model="temp.sender_name"></el-input>
            </el-form-item>
            <el-form-item label="发货人电话" prop="sender_phone">
              <el-input v-model="temp.sender_phone"></el-input>
            </el-form-item>
            <el-form-item label="财务部门" prop="finance_group">
              <multiselect v-model="temp.finance_group" :options="financeGroupOptions" @search-change="queryFinanceGroupList"
                           placeholder="搜索财务部门" selectLabel="选择" deselectLabel="删除" track-by="group_name" :internalSearch="false" label="group_name">
              </multiselect>
            </el-form-item>
            <el-form-item label="库管部门" prop="warehouse_group">
              <multiselect v-model="temp.warehouse_group" :options="warehouseGroupOptions" @search-change="queryWarehouseGroupList"
                           placeholder="搜索库管部门" selectLabel="选择" deselectLabel="删除" track-by="group_name" :internalSearch="false" label="group_name">
              </multiselect>
            </el-form-item>
            <!--<el-form-item label="发货产品" prop="product_ids">-->
              <!--<el-select v-model="temp.product_ids"-->
                         <!--filterable-->
                         <!--style="width: 100%"-->
                         <!--clearable-->
                         <!--multiple-->
                         <!--remote-->
                         <!--placeholder="请选择产品"-->
                         <!--:remote-method="getProductList"-->
                         <!--:loading="productLoading">-->
                <!--<el-option v-for="item in productOptions"-->
                           <!--:key="item.id"-->
                           <!--:label="item.product_name"-->
                           <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->

            <!--<el-form-item label="物流公司" prop="order_logistics_type_id">-->
              <!--<el-select v-model="temp.order_logistics_type_ids"-->
                         <!--filterable-->
                         <!--style="width: 100%"-->
                         <!--clearable-->
                         <!--multiple-->
                         <!--remote-->
                         <!--placeholder="请选择物流公司"-->
                         <!--:remote-method="queryLogisticsTypeList"-->
                         <!--:loading="logisticsTypeLoading">-->
                <!--<el-option v-for="item in logisticsTypeOptions"-->
                           <!--:key="item.id"-->
                           <!--:label="item.name"-->
                           <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="顺丰额外信息" prop="product_deliver_extra_sf"-->
                          <!--v-show="temp.order_logistics_type_ids.indexOf(1) > -1">-->
              <!--<el-select v-model="temp.product_deliver_extra_sf"-->
                         <!--filterable-->
                         <!--style="width: 100%"-->
                         <!--clearable-->
                         <!--remote-->
                         <!--placeholder="请选择额外信息"-->
                         <!--:remote-method="getProductDeliverExtrasf"-->
                         <!--:loading="logisticsTypeLoading_sf">-->
                <!--<el-option v-for="item in logisticsTypeOptions_sf"-->
                           <!--:key="item.id"-->
                           <!--:label="item.description"-->
                           <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="圆通额外信息" prop="product_deliver_extra_yt"-->
                          <!--v-show="temp.order_logistics_type_ids.indexOf(6) > -1">-->
              <!--<el-select v-model="temp.product_deliver_extra_yt"-->
                         <!--filterable-->
                         <!--style="width: 100%"-->
                         <!--clearable-->
                         <!--remote-->
                         <!--placeholder="请选择额外信息"-->
                         <!--:remote-method="getProductDeliverExtrayt"-->
                         <!--:loading="logisticsTypeLoading_yt">-->
                <!--<el-option v-for="item in logisticsTypeOptions_yt"-->
                           <!--:key="item.id"-->
                           <!--:label="item.description"-->
                           <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          </el-col>
        </el-row>
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
  import {
    updateWarehouse,
    getWarehouseList,
    createWarehouse,
    getProductList,
    getWarehouseLogisticsExtraList
  } from '@/api/product'
  import { getFinanceGroupList } from '@/api/financial'
  import { getWarehouseGroupList } from '@/api/warehouse'
  import { getOrdersLogisticsTypeList } from '@/api/orders'
  import Multiselect from 'vue-multiselect'

  export default {
    components: { Multiselect },
    name: 'deliverAddressSetting',
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
        dialogStatus: undefined,
        dialogFormVisible: false,
        logisticsTypeOptions: [],
        logisticsTypeOptions_sf: [],
        logisticsTypeOptions_yt: [],
        logisticsTypeLoading: false,
        logisticsTypeLoading_sf: false,
        logisticsTypeLoading_yt: false,
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
          name: undefined,
          sender_phone: undefined,
          sender_name: undefined,
          delivery_province: undefined,
          delivery_city: undefined,
          delivery_district: undefined,
          delivery_address: undefined,
          delivery_post_code: undefined,
          finance_group: {
            id: undefined,
            group_name: ''
          },
          warehouse_group: {
            id: undefined,
            group_name: ''
          }
        },
        rules: {
          name: [{ required: true, message: '填写名称', trigger: 'change' }],
          sender_name: [{ required: true, message: '填写发货人姓名', trigger: 'change' }],
          sender_phone: [{ required: true, message: '填写发货人电话', trigger: 'change' }],
          delivery_province: [{ required: true, message: '填写省份', trigger: 'change' }],
          delivery_city: [{ required: true, message: '填写城市', trigger: 'change' }],
          delivery_district: [{ required: true, message: '填写区县', trigger: 'change' }],
          delivery_post_code: [{ required: true, message: '填写邮编', trigger: 'change' }]
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
        },
        financeGroupOptions: [],
        warehouseGroupOptions: []
      }
    },
    methods: {
      queryWarehouseGroupList(query) {
        getWarehouseGroupList().then(response => {
          if (!response.data) return
          this.warehouseGroupOptions = response.data.map(v => ({
            id: v.id,
            group_name: v.group_name
          }))
        })
      },
      queryFinanceGroupList(query) {
        getFinanceGroupList().then(response => {
          if (!response.data) return
          this.financeGroupOptions = response.data.map(v => ({
            id: v.id,
            group_name: v.group_name
          }))
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        getWarehouseList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
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
            if (this.temp.finance_group !== undefined) {
              this.temp.finance_group_id = this.temp.finance_group.id
            }
            if (this.temp.warehouse_group !== undefined) {
              this.temp.warehouse_group_id = this.temp.warehouse_group.id
            }
            createWarehouse(this.temp).then(res => {
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
        this.temp_id = row.id
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.temp.name = row.name
        this.temp.sender_name = row.sender_name
        this.temp.sender_phone = row.sender_phone
        this.temp.delivery_province = row.delivery_province
        this.temp.delivery_city = row.delivery_city
        this.temp.delivery_district = row.delivery_district
        this.temp.delivery_post_code = row.delivery_post_code
        this.temp.delivery_address = row.delivery_address
        this.temp.finance_group = row.finance_group
        this.temp.warehouse_group = row.warehouse_group
        this.financeGroupOptions = []
        this.warehouseGroupOptions = []
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.temp.finance_group !== undefined) {
              this.temp.finance_group_id = this.temp.finance_group.id
            }
            if (this.temp.warehouse_group !== undefined) {
              this.temp.warehouse_group_id = this.temp.warehouse_group.id
            }
            const tempparm = Object.assign({ id: this.temp_id }, this.temp)
            updateWarehouse(tempparm).then(res => {
              this.$message({
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
      queryLogisticsTypeList(query) {
        if (query !== '') {
          this.logisticsTypeLoading = true
          getOrdersLogisticsTypeList({ logistics_name: query }).then(response => {
            this.logisticsTypeOptions = response.data.data
            this.logisticsTypeLoading = false
          })
        }
      },
      getProductDeliverExtrasf() {
        this.logisticsTypeLoading_sf = true
        getWarehouseLogisticsExtraList({ order_logistics_type_id: 1 }).then(response => {
          this.logisticsTypeOptions_sf = response.data.data
          this.logisticsTypeLoading_sf = false
        })
      },
      getProductDeliverExtrayt() {
        this.logisticsTypeLoading_yt = true
        getWarehouseLogisticsExtraList({ order_logistics_type_id: 6 }).then(response => {
          this.logisticsTypeOptions_yt = response.data.data
          this.logisticsTypeLoading_yt = false
        })
      },
      getProductList(query) {
        if (query !== '') {
          this.productLoading = true
          getProductList({ product_name: query, is_promote: 1 }).then(response => {
            this.productOptions = response.data.data
            this.productLoading = false
          })
        }
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    },
    watch: {
      dialogFormVisible(val) {
        if (!val) {
          this.$refs['dataForm'].resetFields()
          this.temp = {
            name: undefined,
            sender_phone: undefined,
            sender_name: undefined,
            delivery_province: undefined,
            delivery_city: undefined,
            delivery_district: undefined,
            delivery_address: undefined,
            delivery_post_code: undefined,
            product_deliver_extra_ids: [],
            product_ids: [],
            order_logistics_type_ids: [],
            product_deliver_extra_sf: undefined,
            product_deliver_extra_yt: undefined
          }
        }
      }
    },
    created() {
      this.getList()
      this.getProductList(' ')
      this.queryLogisticsTypeList(' ')
      this.getProductDeliverExtrasf()
      this.getProductDeliverExtrayt()
    }
  }
</script>
<style scoped>

</style>
