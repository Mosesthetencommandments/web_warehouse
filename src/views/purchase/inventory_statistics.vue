<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker class="filter-item"
                      v-model="listQuery.date_range"
                      type="daterange"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      align="right"
                      unlink-panels
                      :clearable="false"
                      range-separator="~"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                      @change='handleFilter'>
      </el-date-picker>
      <el-select  class="filter-item"
                  style="width:100px"
                  @change='handleFilter'
                  v-model="listQuery.is_input"
                  clearable
                  placeholder="出入库">
        <el-option  v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
        </el-option>
      </el-select>
      <el-select  class="filter-item"
                  style="width:150px"
                  @change='handleFilter'
                  v-model="listQuery.operate_type"
                  clearable
                  placeholder="操作类型"
                  >
        <el-option  v-for="item in typeOptions2"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
        </el-option>
      </el-select>
      <!--<el-select  class="filter-item"-->
                  <!--style="width:180px"-->
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
      <el-select  class="filter-item"
                  style="width:180px"
                  @change='handleFilter'
                  @focus="getWarehouseProductGoodsStorageList(' ')"
                  v-model="listQuery.product_goods_id"
                  filterable
                  clearable
                  remote
                  placeholder="商品"
                  :remote-method="getWarehouseProductGoodsStorageList"
                  :loading="productGoodsLoading">
        <el-option  v-for="item in productGoodsOptions"
                    :key="item.product_goods_id"
                    :label="item.product_goods.goods_name"
                    :value="item.product_goods_id">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">搜索</el-button>
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
      <el-table-column align="center" label="商品名称" min-width="150" >
        <template slot-scope="scope">
          <span>{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出入库" min-width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.number > 0" type="success">入库</el-tag>
          <el-tag v-else type="danger">出库</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作类型" min-width="150" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.operate_type | handleTypeClass">{{scope.row.operate_type | handleType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" min-width="150" >
        <template slot-scope="scope">
          <span v-if="scope.row.number > 0" style="color: #67c23a;font-size: 20px;font-weight: 600;">{{scope.row.number}}</span>
          <span v-else style="color: #f56c6c;font-size: 20px;font-weight: 600;">{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" min-width="150" >
        <template slot-scope="scope">
          <span>{{scope.row.operator_account_name}}</span><br>
          <span>{{scope.row.datetime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import { getWarehouseList} from '@/api/product'
  import { getProductGoodsList } from '@/api/product_goods'
  import { getProductStorageDetailList } from '@/api/product'
  import { getWarehouseProductGoodsStorageList } from '@/api/warehouse'
  import { parseTime } from '@/utils/index'

  export default {
    components: { },
    name: 'inventoryStatistics',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        scrollTop: 0,
        list: [],
        total: null,
        listLoading: false,
        typeOptions: [
          { id: 0, label: '出库' },
          { id: 1, label: '入库' }
        ],
        typeOptions2: [
          { id: 0, label: '客户下单' },
          { id: 1, label: '盘货整理' },
          { id: 2, label: '订货到货' },
          { id: 3, label: '客户退货' },
          { id: 4, label: '人工出入库' }
        ],
        typeOptions3: [
          { id: 0, label: '有效操作' },
          { id: 1, label: '无效操作' }
        ],
        productOptions: [],
        productLoading: false,
        listQuery: {
          product_goods_id: undefined,
          // warehouse_id: undefined,
          operate_type: undefined,
          date_range: [
            parseTime(new Date(new Date().getTime() - 1000 * 3600 * 24 * 7), '{y}-{m}-{d}'),
            parseTime(new Date(), '{y}-{m}-{d}')
          ],
          is_input: undefined,
          page: 1,
          page_size: 20,
          sort: '-id'
        },
        warehouseOptions: [],
        productGoodsOptions: [],
        productGoodsLoading: false,
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
      getList() {
        this.listLoading = true
        getProductStorageDetailList(this.listQuery).then(res => {
          this.list = res.data.data
          console.log(this.list,11111)
          this.listLoading = false
          this.total = res.data.total
        })
      },
      getWarehouseList() {
        getWarehouseList().then(response => {
          this.warehouseOptions = response.data.data
        })
      },
      getWarehouseProductGoodsStorageList(query) {
        if (query !== '') {
          this.productGoodsLoading = true
          getWarehouseProductGoodsStorageList({ warehouse_id: this.listQuery.warehouse_id, goods_name: query }).then(response => {
            this.productGoodsOptions = response.data.data
            console.log(this.productGoodsOptions,9999)
            this.productGoodsLoading = false
          })
        }
      },
      handleWarehouse() {
        this.listQuery.product_goods_id = undefined
        this.productGoodsOptions = []
        this.handleFilter()
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
    filters: {
      handleType(status) {
        const statusMap = {
          '0': '客户下单',
          '1': '盘货整理',
          '2': '订货到货',
          '3': '客户退单',
          '4': '人工出入库'
        }
        return statusMap[status]
      },

      handleTypeClass(status) {
        const statusMap = {
          '0': 'danger',
          '1': 'primary',
          '2': 'success',
          '3': 'warning',
          '4': 'info'
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
