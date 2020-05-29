<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select @change='handleFilter' clearable style="width: 150px" class="filter-item" v-model="listQuery.storage_status"
                 placeholder="状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-select class="filter-item"
                 v-model="listQuery.warehouse_id"
                 filterable
                 @change="handleFilter"
                 clearable
                 placeholder="仓库">
        <el-option  v-for="item in warehouseOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
        </el-option>
      </el-select>
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
      <div class="filter-float">
        <el-button class="filter-item" size="small" @click="handleFilter" type="primary"
                   icon="el-icon-search">搜索
        </el-button>
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
      <el-table-column align="center" label="仓库" min-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.warehouse.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品" min-width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.product_goods.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="剩余库存">
        <template slot-scope="scope">
          <span>{{scope.row.stock}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="日均消耗">
        <template slot-scope="scope">
          <span>{{scope.row.average_cost}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="生产周期">
        <template slot-scope="scope">
          <span>{{scope.row.product_goods.production_cycle}}天</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="可用天数" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.average_cost !== 0">{{parseInt(scope.row.stock / scope.row.average_cost)}}天</span>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存状态" min-width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.stock === 0" type="danger">已断货</el-tag>
          <el-tag
            v-else-if="scope.row.stock / scope.row.average_cost > scope.row.product_goods.production_cycle || scope.row.stock / scope.row.average_cost === scope.row.product_goods.production_cycle"
            type="success">库存充裕
          </el-tag>
          <el-tag v-else="scope.row.stock / scope.row.average_cost < scope.row.product_goods.production_cycle" type="warning">库存告警
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import { getProductGoodsStorageList, getWarehouseProductGoodsStorageList } from '@/api/warehouse'
  import { getWarehouseList } from '@/api/product'
  export default {
    components: {},
    name: 'inventoryWarning',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        scrollTop: 0,
        list: null,
        total: null,
        listLoading: false,
        productOptions: [],
        productLoading: false,
        listQuery: {
          product_goods_id: undefined,
          warehouse_id: undefined,
          page: 1,
          page_size: 20,
          sort: '-id',
          storage_status: undefined
        },
        warehouseOptions: [],
        statusOptions: [
          {label: '充裕', key: 0},
          {label: '告警', key: 1},
          {label: '断货', key: 2},
          {label: '告警已处理', key: 3},
        ],
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
        productGoodsOptions: [],
        productGoodsLoading: false
      }
    },
    methods: {
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        getProductGoodsStorageList(this.listQuery).then(response => {
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
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      getWarehouseProductGoodsStorageList(query) {
        if (query !== '') {
          this.productGoodsLoading = true
          getWarehouseProductGoodsStorageList({ warehouse_id: this.listQuery.warehouse_id, goods_name: query }).then(response => {
            this.productGoodsOptions = response.data.data
            this.productGoodsLoading = false
          })
        }
      },
    },
    created() {
      this.getList()
      this.getWarehouseList()
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: 'info',
          1: 'success'
        }
        return statusMap[status]
      },
      statusTranslator(status) {
        const statusMap = {
          0: '非在售',
          1: '在售'
        }
        return statusMap[status]
      }
    }
  }
</script>
