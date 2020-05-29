<template>
  <div class="app-container">
    <el-button @click="handleBack">返回</el-button>
    <div style="width: 60%;margin: 0 auto;clear: both;">
      <div class="saleCustomer">售后单信息</div>
      <div class="saleContainer">
        <div class="saleChild">售后单ID: {{list.sale_unique_id}}</div>
        <div class="saleChild">
          <span>售后类型:</span>
          <span v-if="list.after_sale_type_id == 1">退货</span>
          <span v-if="list.after_sale_type_id == 2">换货</span>
        </div>
        <div class="saleChild">
          <span>售后状态:</span>
          <span>{{list.procedure_status | procedureStates}}</span>
          <el-button type="primary" class="refund" @click="handleState">修改状态</el-button>
        </div>
        <div class="saleChild">
          <span>审核时间:</span>
          <span>{{list.verify_success_or_failed_time}}</span>
        </div>
        <!--<div class="saleChild" v-if="list.after_sale_type_id == 1">-->
          <!--<span>退款账户类型:</span>-->
          <!--<span v-if="list.after_sale_refund">{{list.after_sale_refund.after_sale_receive_type.type_name}}</span>-->
        <!--</div>-->
        <!--<div class="saleChild" v-if="list.after_sale_type_id == 1">-->
          <!--<span>退款账户:</span>-->
          <!--<span v-if="list.after_sale_refund">{{list.after_sale_refund.receive_account}}</span>-->
        <!--</div>-->
        <!--<div class="saleChild" v-if="list.after_sale_type_id == 1">-->
          <!--<span>退款金额：</span>-->
          <!--<span v-if="list.after_sale_refund">￥{{list.after_sale_refund.refund_money}}</span>-->
          <!--<el-button type="primary" class="refund" @click="handleRefundInfo">修改退款信息</el-button>-->
        <!--</div>-->
        <!--<div class="saleChild" v-if="list.after_sale_type_id == 1">-->
          <!--<span>退款凭证:</span>-->
          <!--<span v-if="list.after_sale_refund">{{list.after_sale_refund.refund_proof}}</span>-->
        <!--</div>-->
      </div>
    </div>
    <div style="width: 60%;margin: 0 auto;clear: both;">
      <div class="saleCustomer">售后客户信息</div>
      <div class="saleContainer">
        <div class="saleChild">
          <span>客户姓名:</span>
          <span>{{list.contact_name}}</span>
        </div>
        <div class="saleChild">联系方式: {{list.contact_phone}}</div>
      </div>
    </div>
    <div style="width: 60%;margin: 0 auto;clear: both;">
      <div class="saleCustomer">退换货明细</div>
      <div class="saleContainer">
        <div class="saleChild" v-for="item in list.after_sale_items">
          <span>{{item.goods.goods_name}}</span>
          <span>X</span>
          <span>{{item.after_sale_number}}</span>
        </div>
      </div>
    </div>
    <div style="width: 60%;margin: 0 auto;clear: both;">
      <div class="saleCustomer">处理流水</div>
      <div class="saleContainer">
        <div>
          <el-steps direction="vertical">
            <el-step style="margin-bottom: 20px;width: 600px;" v-for="item in list.after_sale_procedure" :title="item | procedureStates1"  :description="item.created_at + item.info">
            </el-step>
          </el-steps>
        </div>
      </div>
    </div>
    <!--修改状态弹出-->
    <el-dialog :visible.sync="dialogState">
      <el-form :rules="rule" ref="dateForm" :model="temp" label-position="left" label-width="20%" style='width: 80%; margin-left:10%;'>
        <el-form-item>
          <el-radio-group v-model="temp.operation_status" size="medium" style="margin-bottom: 20px;">
            <el-radio-button label="3">货物数目错误</el-radio-button>
            <el-radio-button label="4">货物数目正确(退货)</el-radio-button>
            <el-radio-button label="5">货物数目正确(换货)</el-radio-button>
            <el-radio-button label="6">换货已发出</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="info">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 40}" v-model="temp.info" placeholder="请输入修改售后状态的备注～"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogState = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getAfterSaleInfo, updateAfterSaleWarehouse } from '@/api/aftersale'
  export default {
    name: 'afterDetails',
    data() {
      return {
        fullOptions: [],
        typeLoading: false,
        listQuery: {
          after_sale_id: undefined
        },
        btnLoading: false,
        temp: {
          operation_status: '6',
          info: undefined
        },
        dialogState: false,
        list: {
          after_sale_items: [],
          sale_unique_id: undefined,
          after_sale_refund: {
            after_sale_receive_type: {
              type_name: undefined
            }
          },
          sourceable: {
            customer_message: {
              shop_customer: {},
              shop_member_level: {}
            },
            shop_goods_common: {}
          },
          wareahouse: {},
          after_sale_apply_type: {}
        },
        listLoading: false,
        rule: {
          info: [{ required: true, message: '请正确填写备注', trigger: 'change' }]
        },
        btnLoading1: false
      }
    },
    filters: {
      procedureStates(status) {
        const statusMap = {
          1: '审核通过， 等待接收退货',
          2: '审核不通过',
          3: '已收到退货，货物数目错误',
          4: '已收到退货，退货数目正确(退货)',
          5: '已收到退货，退货数目正确(换货)',
          6: '已收到货,换货已发出',
          7: '等待打款',
          8: '已打款，等待完结',
          9: '未打款，收款信息不明确',
          10: '已完结',
          11: '已关闭',
          12: '取消'
        }
        return statusMap[status]
      },
      procedureStates1(item) {
        const statusMap = {
          1: '审核通过， 等待接收退货',
          2: '审核不通过',
          3: '已收到退货，货物数目错误',
          4: '已收到退货，退货数目正确(退货)',
          5: '已收到退货，退货数目正确(换货)',
          6: '已收到货,换货已发出',
          7: '等待打款',
          8: '已打款，等待完结',
          9: '未打款，收款信息不明确',
          10: '已完结',
          11: '已关闭',
          12: '取消'
        }
        return item.operator_user_account.nickname + '将状态改为' + statusMap[item.procedure_status]
      }
    },
    created() {
      this.listQuery.after_sale_id = this.$route.query.after_sale_id
      this.getList()
    },
    activated() {
      this.listQuery.after_sale_id = this.$route.query.after_sale_id
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getAfterSaleInfo(this.listQuery).then(response => {
          this.list = response.data
        })
      },
      // 修改状态
      handleState() {
        this.dialogState = true
        this.resetemp()
        this.$nextTick(() => {
          this.$refs['dateForm'].clearValidate()
        })
      },
      // 确认修改状态
      confirm() {
        this.$refs['dateForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.after_sale_id = this.listQuery.after_sale_id
            console.log(tempData.after_sale_id)
            console.log(tempData)
            updateAfterSaleWarehouse(tempData).then(response => {
              this.getList()
              this.dialogState = false
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
      resetemp() {
        this.temp = {
          operation_status: '6',
          info: undefined
        }
      },
      // 返回上一页
      handleBack() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  .refund{
    letter-spacing: 1px;
    font-size: 16px;
    margin-left: 15px;
  }
  .saleContainer{
    display: inline-block;
    float: left;
    margin: 40px 0 40px 40px;
  }
  .saleCustomer{
    font-weight: 700;
    font-size: 30px;
    color: rgb(16, 16, 16);
    font-style: normal;
    line-height: 33px;
    text-decoration: none;
    display: inline-block;
    float: left;
  }
  .saleChild{
    font-size: 20px;
    color: rgb(16, 16, 16);
    font-style: normal;
    line-height: 20px;
    text-decoration: none;
    margin-bottom: 15px;
  }
  .el-step >>> .is-wait {
    color: #000;
    font-size: 20px;
  }
  .el-step__description{
    width: 900px!important;
  }
</style>
