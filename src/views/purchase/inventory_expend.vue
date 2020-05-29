<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="20">
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
                      style="width:200px"
                      @change='handleFilter'
                      v-model="listQuery.warehouse_id"
                      clearable
                      placeholder="仓库">
            <el-option  v-for="item in warehouseOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
            </el-option>
          </el-select>
          <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">搜索</el-button>
        </el-col>
        <el-col :span="4" >
          <el-col :span="12">
            <div style="background-color: #d6fdc1;height: 20px;"></div>
          </el-col>
          <el-col :span="12">
            <p style="padding: 0;margin: 0;text-align: center;height: 20px;line-height: 20px;font-size: 12px;">购买</p>
          </el-col>
          <el-col :span="12">
            <div style="background-color: #ffb7ba;height: 20px;"></div>
          </el-col>
          <el-col :span="12">
            <p style="padding: 0;margin: 0;text-align: center;height: 20px;line-height: 20px;font-size: 12px;">退货</p>
          </el-col>
        </el-col>
      </el-row>

      <el-table :key='tableKey'
                :data="list"
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                border
                :span-method="objectSpanMethod"
                :cell-class-name="tableRowClassName"
                fit
                style="width: 100%">
        <el-table-column align="center" label="商品" min-width="100" fixed>
          <template slot-scope="scope">
            <span>{{scope.row.goods_name}}</span><br/>
            <span>{{scope.row.goods_sku_name}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="item in columnList" :key="Math.random()" align="center" :label="item + '\n新粉 / 复购'" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.index % 2 === 0">{{Math.abs(scope.row.data[item].new_order_out) }} / {{Math.abs(scope.row.data[item].repurchase_order_out) }}</span>
              <span v-else>{{scope.row.data[item].new_order_in}} / {{scope.row.data[item].repurchase_order_in}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="合计" min-width="150" fixed="right">
          <template slot-scope="scope">
            <span style="font-size: 20px">{{getTotal(scope.row.data)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import { getWarehouseList} from '@/api/product'
  import { getProductStorageByDay } from '@/api/product'
  import { parseTime } from '@/utils/index'

  export default {
    components: { },
    name: 'inventoryExpend',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        scrollTop: 0,
        list: null,
        columnList: [],
        total: null,
        listLoading: false,
        listQuery: {
          date_range: [
            parseTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7), '{y}-{m}-{d}'),
            parseTime(new Date(), '{y}-{m}-{d}')
          ],
          warehouse_id: undefined,
          page: 1,
          page_size: 20,
          sort: '-id'
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
    methods: {
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      getWarehouseList() {
        getWarehouseList().then(response => {
          this.warehouseOptions = response.data.data
        })
      },
      getTotal(data) {
        let order_out = 0
        let order_in = 0
        for (const v in data) {
          order_out += (data[v].new_order_out + data[v].repurchase_order_out)
          order_in += (Math.abs(data[v].new_order_in) + Math.abs(data[v].repurchase_order_in))
        }
        return Math.abs(order_in - order_out)
      },
      getformat(Date) {
        var s = ''
        s += Date.getFullYear() + '-'
        if (Date.getMonth() + 1 < 10) {
          s += '0' + (Date.getMonth() + 1) + '-'
        } else {
          s += (Date.getMonth() + 1) + '-'
        }
        if (Date.getDate() < 10) {
          s += '0' + Date.getDate()
        } else {
          s += Date.getDate()
        }
        return (s)
      },
      getDateArry(begin, end) {
        this.columnList = []
        var ab = begin.split('-')
        var ae = end.split('-')
        var db = new Date()
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
        var de = new Date()
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
        var unixDb = db.getTime()
        var unixDe = de.getTime()
        for (var k = unixDb; k <= unixDe;) {
          this.columnList.push(this.getformat(new Date(parseInt(k))).toString())
          k = k + 24 * 60 * 60 * 1000
        }
        return this.columnList
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === this.columnList.length + 1) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      tableRowClassName({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === this.columnList.length + 1) {
          return false
        }
        if (rowIndex % 2 === 1) {
          return 'warning-row'
        } else if (rowIndex % 2 === 0) {
          return 'success-row'
        }
        return ''
      },
      getList() {
        this.listLoading = true
        this.getDateArry(this.listQuery.date_range[0], this.listQuery.date_range[1])
        getProductStorageByDay(this.listQuery).then(res => {
          ++this.tableKey
          console.log(this.tableKey)
          this.list = this.getlist2(res.data)
          this.listLoading = false
        })
      },
      getlist2(data) {
        for (let v = 0; v < data.length; v++) {
          if (data[v] !== undefined) {
            const temp = Object.assign({}, data[v])
            data.splice(v, 0, temp)
            v += 1
          }
        }
        for (let i = 0; i < data.length; i++) {
          data[i].index = i
        }
        return data
      }
    },
    created() {
      this.getList()
      this.getWarehouseList()
    },
    deactivated() {
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    },
    activated() {
      window.scrollTo(0, this.scrollTop)
    }
  }
</script>
<style scoped>
  .el-table>>>.warning-row {
    background: #ffb7ba;
  }
  .el-table>>>.success-row {
    background: #d6fdc1;
  }
</style>
