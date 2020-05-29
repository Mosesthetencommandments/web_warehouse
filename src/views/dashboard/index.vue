<template>
  <div class="dashboard-editor-container">
    <el-row ref="rowBox" class="panel-group" :gutter="20" v-show="false">
      <el-col :xs="12" :sm="12" :lg="screen" class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="pending_delivery" class="svg_icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">待发货</div>
            <div class="card-panel-text">{{need_delivery_orders_count}}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="screen" class="card-panel-col" >
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="already_shipped" class="svg_icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text" v-if="">当日已发货</div>
            <div class="card-panel-text">{{today_delivered_orders_count}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" v-show="false">
      <el-col :span="24">
        <div id="myPromotionChart" :style="{height:height,width:width}"></div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" >
      <el-date-picker
        v-model="warehouseQuery"
        type="daterange"
        :clearable="false"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @change="getWarehouseLine"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-col :span="24">
        <div id="myWarehouseChart" :style="{width: '100%', height: '400px'}"></div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;"  v-show="false">
      <el-col :span="24">
        <div id="mySupportChart" :style="{width: '100%', height: '400px'}"></div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import { getWarehouseStatisticsData, getWeixinFansRecordData, getWeixinRecordUnfilledList } from '@/api/overview'
import { getDailyLogisticsOrdersCountStatistics } from '@/api/orders'


export default {
  name: 'dashboard',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        date_time: parseTime(new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000), '{y}-{m}-{d}')
      },
      screen: 6,
      chart: null,
      today_delivered_orders_count: 0,
      need_delivery_orders_count: 0,
      yestday_add_count_total: 0,
      yestday_consult_count_total: 0,
      today_add_count_total: 0,
      today_consult_count_total: 0,
      delivered_date: undefined,
      warehouseQuery: [parseTime(new Date().getTime(), '{y}-{m}-{d}'),parseTime(new Date().getTime(), '{y}-{m}-{d}')],
      warehouseData_X: [],
      warehouseData_Y: [],
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  filters: {
    timeIntervalFilter(status) {
      const statusTransMap = {
        '0': 'info',
        '1': 'warning',
        '2': 'primary'
      }
      return statusTransMap[status]
    },
    timeIntervalTranslator(status) {
      const translatorMap = {
        '0': '休班',
        '1': '白班',
        '2': '晚班'
      }
      return translatorMap[status]
    }
  },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    // this.myPromotionLine()
    this.initWarehouseLine()
    // this.mySupportLine()
  },
  created() {
    // this.ifShowNum()
    // this.getCount()
    // this.getYestdayAddFanTotal()
    // this.getTodayAddFanTotal()
    this.getWarehouseLine()
    // this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.$store.state.user.roles === 'administrator' || this.$store.state.user.roles === 'promotionGroup' || this.$store.state.user.roles === 'promotionManager' || this.$store.state.user.roles === 'promotion') {
        getWeixinRecordUnfilledList(this.listQuery).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      }
    },
    handleFilter() {
      this.getList()
    },
    ifShowNum() {
      if (this.$store.state.user.roles !== 'administrator') {
        this.screen = 12
      }
    },
    getCount() {
      if (this.$store.state.user.roles === 'administrator' || this.$store.state.user.roles === 'warehouse') {
        getWarehouseStatisticsData({}).then(response => {
          this.today_delivered_orders_count = response.data.today_delivered_orders_count
          this.need_delivery_orders_count = response.data.need_delivery_orders_count
        })
      }
    },
    getYestdayAddFanTotal() {
      const tempDate = new Date()
      tempDate.setTime(tempDate.getTime() - 24 * 60 * 60 * 1000)
      const fromDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate()
      if (this.$store.state.user.roles === 'administrator' || this.$store.state.user.roles === 'promotionGroup' || this.$store.state.user.roles === 'promotionManager' || this.$store.state.user.roles === 'promotion') {
        getWeixinFansRecordData({ date_time: fromDate }).then(response => {
          this.yestday_add_count_total = response.data.add_count_total
          this.yestday_consult_count_total = response.data.consult_count_total
        })
      }
    },
    getTodayAddFanTotal() {
      const tempDate = new Date()
      const fromDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate()
      if (this.$store.state.user.roles === 'administrator' || this.$store.state.user.roles === 'promotionGroup' || this.$store.state.user.roles === 'promotionManager' || this.$store.state.user.roles === 'promotion') {
        getWeixinFansRecordData({ date_time: fromDate }).then(response => {
          this.today_add_count_total = response.data.add_count_total
          this.today_consult_count_total = response.data.consult_count_total
        })
      }
    },
    getWarehouseLine() {
        getDailyLogisticsOrdersCountStatistics({ date_range: this.warehouseQuery }).then(res => {
          this.warehouseData_X = res.data.map( e => e.logistics_name)
          this.warehouseData_Y = res.data.map( e => e.count)
          console.log(this.warehouseData_X)
          console.log(this.warehouseData_Y)
          this.initWarehouseLine()
        })
    },
    myPromotionLine() {
      const myPromotionChart = this.$echarts.init(document.getElementById('myPromotionChart'))
      myPromotionChart.showLoading()
      myPromotionChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['加粉成本', '加粉数']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '加粉成本',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '加粉数量',
            min: 0,
            max: 50,
            interval: 5,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '加粉成本',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '加粉数',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      })
      myPromotionChart.hideLoading()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          myPromotionChart.resize()
        }, 500)
      })
    },
    initWarehouseLine() {
      const myWarehouseChart = this.$echarts.init(document.getElementById('myWarehouseChart'))
      myWarehouseChart.setOption({
        title: {
          text: '物流发货数',
          textStyle: {
            color: '#c23531'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['发货数']
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            name: '快递',
            data: this.warehouseData_X
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '发货数',
            type: 'bar',
            data: this.warehouseData_Y,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        ]
      })
      window.addEventListener('resize', function() {
        setTimeout(function() {
          myWarehouseChart.resize()
        }, 500)
      })
    },
    mySupportLine() {
      const mySupportChart = this.$echarts.init(document.getElementById('mySupportChart'))
      mySupportChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['成单金额', '平均成交金额']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '成单金额',
            min: 0,
            max: 15000,
            interval: 1000,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '平均成交金额',
            min: 0,
            max: 15000,
            interval: 1000,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '成单金额',
            type: 'line',
            yAxisIndex: 1,
            data: [1000, 5200, 900, 4500, 6000, 10000, 5622, 1833, 7000, 4622, 9422, 1520]
          },
          {
            name: '平均成交金额',
            type: 'line',
            yAxisIndex: 1,
            data: [5000, 8623, 10029, 7852, 6325, 2566, 9855, 1233, 7000, 4622, 9422, 1520]
          }
        ]
      })
      window.addEventListener('resize', function() {
        setTimeout(function() {
          mySupportChart.resize()
        }, 500)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
  /*.el-table thead{color:#878d99 !important;font-weight:500 !important;}*/
  .dashboard-editor-container {
    padding: 20px;
    background-color: rgb(240, 242, 245);
    .panel-group {
      .card-panel-col{
        margin-bottom: 20px;
      }
      .card-panel {
        height: 110px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
        border-color: rgba(0, 0, 0, .05);
        &:hover {
          .card-panel-icon-wrapper {
            color: #fff;
          }
          .icon-score {
            background: #ffe600;
          }
          .icon-people {
            background: #40c9c6;
          }
          .icon-message {
            background: #36a3f7;
          }
          .icon-money {
            background: #f4516c;
          }
          .icon-shoppingCard {
            background: #34bfa3
          }
        }
        .icon-people {
          color: #40c9c6;
        }
        .icon-score {
          color: #ffe600;
        }
        .icon-message {
          color: #36a3f7;
        }
        .icon-money {
          color: #f4516c;
        }
        .icon-shoppingCard {
          color: #34bfa3
        }
        .card-panel-icon-wrapper {
          float: left;
          margin: 14px 0 0 14px;
          padding: 16px;
          transition: all 0.38s ease-out;
          border-radius: 6px;
          .svg_icon {
            font-size: 55px;
          }
        }
        .card-panel-icon {
          float: left;
          font-size: 48px;
        }
        .card-panel-description {
          float: right;
          width: 50%;
          font-weight: bold;
          margin: 26px 0 26px 0;
          .card-panel-text {
            line-height: 18px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 16px;
            margin-bottom: 12px;
          }
          .card-panel-num {
            font-size: 20px;
          }
        }
      }
    }
    #table {
      .el-table thead{
        color:#878d99;
        font-weight:500;
        font-size: 14px;
      }
      .el-table .cell {
        box-sizing: border-box;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
      }
      .el-table th {
        white-space: nowrap;
        overflow: hidden;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        text-align: left;
      }
      .el-table td.is-center, .el-table th.is-center {
        text-align: center;
      }
      medium th {
        padding: 10px 0;
      }
      .el-table {
        color: #686060;
        font-size: 12px !important;
      }
    }
  }
  .icon-tianjiahaoyou:before {
    content: "\e7aa";
    font-size: 45px;
  }
</style>
