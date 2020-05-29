<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        class="filter-item"
        v-model="listQuery.date_range"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        align="right"
        unlink-panels
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2"
        @change='handleFilter'
        style="width: 280px;">
      </el-date-picker>
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="订单号"
                v-model="listQuery.orders_unique_id" clearable>
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="售后单号"
                v-model="listQuery.after_sale_unique_id" clearable>
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" placeholder="客户电话"
                v-model="listQuery.customer_account_phone" clearable>
      </el-input>
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.procedure_status_array">
        <el-option v-for="item in procedureOptions" :key="item.key" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div style="float: right;">
        <el-button class="filter-item" type="primary" v-waves @click="handleFilter">搜索</el-button>
      </div>
    </div>
    <template>
      <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" stripe fit highlight-current-row border style="width: 100%;">
        <el-table-column label="ID" width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="售后单号" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sale_unique_id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="订单号" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orders_unique_id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="售后类型" align="center" min-width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.after_sale_type_id == 1">退货</span>
            <span v-if="scope.row.after_sale_type_id == 2">换货</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="100px">
          <template slot-scope="scope">
            {{scope.row.procedure_status|procedureStatus}}
          </template>
        </el-table-column>
        <el-table-column min-width="150" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.created_at}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button type="primary" @click="operation(scope.row)">操作</el-button>
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
    </template>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import { getAfterSaleList } from '@/api/aftersale'
  export default {
    name: 'afterManageList',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        listQuery: {
          page: 1,
          page_size: 10,
          date_range: [],
          after_sale_unique_id: undefined,
          orders_unique_id: undefined,
          customer_account_phone: undefined,
          procedure_status_array: [1, 3, 5]
        },
        temp: {
        },
        procedureOptions: [
          { key: 1, label: '审核通过', value: 1 },
          { key: 3, label: '已收到退货，货物数目错误', value: 3 },
          { key: 5, label: '已收到退货，退货数目正确(换货)', value: 5 }
        ],
        pickerOptions2: {},
        list: [],
        total: null,
        listLoading: false
      }
    },
    filters: {
      procedureStatus(status) {
        const statusTransMap = {
          0: '未审核',
          1: '审核通过',
          2: '审核不通过',
          10: '完结',
          11: '关闭'
        }
        return statusTransMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        const params = JSON.parse(JSON.stringify(this.listQuery))
        console.log(params)
        if (params.procedure_status_array === null || params.procedure_status_array === '') {
          params.procedure_status_array = [1, 3, 5]
        }
        console.log(params)
        this.listLoading = true
        getAfterSaleList(params).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.tableKey++
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      // 操作
      operation(row) {
        this.$router.push({
          path: '/afterManage/afterDetails',
          query: {
            after_sale_id: row.id
          }
        })
      },
      // 分页
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

<style scoped>

</style>
