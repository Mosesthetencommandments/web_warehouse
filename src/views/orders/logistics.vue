<template>
  <div class="app-container calendar-list-container">
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
        @change='handleFilter'>
      </el-date-picker>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="订单号" v-model="listQuery.orders_unique_id">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="物流单号" v-model="listQuery.orders_logistics_number">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客服" v-model="listQuery.support_member_nickname">
      </el-input>
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品名称" v-model="listQuery.product_name">-->
      <!--</el-input>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="推广渠道" v-model="listQuery.channel_name">-->
      <!--</el-input>-->
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.status" placeholder="订单状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <p style="text-align:right;padding-right:20px;font-size:22px;">
        <el-button icon="el-icon-download" size="small" type="primary" @click="downExcel">导出未收货订单</el-button>
      </p>
    </div>

    <el-table :stripe="true" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="订单号" min-width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.orders_unique_id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="客服">
        <template slot-scope="scope">
          <span>{{scope.row.support_member.nickname}}</span>
          <p>({{scope.row.support_member.user_account_group.group_name}})</p>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="物流类型">
        <template slot-scope="scope">
          <span v-if="scope.row.orders_logistics.logistics_name">{{scope.row.orders_logistics.logistics_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="物流单号">
        <template slot-scope="scope">
          <span v-if="scope.row.orders_logistics.logistics_number">{{scope.row.orders_logistics.logistics_number}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="订单金额">
        <template slot-scope="scope">
          <span>￥{{scope.row.actual_pay}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="代收金额">
        <template slot-scope="scope">
          <p v-for="item in scope.row.orders_payment.orders_payment_items">
            <span v-if="item.pay_type_id === 2">
              ￥{{item.paid_money}}
            </span>
          </p>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="订单状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | orderStatusFilter">{{scope.row.status|orderStatusTranslator}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="160px" align="center" label="发货时间">
        <template slot-scope="scope">
          <span>{{scope.row.deliver_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===1" size="small" type="success" @click="handleCheckOrders(scope.row)">确认订单</el-button>
          <el-button v-if="scope.row.status===2" size="small" type="info" @click="handleModifyStatus(scope.row,1)">未确认</el-button>
          <el-button v-if="scope.row.status===2 || scope.row.status === 4" size="small" type="success" @click="handleDeliverOrders(scope.row,0)">确认发货</el-button>
          <el-button v-if="scope.row.status===2" size="small" type="warning" @click="handleDeliverOrders(scope.row,1)">已断货</el-button>
          <el-button v-if="scope.row.status===3" size="small" type="success" @click="handleHandleOrders(scope.row,1)">确认签收</el-button>
          <el-button v-if="scope.row.status===3" size="small" type="warning" @click="handleHandleOrders(scope.row,0)">已拒收</el-button>
          <el-button v-if="scope.row.status===5" size="small" type="success" @click="handleResultOrders(scope.row)">已完成</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getOrdersList, updateOrders, deliverOrders, handleOrders, checkOrders, resultOrders } from '@/api/orders'
  import { getUserAccountList } from '@/api/user'
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    name: 'logisticsDynamics',
    components: {},
    directives: {
      waves
    },
    data() {
      return {
        scrollTop: 0,
        ifExpandAll: true,
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          date_range: '',
          promotion_user_account_id: undefined,
          page: 1,
          page_size: 20,
          weixin_fans_address_phone: '',
          sort: '-id',
          orders_unique_id: '',
          orders_logistics_number: '',
          support_member_nickname: '',
          product_name: '',
          status: ''
        },
        importanceOptions: [1, 2, 3],
        sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
        statusOptions: [
          { key: 1, label: '未确认' },
          { key: 2, label: '待发货' },
          { key: 3, label: '发货中' },
          { key: 4, label: '断货中' },
          { key: 5, label: '已签收' },
          { key: 6, label: '已拒收' },
          { key: 7, label: '已完成' }
        ],
        showAuditor: false,
        temp: {
          id: undefined,
          orders_unique_id: '',
          support_user_account_id: undefined,
          product_weixin_id: undefined,
          product_weixin_fans_id: undefined,
          product_weixin_fans_address_id: undefined,
          price_total: undefined,
          actual_pay: 0.00,
          status: 1,
          orders_items: [],
          support_member: {
            id: undefined,
            user_id: undefined,
            nickname: '',
            head_img: '',
            user_account_type_id: undefined,
            user_account_group_id: undefined,
            user_account_role_id: undefined,
            status: undefined
          },
          product_weixin: {
            id: undefined,
            product_id: undefined,
            promotion_user_account_id: undefined,
            support_user_account_id: undefined,
            promotion_channel_id: undefined,
            weixin_nickname: '',
            weixin_account: '',
            phone: '',
            qq: '',
            promotion_channel: {
              id: undefined,
              channel_name: ''
            },
            product_goods: {
              id: undefined,
              goods_name: '',
              price: undefined,
              stock: undefined
            }
          },
          product_weixin_fans_address: {
            id: undefined,
            product_weixin_fans_id: undefined,
            receive_name: '',
            phone: '',
            postcode: '',
            address: '',
            remark: ''
          },
          product_weixin_fans: {
            id: undefined,
            product_weixin_id: undefined,
            weixin_account: '',
            weixin_nickname: '',
            default_address_id: undefined,
            created_at: ''
          },
          orders_remarks: [],
          orders_payment: {
            id: undefined,
            orders_id: undefined,
            payment_total: undefined,
            status: 1,
            orders_payment_items: []
          },
          orders_logistics: {
            id: undefined,
            logistics_type_id: undefined,
            logistics_name: '',
            logistics_number: '',
            orders_logistics_type: {
              id: undefined,
              name: '',
              code: ''
            }
          }
        },
        tempOrdersPaymentItem: {
          id: undefined,
          orders_payment_id: undefined,
          paid_money: undefined,
          pay_type_id: undefined,
          pay_proof_id: undefined,
          created_at: '',
          orders_pay_type: {
            id: undefined,
            type_name: ''
          }
        },
        tempOrderRemark: {
          id: undefined,
          orders_id: undefined,
          user_account_id: undefined,
          user_account_type_id: undefined,
          remark: '',
          created_at: ''
        },
        tempOrdersItem: {
          id: undefined,
          product_id: undefined,
          orders_id: undefined,
          number: undefined,
          product: {
            id: undefined,
            product_name: '',
            price: undefined,
            stock: undefined,
            is_promote: undefined
          }
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          product_name: [{ required: true, message: '请正确填写商品名称', trigger: 'change' }]
        },
        promotionUserAccountOptions: [],
        promotionUserAccountLoading: false,
        pickerOptions2: {
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
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          2: 'info',
          3: 'danger'
        }
        return statusMap[status]
      },
      statusTranslator(status) {
        const statusMap = {
          1: '推广',
          2: '附属产品',
          3: '赠品'
        }
        return statusMap[status]
      },
      orderStatusFilter(status) {
        const statusMap = {
          0: 'info',
          1: 'warning',
          2: '',
          3: '',
          4: '',
          5: '',
          6: 'danger',
          7: 'success',
          8: '',
          9: 'danger'
        }
        return statusMap[status]
      },
      orderStatusTranslator(status) {
        const statusMap = {
          0: '无效订单',
          1: '未确认',
          2: '待发货',
          3: '发货中',
          4: '断货中',
          5: '已签收',
          6: '已拒收',
          7: '已完成',
          8: '已退回',
          9: '已废弃'
        }
        return statusMap[status]
      },
      paymentItemStatusFilter(status) {
        const statusMap = {
          0: 'info',
          1: 'success',
          2: 'danger',
          3: ''
        }
        return statusMap[status]
      },
      paymentItemStatusTranslator(status) {
        const statusMap = {
          0: '未确认',
          1: '已确认',
          2: '已删除',
          3: '已提现'
        }
        return statusMap[status]
      },
      userTypeStatusTranslator(status) {
        const statusMap = {
          1: '推广',
          2: '客服',
          3: '文案',
          4: '库管',
          5: '管理员'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
      this.getPromotionUserAccountList(' ')
    },
    methods: {
      handleModifyStatus(row, status) {
        const tempData = {}
        tempData.orders_id = row.id
        tempData.status = status
        updateOrders(tempData).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          row.status = status
        })
      },
      getPromotionUserAccountList(query) {
        if (query !== '') {
          this.promotionUserAccountLoading = true
          getUserAccountList({ nickname: query, user_account_type_code: 'promote', status: 1 }).then(response => {
            this.promotionUserAccountOptions = response.data.data
            this.promotionUserAccountLoading = false
          })
        }
      },
      handleDeliverOrders(row, empty) {
        const tempParms = {
          orders_id: row.id,
          is_empty: empty
        }
        deliverOrders(tempParms).then(res => {
          if (empty === 0) {
            row.status = 3
          } else {
            row.status = 4
          }
        }).catch(() => {
        })
      },
      handleHandleOrders(row, receive) {
        const tempParms = {
          orders_id: row.id,
          is_receive: receive
        }
        handleOrders(tempParms).then(res => {
          if (receive === 0) {
            row.status = 6
          } else {
            row.status = 5
          }
        }).catch(() => {
        })
      },
      handleResultOrders(row) {
        const tempParms = {
          orders_id: row.id
        }
        resultOrders(tempParms).then(res => {
          row.status = 7
        })
      },
      getList() {
        this.listLoading = true
        getOrdersList(this.listQuery).then(response => {
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
      handleCheckOrders(row) {
        checkOrders({ orders_id: row.id }).then(res => {
          row.status = 2
        })
      },
      downExcel() {
        const form = document.createElement('form')
        form.action = process.env.BASE_API + '/api/orders/downloadNeedCheckOrder' + '?token=' + this.$store.state.user.token
        form.method = 'post'
        form.style.display = 'none'
        const button = document.createElement('input')
        button.type = 'submit'
        form.appendChild(button)
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
      }
    },
    deactivated() {
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    },
    activated() {
      window.scrollTo(0, this.scrollTop)
    }
  }
</script>
