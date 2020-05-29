<template>
  <div class="app-container calendar-list-container">
    <!--<el-button type="primary" v-waves icon="el-icon-refresh" size="small" @click="show = !show">筛选</el-button>-->
    <div class="filter-container transition-box">
      <div class="filter-item">
        <div class="filter-label">日期</div>
        <el-date-picker v-model="listQuery.date_range"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        align="right"
                        size="small"
                        style="width: 250px"
                        unlink-panels
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions2"
                        @change='handleFilter'>
        </el-date-picker>
      </div>
      <div class="filter-item">
        <div class="filter-label">状态</div>
        <el-select @change='handleFilter'
                   clearable style="width: 100px"
                   size="small"
                   v-model="listQuery.orders_status"
                   placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <div class="filter-label">收件人姓名</div>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 150px;" size="small"
                  v-model="listQuery.secondary_name">
        </el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">收件人电话</div>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 150px;" size="small"
                  v-model="listQuery.secondary_phone">
        </el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">系统订单号</div>
        <el-input @keyup.enter.native="handleFilter"
                  style="width: 150px;" size="small"
                  clearable
                  v-model="listQuery.orders_unique_id">
        </el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">商城订单号</div>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 250px;" size="small"
                  v-model="listQuery.secondary_shop_orders_id">
        </el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">物流单号</div>
        <el-input @keyup.enter.native="handleFilter" clearable style="width: 150px;" size="small"
                  v-model="listQuery.orders_logistics_number">
        </el-input>
      </div>
      <div class="filter-float">
        <!--<el-button class="filter-item" type="primary" v-waves size="small" :disabled="list2.length == 0" @click="handleBatch">批量操作</el-button>-->
        <!--<el-button class="filter-item" style="margin-right: 20px" type="primary" :disabled="list.length == 0" v-waves size="small" @click="downExcel">导出</el-button>-->
        <el-button class="filter-item" type="primary" v-waves size="small" @click="handleFilter">搜索</el-button>
        <!--<el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" size="small" @click="handleCreate">添加</el-button>-->
        <el-button class="filter-item" type="primary" v-waves size="small" @click="refreshOrdersList">刷新</el-button>
      </div>
    </div>

    <el-table stripe
              :data="list"
              ref="secondaryTable"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border
              fit
              @selection-change="selectTablechange"
              highlight-current-row
              :expand-row-keys="expandList"
              @expand-change="expandRow"
              row-key="id"
              style="width: 100%" :default-expand-all="ifExpandAll" :row-class-name="tableRowClassName">
      <!--<el-table-column-->
        <!--align="center"-->
        <!--:selectable="selecdisabled"-->
        <!--type="selection"-->
        <!--width="40">-->
      <!--</el-table-column>-->
      <el-table-column type="expand" :default-expand-all="ifExpandAll">
        <template slot-scope="scope">
          <el-form inline label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单商品">
              <p class="my-form-p" v-for="item in scope.row.orders_items">
                {{item.product_goods.goods_name}} x {{item.number}}
              </p>
              <!--<el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑商品信息-->
              <!--</el-button>-->
            </el-form-item>
            <el-form-item label="发货信息">
              <p class="my-form-p">
                <span class="label-span">发货人：</span><span>{{scope.row.orders_sender_info.sender_name}}</span>
              </p>
              <p class="my-form-p">
                <span class="label-span">联系电话：</span><span>{{scope.row.orders_sender_info.sender_phone}}</span>
              </p>
            </el-form-item>
            <el-form-item label="收款信息">
              <p class="my-form-p" v-if="scope.row.orders_payment" v-for="item in scope.row.orders_payment.orders_payment_items"
                 :class="item.status === 2 ? if_deleted:''">
                <el-tag style="height:20px;line-height:20px;" :type="'success'" :class="item.status === 2 ? if_deleted : ''">
                  {{item.orders_pay_type.type_name}}
                </el-tag>
                ￥{{item.paid_money}}
              </p>
            </el-form-item>
            <el-form-item label="收货信息">
              <div v-if="scope.row.orders_secondary_receiver_info">
                <p class="my-form-p">
                  <span class="label-span">收货人：</span><span v-if="scope.row.orders_secondary_receiver_info">{{scope.row.orders_secondary_receiver_info.receive_name}}</span>
                </p>
                <p class="my-form-p">
                  <span class="label-span">联系电话：</span>
                  <span v-if="scope.row.orders_secondary_receiver_info && scope.row.orders_secondary_receiver_info.phone">{{scope.row.orders_secondary_receiver_info.phone}}</span>
                </p>
                <p class="my-form-p">
                  <span class="label-span">收货地址：</span>
                  <span>
                    {{scope.row.orders_secondary_receiver_info.province}} {{scope.row.orders_secondary_receiver_info.city}} {{scope.row.orders_secondary_receiver_info.district}}
                    {{scope.row.orders_secondary_receiver_info.address}}
                  </span>
                </p>
              </div>
            </el-form-item>
            <el-form-item label="留言备注">
              <p class="my-form-p" v-for="item in scope.row.orders_remarks" :class="item.status===0?if_deleted:''">
                <span class="label-span">{{item.user_account_type_id|userTypeStatusTranslator}}：</span>
                <span>{{item.remark}}</span>
              </p>
            </el-form-item>
            <el-form-item label="物流信息">
              <div v-if="scope.row.orders_logistics">
                <p class="my-form-p">
                  <span class="label-span">物流方式：</span>
                  <el-tag v-if="scope.row.orders_logistics.orders_logistics_type.name"
                          style="height:20px;line-height:20px;" type="warning">
                    {{scope.row.orders_logistics.orders_logistics_type.name}}
                  </el-tag>
                </p>
                <p class="my-form-p">
                  <span class="label-span">物流单号：</span>
                  <span >{{scope.row.orders_logistics.logistics_number}}</span>
                </p>
              </div>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="printOrders(scope.row)">打印订单
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleInnerUpdate3(scope.row)">编辑物流信息
              </el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column width="70px" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | orderStatusFilter">{{scope.row.status|orderStatusTranslator}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="系统订单号" width="130">
        <template slot-scope="scope">
          <span>{{scope.row.orders_unique_id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商城订单号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.secondary_shop_orders_id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="170px" align="center" label="商品">
        <template slot-scope="scope">
          <span v-for="item in scope.row.orders_items">
            {{item.product_goods.goods_name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="50" align="center" label="数量">
        <template slot-scope="scope">
          <span v-for="item in scope.row.orders_items">
            {{item.number}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.order_time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 2" size="mini" type="success" @click="handleDeliverSecondaryShopOrders(scope.row)">已发货</el-button>
          <el-button v-if="scope.row.status === 3" size="mini" type="info" @click="handleCancelSecondaryShopOrders(scope.row)">废弃</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.page_size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--编辑二类商品-->
    <el-dialog :title="innerTableTitle1" :visible.sync="innerTableVisible1" width="40%">
      <el-form :rules="rules1" ref="innerDataForm1" :model="temp" label-position="left" label-width="80px"
               style='width: 80%; margin-left:10%;margin-top: 10px'>
        <el-form-item label="商品名称" prop="product_goods_id">
          <el-select
            @focus="queryProductGoodsList(' ')"
            v-model="temp.product_goods_id"
            filterable
            size="small"
            style="width:300px;"
            remote
            placeholder="商品"
            :remote-method="queryProductGoodsList">
            <el-option
              v-for="item in productGoodsOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input-number size="small" v-model="temp.number"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="innerTableVisible1 = false">取消</el-button>
        <el-button v-if="dialogStatus == 'single'" type="primary" size="small" @click="updateSecondary">确 定</el-button>
        <el-button v-if="dialogStatus == 'batch'" type="primary" size="small" @click="batchSettingsProduct">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑物流信息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible3" width="70%">
      <el-form :rules="innerRules3" ref="innerDataForm3" :model="innerTemp3" label-position="left" label-width="80px"
               style='width: 80%; margin-left:10%;'>
        <el-form-item label="物流名称" prop="orders_logistics_type.code">
          <el-select v-model="innerTemp3.orders_logistics_type"
                     @change="resetLogisticsNumber"
                     @focus="queryLogisticsTypeList(' ')"
                     style="width: 100%"
                     value-key="id"
                     clearable
                     remote
                     placeholder="请选物流"
                     :remote-method="queryLogisticsTypeList"
                     :loading="queryLogisticsTypeLoading">
            <el-option v-for="item in logisticsTypeOptions"
                       :key="item.code"
                       :label="item.name"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="额外信息" prop="product_deliver_extra_id"
                      v-if="innerTemp3.orders_logistics_type.code === '1001' || innerTemp3.orders_logistics_type.code === '1006' || innerTemp3.orders_logistics_type.code === '1009'">
          <el-select v-model="innerTemp3.product_deliver_extra_id"
                     @change="resetLogisticsNumber2"
                     @focus="getWarehouseLogisticsExtraList(' ')"
                     style="width: 100%"
                     filterable
                     remote
                     placeholder="请选额外信息"
                     :remote-method="getWarehouseLogisticsExtraList"
                     :loading="productDeliverExtraLoading">
            <el-option v-for="item in productDeliverExtraOptions"
                       :key="item.id"
                       :label="item.description"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logistics_number">
          <el-input :disabled="innerTemp3.orders_logistics_type.code === '1001' || innerTemp3.orders_logistics_type.code === '1009'"
                    v-model="innerTemp3.logistics_number"></el-input>
        </el-form-item>
        <el-form-item label="地区编码" prop="dest_code" v-if="innerTemp3.dest_code !== '' && innerTemp3.orders_logistics_type.code !== '' ">
          <el-input disabled v-model="innerTemp3.dest_code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerDialogFormVisible3 = false">取 消</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="createInnerData3">确 定</el-button>
      </div>
    </el-dialog>

    <!--批量修改-->
    <el-dialog title="批量操作" :visible.sync="batchVisible" width="80%">
      <div class="filter-container">
        <div class="filter-float">
          <el-button type="primary" @click="handleBatchSettingsProduct" size="small" class="filter-item">设置商品</el-button>
          <el-button type="success" @click="handleBatchUpdateOrdersStatus" size="small" class="filter-item">确认订单</el-button>
        </div>
      </div>
      <el-table stripe
                :key='tableKey1'
                :data="list2"
                size="mini"
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                border
                fit
                highlight-current-row
                style="width: 100%">
        <el-table-column width="90px" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.status | orderStatusFilter">{{scope.row.status|orderStatusTranslator}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="订单金额">
          <template slot-scope="scope">
            <span>￥{{scope.row.actual_pay}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="340px" align="center" label="商品">
          <template slot-scope="scope">
            <el-tag size="small" v-for="item in scope.row.orders_items">
              {{item.product_goods.goods_name}} x {{item.number}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="170px" align="center" label="收货人/电话">
          <template slot-scope="scope">
            <span>{{scope.row.orders_secondary_receiver_info.receive_name}}</span>/
            <span>{{scope.row.orders_secondary_receiver_info.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180" align="center" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.order_time}}</span>
          </template>
        </el-table-column>
        <el-table-column width="65" align="center" label="删除">
          <template slot-scope="scope">
            <i class="el-icon-remove" @click="delectSelect(scope.row)" style="color: red;font-size: 20px;cursor: pointer"></i>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="batchVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="batchUpdateconfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getProductList, getWarehouseLogisticsExtraList } from '@/api/product'
  // import {
  //   getProductList,
  //   deleteProduct,
  //   getProductTemplateList,
  //   getWarehouseList,
  //   getWarehouseLogisticsExtraList
  // } from '@/api/product'
  import { getSecondaryShopOrdersList, updateSecondaryShopOrdersStatus, updateSecondaryShopOrdersItems } from '@/api/orders'
  import { getSupportMemberList } from '@/api/support_member'
  import { getProductGoodsList } from '@/api/product_goods'
  // import { getSystemGlobalSettingInfo } from '@/api/system_global_setting'
  import {
    getOrdersList,
    createOrders,
    updateOrders,
    createOrdersItem,
    updateOrdersItem,
    deleteOrdersItem,
    deleteOrdersRemark,
    createOrdersRemark,
    updateOrdersLogistics,
    getOrdersLogisticsTypeList,
    createOrdersPaymentItem,
    updateOrdersPaymentItem,
    deleteOrdersPaymentItem,
    getOrdersPayProofList,
    getOrdersSFLogisticsNumber,
    getOrdersYTOLogisticsNumber,
    getOrdersDepponLogisticsNumber,
    getOrdersAreaList,
    checkOrders,
    deliverOrders,
    getOrdersItemList,
    deliverSecondaryShopOrders,
    cancelSecondaryShopOrders
  } from '@/api/orders'
  import { getWarehouseList } from '@/api/product'
  import waves from '@/directive/waves' // 水波纹指令
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  // import { regionData, CodeToText } from 'element-china-area-data'
  import { getLodop } from '@/directive/lodop/LodopFuncs'
  import { mapGetters } from 'vuex'
  import bus from '@/views/layout/bus'
  import { parseTime } from '@/utils/index'

  export default {
    name: 'secondaryShopOrders',
    components: {
      Multiselect
    },
    directives: {
      waves
    },
    data() {
      const validatePhone = (rule, value, callback) => {
        const myreg = /^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/
        if (!myreg.test(this.innerTemp4.phone)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      const validate = (rule, value, callback) => {
        if (!value) {
          callback(new Error('输入'))
        }
        if (/^\d+(\.\d+)?$/.test(value)) {
          callback()
        } else {
          callback(new Error('输入数字'))
        }
      }
      return {
        show: true,
        scrollTop: 0,
        ifExpandAll: false,
        tableKey1: 0,
        tableKey2: 0,
        productListLoading: false,
        productListOptions: [],
        tableKey3: 1,
        selectArray: [],
        select_ids: [],
        selected_ids: [],
        list: [],
        list2: [],
        orders_items: [],
        ordersItemLoading: false,
        list1: null,
        total: null,
        total1: null,
        listLoading: true,
        chooseId: undefined,
        supportUserAccountLoading: false,
        supportUserAccountOptions: [],
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempactual_pay:{
          actual_pay: undefined
        },
        listQuery: {
          date_range: [
            parseTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), '{y}-{m}-{d}'),
            parseTime(new Date().getTime(), '{y}-{m}-{d}')
          ],
          page: 1,
          page_size: 20,
          weixin_fans_address_receive_name: '',
          weixin_fans_address_phone: '',
          sort: '-id',
          orders_unique_id: '',
          orders_logistics_number: '',
          secondary_shop_orders_id: '',
          support_member_nickname: '',
          support_user_account_group_id: '',
          support_user_account_id: undefined,
          product_weixin_id: '',
          product_id: undefined,
          orders_status: '',
          remark: ''
        },
        listQuery1: {
          date_range: '',
          page: 1,
          page_size: 5,
          product_weixin_id: undefined
        },
        props: {
          value: 'area_number',
          label: 'area_name',
          children: 'children'
        },
        dialogStatus: 'single',
        btnLoading: false,
        warehouseLoading: false,
        warehouseOptions:[],
        productDeliverExtraOptions: [],
        productDeliverExtraLoading: false,
        productDeliverLoading: false,
        productDeliverOptions: [],
        queryLogisticsTypeOptions: [],
        queryLogisticsTypeLoading: false,
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
        productWeixinLoading2: false,
        productWeixinOptions2: [],
        pickerOptions1: {},
        expandList: [],
        userGroupOptions:[],
        userGroupTree: [],
        defaultPropsGroup: {
          children: 'child',
          label: 'group_name',
          value: 'id'
        },
        temp: {
          id: null,
          product_goods_id: null,
          number: 0
        },
        rules1: {
          product_goods_id: [{ required: true, message: '选择商品', trigger: 'change' }],
          number: [{ required: true, message: '商品数量', trigger: 'change' }]
        },
        innerList1: null,
        innerTotal1: null,
        innerTableKey1: 1,
        innerTableTitle1: '',
        innerListQuery1: {
          page: 1,
          page_size: 5,
          product_id: undefined,
          sort: '-id'
        },
        innerTemp1: {
          id: undefined,
          product_goods: {
            id:undefined
          },
          warehouse_id: undefined,
          number: ''
        },
        innerListLoading1: false,
        innerTableVisible1: false,
        batchVisible: false,
        innerDialogFormVisible1: false,
        innerRules4: {
          phone: [{ required: true, trigger: 'blur', validator: validatePhone }]
        },
        innerRules1: {
          number: [{ required: true, trigger: 'change', validator: validate }],
          product_goods: {
            id: [{ required: true, trigger: 'change', message: '选择产品' }]
          }
        },
        innerList2: null,
        innerTotal2: null,
        innerTableKey2: 2,
        innerTableTitle2: '',
        innerListQuery2: {
          page: 1,
          page_size: 5,
          product_id: undefined,
          sort: '-id'
        },
        innerTemp2: {
          id: undefined,
          product: undefined,
          number: ''
        },
        innerListLoading2: false,
        innerDialogFormVisible2: false,
        innerRules2: {
          remark: [{ required: true, message: '输入备注信息内容', trigger: 'change' }]
        },
        innerListLoading3: false,
        innerTableVisible3: false,
        innerTableTitle3: '',
        innerTableKey3: 3,
        innerList3: null,
        innerTotal3: null,
        innerListQuery3: {
          page: 1,
          page_size: 10,
          sort: '-id',
          orders_id: undefined
        },
        innerTemp3: {
          id: undefined,
          logistics_type_id: undefined,
          product_deliver_extra_id: undefined,
          logistics_name: '',
          logistics_number: '',
          product_deliver_id: undefined,
          dest_code: '',
          dest_extra_code: '',
          orders_logistics_type: {
            code: '',
            id: '',
            name: ''
          }
        },
        innerDialogFormVisible3: false,
        innerRules3: {
          template_name: [{ required: true, message: '请正确填写模板名称', trigger: 'change' }],
          template_code: [{ required: true, message: '请正确填写模板内容', trigger: 'change' }]
        },
        innerList4: null,
        innerTotal4: null,
        innerTableKey4: 4,
        innerTableTitle4: '',
        innerListQuery4: {
          page: 1,
          page_size: 5,
          product_id: undefined,
          sort: '-id'
        },
        innerListLoading4: false,
        innerTableVisible4: false,
        innerDialogFormVisible4: false,
        innerList5: null,
        innerTotal5: null,
        innerTableKey5: 5,
        innerTableTitle5: '',
        innerTemp5: {
          id: undefined,
          orders_pay_type: {
            type_name: undefined
          },
          orders_pay_type_id: undefined,
          paid_money: undefined,
          orders_pay_proof_id: undefined
        },
        innerListLoading5: false,
        innerTableVisible5: false,
        innerDialogFormVisible5: false,
        innerRules5: {
          orders_pay_type_id: [{ required: true, message: '选择方式', trigger: 'change' }],
          paid_money: [{ required: true, message: '输入金额或选择凭证', trigger: 'change' }]
        },
        productType: {
          1: '推广',
          2: '附属产品',
          3: '赠品'
        },
        productTypeOptions: [
          { key: 1, display_name: '推广' },
          { key: 2, display_name: '附属产品' },
          { key: 3, display_name: '赠品' }
        ],
        userGroupOptions: [],
        supportMemberOptions: [],
        productWeixinOptions: [],
        productWeixinFansOptions: [],
        productOptions: [],
        productGoodsOptions: [],
        logisticsTypeOptions: [],
        payTypeOptions: [],
        if_deleted: 'deleted-p',
        regionData: [],
        tempProductId: undefined,
        selectedRegionOptions: [],
        // CodeToText: CodeToText,
        publicImageUrl: '',
        imageDialogVisible: false,
        tableDialogVisible: false,
        payTypeLoading: false,
        payProofVisiable: false,
        payProofImageUrl: undefined,
        innerTablePayProofVisible: false,
        ordersPayProofList: [],
        paidMoneyEnabled: false,
        payTypeDisabled: true,
        actualPayEditable: false,
        stepStatus: 'create',
        today_orders: 0,
        need_delivery: 0,
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
        },
        delivery_address: '',
        delivery_product_name: '',
        sf_monthly_account: '',
        tempPay: undefined,
      }
    },
    computed: {
      ...mapGetters([
        'user_account_id',
        'roles'
      ])
    },
    watch: {
      batchVisible(newValue) {
        if (!newValue) {
          this.getList()
          // this.$refs['secondaryTable'].clearSelection()
        }
      },
      list(newValue) {
        // this.selected_ids.forEach()
      }
    },
    filters: {
      statusUnit(status) {
        const statusTransMap = {
          0: '件',
          1: '斤',
          2: 'g'
        }
        return statusTransMap[status]
      },
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
          1: 'info',
          2: 'warning',
          3: 'success',
          4: 'danger',
          5: 'success',
          6: 'danger',
          7: 'success',
          8: 'danger',
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
          9: '废弃'
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
      },
      orderPhoneVisibleTranslator(phone) {
        // this.$store.state.user.roles
        if (phone) {
          return phone.substr(0, 3) + '****' + phone.substr(7)
        } else {
          return phone
        }
      }
    },
    created() {
      this.getList()
      this.getWarehouseList()
      // this.getSystemDeliveryAddress()
      // this.getSystemDeliveryProductName()
      // this.getSystemSfMonthlyAccount()
      this.getregionData()
    },
    methods: {
      selectTablechange(selection) {
        this.list2 = selection
        this.select_ids = selection.map(item => {
          return item.secondary_id
        })
      },
      editactualPay(val) {
        this.tempactual_pay.actual_pay = val
        this.actualPayEditable = true
      },
      formatUserGroupTree(tree) {
        const Group = tree.map(item => {
          if (item.child.length > 0) {
            item.child = this.formatUserGroupTree(item.child)
            return item
          } else {
            delete item.child
            return item
          }
        })
        return Group
      },
      getWarehouseLogisticsExtraList(query) {
        if (query !== '') {
          this.productDeliverExtraLoading = true
          getWarehouseLogisticsExtraList({
            order_logistics_type_id: this.logisticsTypeOptions[this.logisticsTypeOptions.findIndex(d => d.code === this.innerTemp3.orders_logistics_type.code)].id,
            warehouse_id: this.innerTemp3.warehouse_id,
            description: query
          }).then(response => {
            this.productDeliverExtraOptions = response.data
            this.productDeliverExtraLoading = false
          })
        }
      },
      getSupportUserAccountList(query) {
        if (query !== '') {
          this.supportUserAccountLoading = true
          getSupportMemberList({ nickname: query, status: 1 }).then(response => {
            this.supportUserAccountOptions = response.data.data
            this.supportUserAccountLoading = false
          })
        }
      },
      handleUpdate(row) {
        console.log(row)
        this.innerTableTitle1 = row.orders_unique_id.slice(-8) + ' 商品列表'
        this.temp.secondary_id = row.secondary_id
        if (row.orders_items) {
          this.productGoodsOptions = [
            {
              id: row.orders_items[0].product_goods_id,
              label: row.orders_items[0].product_goods.goods_name,
            }
          ]
          this.temp.number = row.orders_items[0].number
          this.temp.product_goods_id = row.orders_items[0].product_goods_id
        } else {
          this.temp.product_goods_id = undefined
          this.temp.number = undefined
        }
        this.dialogStatus = 'single'
        this.innerTableVisible1 = true
        this.$nextTick(() => {
          this.$refs['innerDataForm1'].clearValidate()
        })
      },
      updateSecondary() {
        this.$refs['innerDataForm1'].validate((valid) => {
          if (valid) {
            updateSecondaryShopOrdersItems(this.temp).then(() => {
              this.getList()
              this.innerTableVisible1 = false
              this.$notify({
                title: '成功',
                message: '商品添加成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDeliverSecondaryShopOrders({orders_id}) {
        deliverSecondaryShopOrders({
          orders_id
        }).then(() => {
          this.getList()
          this.$message.success('发货成功')
        })
      },
      handleCancelSecondaryShopOrders({orders_id}) {
        cancelSecondaryShopOrders({
          orders_id
        }).then(() => {
          this.getList()
          this.$message.success('废弃成功')
        })
      },
      resetTemp() {
        this.temp = {
          id: null,
          product_goods_id: null,
          number: 0
        }
      },
      handleBatch() {
        this.batchVisible = true
      },
      batchUpdateconfirm() {
        this.getList()
        this.$refs['secondaryTable'].clearSelection()
        this.batchVisible = false
      },
      handleBatchSettingsProduct() {
        this.productGoodsOptions = []
        this.temp.product_goods_id = undefined
        this.temp.number = undefined
        this.innerTableTitle1 = '批量设置商品'
        this.innerTableVisible1 = true
        this.dialogStatus = 'batch'
        this.$nextTick(() => {
          this.$refs['innerDataForm1'].clearValidate()
        })
      },
      handleBatchUpdateOrdersStatus() {
        this.$confirm('批量确认订单后不可修改商品,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          for (const secondary_id of this.select_ids) {
            updateSecondaryShopOrdersStatus({
              secondary_id,
              status: 2
            }).then(() => {
              this.list2[this.select_ids.indexOf(secondary_id)].status = 2
            }).catch(rej => {
              console.log(rej)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      delectSelect(row){
        console.log(row)
        const { id } = row
        const item = this.list.find(item => {
          return item.id === id
        })
        const index = this.list2.findIndex(item => {
          return item.id === id
        })
        console.log(!!item)
        if (item) {
          this.$nextTick(() => {
            this.$refs['secondaryTable'].toggleRowSelection(item,false)
          })
        } else {
          this.list2.splice(index,1)
          this.select_ids.splice(index,1)
        }
      },
      batchSettingsProduct() {
        this.$refs['innerDataForm1'].validate( valid => {
          if (valid) {
            this.innerTableVisible1 = false;
            (async () => {
              for (const secondary_id of this.select_ids) {
                const params = {
                  secondary_id,
                  product_goods_id: this.temp.product_goods_id,
                  number: this.temp.number
                }
                await updateSecondaryShopOrdersItems(params).then(res => {
                  this.list2[this.select_ids.indexOf(secondary_id)].orders_items = res.data.orders_items
                }).catch(rej => {
                  console.log(rej)
                })
              }
            })().then(() => {
              this.$message.success('设置成功')
            })
          }
        })
      },
      handleFilterGrounp(val) {
        this.listQuery.support_user_account_group_id = val[val.length - 1]
        this.handleFilter()
      },
      getregionData() {
        getOrdersAreaList().then(response => {
          this.regionData = response.data
        })
      },
      // getSystemDeliveryAddress() {
      //   getSystemGlobalSettingInfo({ key_name: 'delivery_address' }).then(response => {
      //     this.delivery_address = response.data.key_value
      //   })
      // },
      // getSystemDeliveryProductName() {
      //   getSystemGlobalSettingInfo({ key_name: 'delivery_product_name' }).then(response => {
      //     this.delivery_product_name = response.data.key_value
      //   })
      // },
      // getSystemSfMonthlyAccount() {
      //   getSystemGlobalSettingInfo({ key_name: 'sf_monthly_account' }).then(response => {
      //     this.sf_monthly_account = response.data.key_value
      //   })
      // },
      refreshOrdersList() {
        this.getList()
      },
      resetLogisticsNumber2() {
        if (this.innerTemp3.orders_logistics_type.code === '1001') {
          this.$confirm('选择顺丰快递将不可以修改订单内容， 确定选择？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(this.temp.orders_secondary_receiver_info.province_name + this.temp.orders_secondary_receiver_info.city_name + this.temp.orders_secondary_receiver_info.district_name + this.temp.orders_secondary_receiver_info.address)
            const tempdata = {}
            tempdata.orders_id = this.temp.id
            tempdata.warehouse_extra_id = this.innerTemp3.product_deliver_extra_id
            tempdata.address = this.temp.orders_secondary_receiver_info.province_name + this.temp.orders_secondary_receiver_info.city_name + this.temp.orders_secondary_receiver_info.district_name + this.temp.orders_secondary_receiver_info.address
            getOrdersSFLogisticsNumber(tempdata).then(response => {
              this.innerTemp3.logistics_number = response.data.logistics_number
              this.innerTemp3.dest_code = response.data.dest_code
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else if (this.innerTemp3.orders_logistics_type.code === '1006') {
          this.$confirm('选择圆通将不可以修改订单内容， 确定选择？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const tempdata = {}
            tempdata.orders_id = this.temp.id
            tempdata.warehouse_extra_id	 = this.innerTemp3.product_deliver_extra_id
            let tempCity = this.temp.orders_secondary_receiver_info.city_name
            if ((tempCity === undefined) || (tempCity === null)) {
              tempCity = ''
            }
            let tempDistrict = this.temp.orders_secondary_receiver_info.district_name
            if ((tempDistrict === undefined) || (tempDistrict === null)) {
              tempDistrict = ''
            }
            tempdata.address = this.temp.orders_secondary_receiver_info.province_name + tempCity + tempDistrict + this.temp.orders_secondary_receiver_info.address
            getOrdersYTOLogisticsNumber(tempdata).then(response => {
              this.innerTemp3.logistics_number = response.data.logistics_number
              this.innerTemp3.dest_code = response.data.dest_code
              this.innerTemp3.dest_extra_code = response.data.dest_extra_code
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else if (this.innerTemp3.orders_logistics_type.code === '1009') {
          this.$confirm('选择德邦将不可以修改订单内容， 确定选择？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const tempdata = {}
            tempdata.orders_id = this.temp.id
            tempdata.warehouse_extra_id	 = this.innerTemp3.product_deliver_extra_id
            getOrdersDepponLogisticsNumber(tempdata).then(response => {
              this.innerTemp3.logistics_number = response.data.logistics_number
              this.innerTemp3.dest_code = response.data.dest_code
              this.innerTemp3.dest_extra_code = response.data.dest_extra_code
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      },
      resetLogisticsNumber() {
        this.productDeliverExtraOptions = []
        this.innerTemp3.logistics_number = ''
        this.innerTemp3.dest_code = undefined
        this.innerTemp3.product_deliver_extra_id = undefined
      },
      resetLogisticsNumber3() {
        this.productDeliverOptions = []
        this.productDeliverExtraOptions = []
        this.logisticsTypeOptions = []
        this.innerTemp3.logistics_number = ''
        this.innerTemp3.dest_code = undefined
        this.innerTemp3.product_deliver_extra_id = undefined
        this.innerTemp3.orders_logistics_type = ''
      },
      handleChangePayType(value) {
        if (value !== 1 && value !== 2) {
          this.payProofVisiable = true
          this.paidMoneyEnabled = true
        } else {
          this.payProofVisiable = false
          this.paidMoneyEnabled = false
        }
        this.innerTemp5.paid_money = undefined
        this.payProofImageUrl = undefined
        this.innerTemp5.orders_pay_proof_id = undefined
      },
      handleAddressRowClick(row, column, cell, event) {
        if (cell.cellIndex === 3) {
          this.temp.product_weixin_fans_address_id = row.id
        }
        this.innerTemp4 = Object.assign({}, row) // copy obj
      },
      handleRegionChange(value) {
      },
      tableRowClassName({ row, rowIndex }) {
        return 'colored-row'
      },
      querySupportMemberList(query) {
        getSupportMemberList({ nickname: query, user_account_type_code: 'support', status: '1' }).then(response => {
          if (!response.data.data) return
          this.supportMemberOptions = response.data.data
        })
      },
      getWarehouseList() {
        this.warehouseLoading = true
        getWarehouseList().then(response => {
          this.warehouseOptions = response.data.data
          this.warehouseLoading = false
        })
      },
      queryProductGoodsList(query) {
        getProductGoodsList({ goods_name: query, page_size: 20,is_sale: 1 }).then(response => {
          this.productGoodsOptions = response.data.data.map(item => {
            return {
              id: item.id,
              label: item.goods_name,
            }
          })
        })
      },
      queryLogisticsTypeList() {
        this.queryLogisticsTypeLoading = true
        getOrdersLogisticsTypeList().then(res => {
          this.logisticsTypeOptions = res.data.data
          this.queryLogisticsTypeLoading = false
        })
      },
      resetSupportMember() {
        this.temp.product_weixin_id = undefined
        this.productWeixinOptions = []
        this.temp.product_weixin = {
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
          product: {
            id: undefined,
            product_name: '',
            price: undefined,
            stock: undefined,
            is_promote: undefined
          }
        }
        this.resetProductWeixin()
      },
      resetProductWeixin() {
        this.temp.product_weixin_fans_id = undefined
        this.productWeixinFansOptions = []
        this.temp.product_weixin_fans = {
          id: undefined,
          product_weixin_id: undefined,
          weixin_account: '',
          weixin_nickname: '',
          created_at: ''
        }
        this.resetProductWeixinFans()
      },
      resetProductWeixinFans() {
        this.temp.product_weixin_fans_address_id = undefined
        this.temp.product_weixin_fans_address = {
          id: undefined,
          product_weixin_fans_id: undefined,
          receive_name: '',
          phone: '',
          postcode: '',
          address: '',
          remark: ''
        }
      },
      getList() {
        this.listLoading = true
        getSecondaryShopOrdersList(this.listQuery).then(response => {
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
      handleCreate() {
        this.resetTemp()
        this.stepStatus = 'create'
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm1'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm1'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            this.temp.support_user_account_id = this.temp.support_member.id
            this.temp.product_weixin_id = this.temp.product_weixin.id
            this.temp.product_weixin_fans_id = this.temp.product_weixin_fans.product_weixin_fans_id
            this.temp.warehouse_id = this.temp.warehouse_id
            createOrders(this.temp).then(response => {
              this.btnLoading = false
              this.temp = response.data
              this.getList()
              this.dialogFormVisible = false
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm1'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.orders_id = this.temp.id
            tempData.support_user_account_id = this.temp.support_member.id
            tempData.product_weixin_id = this.temp.product_weixin.id
            tempData.product_weixin_fans_id = this.temp.product_weixin_fans.product_weixin_fans_id
            updateOrders(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleCashOnDeliveryPaidMoney() {
        let totalPayMoney = 0.00
        console.log(this.temp.orders_payment.orders_payment_items)
        for (const v of this.temp.orders_payment.orders_payment_items) {
          if (v.orders_pay_type.type_code !== 'cash_on_delivery' && (v.status !== 2)) {
            totalPayMoney += parseFloat(v.paid_money)
          }
        }
        let cashOnDeliveryPaidMoney = this.temp.actual_pay - totalPayMoney
        cashOnDeliveryPaidMoney = (cashOnDeliveryPaidMoney > 0) ? cashOnDeliveryPaidMoney : 0.00
        for (const v of this.temp.orders_payment.orders_payment_items) {
          if (v.orders_pay_type.type_code === 'cash_on_delivery') {
            v.paid_money = cashOnDeliveryPaidMoney
            const index = this.temp.orders_payment.orders_payment_items.indexOf(v)
            this.temp.orders_payment.orders_payment_items.splice(index, 1, v)
          }
        }
      },
      getOrdersItemList() {
        this.ordersItemLoading = true
        getOrdersItemList({ orders_id: this.temp.id }).then(res => {
          this.orders_items = res.data.data
          this.ordersItemLoading = false
          this.innerTableKey1++
        })
      },
      handleInnerCreate1() {
        console.log(this.temp)
        this.dialogStatus = 'create'
        this.innerDialogFormVisible1 = true
        this.innerTemp1.product_id = this.temp.id
        this.innerTemp1.warehouse_id = this.temp.warehouse_id
        this.$nextTick(() => {
          this.$refs['innerDataForm1'].clearValidate()
        })
      },
      createInnerData1() {
        this.$refs['innerDataForm1'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            this.innerTemp1.product_goods_id = this.innerTemp1.product_goods.id
            // this.innerTemp1.product_goods_storage_id = this.innerTemp1.product_common.id
            this.innerTemp1.orders_id = this.temp.id
            createOrdersItem(this.innerTemp1).then(res => {
              this.getOrdersItemList()
              this.getList()
              this.innerDialogFormVisible1 = false
              this.btnLoading = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      handleInnerUpdate1(row) {
        this.innerTemp1 = Object.assign({}, row) // copy obj
        this.productGoodsOptions = []
        this.productGoodsOptions.push(row.product_goods)
        this.dialogStatus = 'update'
        this.innerDialogFormVisible1 = true
        this.$nextTick(() => {
          this.$refs['innerDataForm1'].clearValidate()
        })
      },
      // 修改订单商品
      updateInnerData1() {
        this.$refs['innerDataForm1'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            const params = Object.assign({}, this.innerTemp1)
            params.orders_item_id = this.innerTemp1.id
            params.product_goods_id = this.innerTemp1.product_goods.id
            updateOrdersItem(params).then(() => {
              this.getOrdersItemList()
              this.getList()
              this.innerDialogFormVisible1 = false
              this.btnLoading = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      handleInnerDelete1(row) {
        this.$confirm('确定删除订单商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOrdersItem({ orders_item_id: row.id }).then(res => {
            this.$message.success('删除成功')
            this.getOrdersItemList()
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      resetInnerTemp2() {
        this.innerTemp2 = {}
      },
      handleInnerCreate2() {
        this.resetInnerTemp2()
        this.dialogStatus = 'create'
        this.innerDialogFormVisible2 = true
        this.$nextTick(() => {
          this.$refs['innerDataForm1'].clearValidate()
        })
      },
      createInnerData2() {
        this.$refs['innerDataForm2'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            this.innerTemp2.orders_id = this.temp.id
            createOrdersRemark(this.innerTemp2).then(response => {
              this.innerTotal2++
              this.innerTemp2.id = response.data.id
              this.innerTemp2.user_account_id = response.data.user_account_id
              this.innerTemp2.status = 1
              this.innerTemp2.user_account_type_id = response.data.user_account_type_id
              this.innerTemp2.updated_at = response.data.updated_at
              this.temp.orders_remarks.push(this.innerTemp2)
              this.innerDialogFormVisible2 = false
              this.btnLoading = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      handleInnerDelete2(row) {
        this.$confirm('确定删除此备注?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ttempData = Object.assign({}, row) // copy obj
          ttempData.orders_remark_id = row.id
          deleteOrdersRemark(ttempData).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            ttempData.status = 0
            const index = this.temp.orders_remarks.indexOf(row)
            this.temp.orders_remarks.splice(index, 1, ttempData)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      resetInnerTemp3() {
        this.innerTemp3 = {
          id: undefined,
          logistics_type_id: undefined,
          product_deliver_extra_id: undefined,
          product_deliver_id: undefined,
          logistics_name: '',
          logistics_number: '',
          orders_logistics_type: {
            id: undefined,
            name: '',
            code: '',
            status: undefined
          }
        }
      },
      handleInnerUpdate3(row) {
        this.logisticsTypeOptions = []
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.innerDialogFormVisible3 = true
        if (row.orders_logistics !== null) {
          this.logisticsTypeOptions.push({
            id: row.orders_logistics.orders_logistics_type.id,
            name: row.orders_logistics.orders_logistics_type.name,
            code: row.orders_logistics.orders_logistics_type.code
          })
          this.innerTemp3 = Object.assign({}, row.orders_logistics)
          if (row.orders_logistics.product_deliver_extra !== null) {
            this.productDeliverExtraOptions = [{
              id: row.orders_logistics.product_deliver_extra.id,
              description: row.orders_logistics.product_deliver_extra.description
            }]
            this.innerTemp3.product_deliver_extra_id = this.innerTemp3.product_deliver_extra.id
          }
          // this.productDeliverOptions = [{
          //   id: row.orders_logistics.product_deliver.id,
          //   name: row.orders_logistics.product_deliver.name
          // }]
        } else {
          this.resetInnerTemp3()
          this.productDeliverOptions = []
          this.logisticsTypeOptions = []
          this.innerTemp3.orders_logistics_type = ''
        }
        this.$nextTick(() => {
          this.$refs['innerDataForm3'].clearValidate()
        })
      },
      createInnerData3() {
        this.$refs['innerDataForm3'].validate((valid) => {
          if (valid) {
            const tempData = this.innerTemp3
            tempData.orders_id = this.temp.id
            tempData.logistics_type_id = this.innerTemp3.orders_logistics_type.id
            updateOrdersLogistics(tempData).then(response => {
              this.temp.orders_logistics = tempData
              this.innerDialogFormVisible3 = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      expandRow(row, expandedRows) {
        this.expandList = expandedRows.map(item => {
          return item.id
        })
        console.log(this.expandList)
      },
      handleOpenImage(imageUrl) {
        this.publicImageUrl = imageUrl
        this.imageDialogVisible = true
      },
      checkPre(row) {
        console.log(row)
        this.tableDialogVisible = true
        this.listQuery1.product_weixin_fans_id = row.product_weixin_fans_id
        this.getList2()
      },
      getList2() {
        this.listLoading = true
        getOrdersList(this.listQuery1).then(response => {
          this.list1 = response.data.data
          this.total1 = response.data.total
          this.listLoading = false
        })
      },
      downExcel() {
        // console.log(this.listQuery.date_range)
        const form = document.createElement('form')
        form.action = process.env.BASE_API + '/api/secondary_shop/downloadSecondaryShopOrders' + '?token=' + this.$store.state.user.token
        form.method = 'post'
        form.style.display = 'none'
        const orders_status = document.createElement('input')
        // 订单状态
        const orders_unique_id = document.createElement('input')
        // 订单号
        const orders_logistics_number = document.createElement('input')
        // 物流单号
        const group_name = document.createElement('input')
        const secondary_shop_orders_id = document.createElement('input')
        // 客服部门
        const nickname = document.createElement('input')
        // 客服
        const product_weixin_id = document.createElement('input')
        // 搜索微信号
        const product_name = document.createElement('input') // 产品名称
        const receive_name = document.createElement('input')
        // 收件人姓名
        const receive_phone = document.createElement('input')
        // 收件人电话
        const remark = document.createElement('input')
        // 备注
        if (this.listQuery.date_range !== null && this.listQuery.date_range !== undefined && this.listQuery.date_range !== '') {
          const date_range = document.createElement('input')
          const date_range2 = document.createElement('input')
          date_range.name = 'date_range[0]'
          date_range.value = this.listQuery.date_range[0]
          date_range2.name = 'date_range[1]'
          date_range2.value = this.listQuery.date_range[1]
          form.appendChild(date_range)
          form.appendChild(date_range2)
        } else {
          const date_range = document.createElement('input')
          const date_range2 = document.createElement('input')
          date_range.name = 'date_range[0]'
          date_range.value = parseTime(new Date(), '{y}-{m}-{d}')
          date_range2.name = 'date_range[1]'
          date_range2.value = parseTime(new Date(), '{y}-{m}-{d}')
          form.appendChild(date_range)
          form.appendChild(date_range2)
          // console.log(parseTime(new Date(), '{y}-{m}-{d}'))
        }
        orders_status.name = 'orders_status'
        orders_status.value = this.listQuery.orders_status
        orders_unique_id.name = 'orders_unique_id'
        orders_unique_id.value = this.listQuery.orders_unique_id
        orders_logistics_number.name = 'orders_logistics_number'
        orders_logistics_number.value = this.listQuery.orders_logistics_number
        secondary_shop_orders_id.name = 'secondary_shop_orders_id'
        secondary_shop_orders_id.value = this.listQuery.secondary_shop_orders_id

        group_name.name = 'support_user_account_group_id'
        group_name.value = this.listQuery.support_user_account_group_id
        nickname.name = 'support_member_nickname'
        nickname.value = this.listQuery.support_member_nickname
        product_weixin_id.name = 'product_weixin_id'
        product_weixin_id.value = this.listQuery.product_weixin_id

        product_name.name = 'product_name'
        product_name.value = this.listQuery.product_name
        receive_name.name = 'weixin_fans_address_receive_name'
        receive_name.value = this.listQuery.weixin_fans_address_receive_name
        receive_phone.name = 'weixin_fans_address_phone'
        receive_phone.value = this.listQuery.weixin_fans_address_phone
        remark.name = 'remark'
        remark.value = this.listQuery.remark

        form.appendChild(orders_status)
        form.appendChild(orders_unique_id)
        form.appendChild(orders_logistics_number)
        form.appendChild(secondary_shop_orders_id)
        form.appendChild(group_name)
        form.appendChild(nickname)
        form.appendChild(product_weixin_id)
        form.appendChild(product_name)
        form.appendChild(receive_name)
        form.appendChild(receive_phone)
        form.appendChild(remark)

        const button = document.createElement('input')
        button.type = 'submit'
        form.appendChild(button)
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
      },
      printOrders(row) {
        console.log(JSON.parse(JSON.stringify(row)))
        if (row.orders_sender_info.sender_name === undefined || row.orders_sender_info.sender_name === '' || row.orders_sender_info.sender_name === null) {
          this.$message({
            type: 'error',
            message: '请先设置发件人姓名'
          })
          return
        }
        if (row.orders_sender_info.sender_phone === undefined || row.orders_sender_info.sender_phone === '' || row.orders_sender_info.sender_phone === null) {
          this.$message({
            type: 'error',
            message: '请先设置发件人电话'
          })
          return
        }
        if (row.orders_secondary_receiver_info === undefined || row.orders_secondary_receiver_info === '' || row.orders_secondary_receiver_info === null) {
          this.$message({
            type: 'error',
            message: '请先设置收件人信息'
          })
          return
        }
        if (row.orders_secondary_receiver_info.receive_name === undefined || row.orders_secondary_receiver_info.receive_name === '' || row.orders_secondary_receiver_info.receive_name === null) {
          this.$message({
            type: 'error',
            message: '请先设置收件人姓名'
          })
          return
        }
        if (row.orders_secondary_receiver_info.phone === undefined || row.orders_secondary_receiver_info.phone === '' || row.orders_secondary_receiver_info.phone === null) {
          this.$message({
            type: 'error',
            message: '请先设置收件人电话'
          })
          return
        }
        if (row.orders_secondary_receiver_info.address === undefined || row.orders_secondary_receiver_info.address === '' || row.orders_secondary_receiver_info.address === null) {
          this.$message({
            type: 'error',
            message: '请先设置收货地址'
          })
          return
        }
        if (row.orders_secondary_receiver_info.province_name === null || row.orders_secondary_receiver_info.city_name === null || row.orders_secondary_receiver_info.district_name === null) {
          this.$message({
            type: 'error',
            message: '请先设置收货地址'
          })
          return
        }
        if (row.orders_unique_id === undefined || row.orders_unique_id === '' || row.orders_unique_id === null) {
          this.$message({
            type: 'error',
            message: '系统错误, 订单号不能为空'
          })
          return
        }
        if (row.orders_logistics === undefined || row.orders_logistics === '' || row.orders_logistics === null) {
          this.$message({
            type: 'error',
            message: '填写物流信息'
          })
          return
        }
        if (row.orders_logistics.logistics_number === undefined || row.orders_logistics.logistics_number === '' || row.orders_logistics.logistics_number === null) {
          this.$message({
            type: 'error',
            message: '物流单号不能为空'
          })
          return
        }
        if (row.orders_logistics.orders_logistics_type.code === undefined || row.orders_logistics.orders_logistics_type.code === '' || row.orders_logistics.orders_logistics_type.code === null) {
          this.$message({
            type: 'error',
            message: '请先填写物流信息'
          })
          return
        }
        let cash_on_delivery = 0
        const orders_payment_items = row.orders_payment.orders_payment_items
        for (const v of orders_payment_items) {
          if (v.pay_type_id === 2) {
            cash_on_delivery = parseFloat(v.paid_money)
          }
        }
        const logistics_code = row.orders_logistics.orders_logistics_type.code
        const jphone = row.orders_secondary_receiver_info.phone
        const timestamp = new Date()
        const jjname = row.orders_sender_info.sender_name// 寄件人姓名
        const jjtel = row.orders_sender_info.sender_phone//  寄件人电话
        const jjaddress = row.warehouse.delivery_address// 寄件人地址
        const sjname = row.orders_secondary_receiver_info.receive_name//  收件人姓名
        const sjtel = jphone.substr(0, 3) + '****' + jphone.substr(7)// 收件人电话
        const sjaddress = row.orders_secondary_receiver_info.province_name + row.orders_secondary_receiver_info.city_name + row.orders_secondary_receiver_info.district_name + row.orders_secondary_receiver_info.address//  收件人地址
        const mailno = row.orders_logistics.logistics_number//  运单号码
        const destcode = row.orders_logistics.dest_code//  目的地代码
        const dest_extra_code = row.orders_logistics.dest_extra_code//  目的地代码
        let yuejiehao = ''
        if (row.orders_logistics.product_deliver_extra !== null) {
          yuejiehao = row.orders_logistics.product_deliver_extra.configs.sf_monthly_account//  月结号
        }
        const now = new Date()
        const now_date = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()
        const now_seconds = (now.getSeconds() + '').length > 1 ? now.getSeconds() : '0' + now.getSeconds()
        const now_time = now.getHours() + ':' + now.getMinutes() + ':' + now_seconds
        const sign_need_read = '快件送达收件人地址，经收件人或收件人（寄件人）允许的代收人签字，视为送达。您的签字代表您已验收此包裹，并已确认商品信息无误、包装完好、没有划痕、破损等表面质量问题。'
        let chanpin = ''
        if (row.orders_logistics.product_deliver_extra !== null) {
          chanpin = row.orders_logistics.product_deliver_extra.configs.delivery_product_name//  月结号
        }
        const money = cash_on_delivery//  代收货款金额
        const dingdanid = row.orders_unique_id//  自己的订单号
        let goods_detail = ''
        for (const v of row.orders_items) {
          goods_detail += v.product_goods.goods_name + ' x ' + v.number + '、 '
        }
        goods_detail = goods_detail.substring(0, goods_detail.length - 2)
        const chinese_number_map = []
        chinese_number_map[0] = '零'
        chinese_number_map[1] = '壹'
        chinese_number_map[2] = '贰'
        chinese_number_map[3] = '叁'
        chinese_number_map[4] = '肆'
        chinese_number_map[5] = '伍'
        chinese_number_map[6] = '陆'
        chinese_number_map[7] = '柒'
        chinese_number_map[8] = '捌'
        chinese_number_map[9] = '玖'
        const money6666 = money
        const money_str = (parseInt(money6666) + '')
        const money_length = money_str.length
        let money1 = 0
        let money10 = 0
        let money100 = 0
        let money1000 = 0
        let money10000 = 0
        if (money_length > 0) {
          money1 = parseInt(money_str.substr(-1, 1))
        }
        if (money_length > 1) {
          money10 = parseInt(money_str.substr(-2, 1))
        }
        if (money_length > 2) {
          money100 = parseInt(money_str.substr(-3, 1))
        }
        if (money_length > 3) {
          money1000 = parseInt(money_str.substr(-4, 1))
        }
        if (money_length > 4) {
          money10000 = parseInt(money_str.substr(-5, 1))
        }
        const LODOP = getLodop()

        LODOP.PRINT_INIT('生物科技')
        if (logistics_code === '1001') {
          // 1001 顺丰热敏打印
          if (row.orders_logistics.dest_code === undefined || row.orders_logistics.dest_code === '' || row.orders_logistics.dest_code === null) {
            this.$message({
              type: 'error',
              message: '地区编码不能为空'
            })
            return
          }
          LODOP.SET_PRINT_PAGESIZE(1, '100mm', '210mm', '')
          LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '100mm')
          LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '210mm')
          // 画线
          LODOP.ADD_PRINT_LINE('13mm', '2mm', '13mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('33mm', '2mm', '33mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('46mm', '2mm', '46mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('59mm', '2mm', '59mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('68mm', '2mm', '68mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('81mm', '2mm', '81mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('90mm', '2mm', '90mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('105mm', '2mm', '105mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('115mm', '2mm', '115mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('125mm', '2mm', '125mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('153mm', '2mm', '153mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('168mm', '2mm', '168mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('178mm', '2mm', '178mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('188mm', '2mm', '188mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('19mm', '75mm', '19mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('13mm', '75mm', '33mm', '75mm', 0, 1)
          LODOP.ADD_PRINT_LINE('33mm', '7mm', '68mm', '7mm', 0, 1)
          LODOP.ADD_PRINT_LINE('59mm', '75mm', '68mm', '75mm', 0, 1)
          LODOP.ADD_PRINT_LINE('81mm', '7mm', '90mm', '7mm', 0, 1)
          LODOP.ADD_PRINT_LINE('81mm', '53mm', '90mm', '53mm', 0, 1)
          LODOP.ADD_PRINT_LINE('81mm', '75mm', '90mm', '75mm', 0, 1)
          LODOP.ADD_PRINT_LINE('90mm', '27mm', '105mm', '27mm', 0, 1)
          LODOP.ADD_PRINT_LINE('105mm', '7mm', '125mm', '7mm', 0, 1)
          LODOP.ADD_PRINT_LINE('153mm', '27mm', '168mm', '27mm', 0, 1)
          LODOP.ADD_PRINT_LINE('168mm', '7mm', '188mm', '7mm', 0, 1)

          if (money > 0) {
            LODOP.ADD_PRINT_TEXT(1, 90, 140, 40, 'COD')
            LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)
          }

          LODOP.ADD_PRINT_TEXT(4, 220, 37, 40, 'E')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

          LODOP.ADD_PRINT_BARCODE('16.51mm', '5mm', '70mm', '12mm', '128C', mailno)

          LODOP.ADD_PRINT_TEXT(53, 287, 100, 20, '顺丰隔日')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

          if (money > 0) {
            LODOP.ADD_PRINT_TEXT(73, 283, 140, 30, '代收货款')
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 17)
            LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
            LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

            LODOP.ADD_PRINT_TEXT(99, 285, 140, 30, '卡号: ' + yuejiehao)
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
            LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

            LODOP.ADD_PRINT_TEXT(109, 287, 140, 30, '¥' + money + '元')
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
            LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          }

          LODOP.ADD_PRINT_TEXT(136, 10, 15, 36, '目\n的\n地')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -3)

          LODOP.ADD_PRINT_TEXT(122, 50, 242, 35, destcode)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

          LODOP.ADD_PRINT_TEXT(184, 10, 15, 36, '收\n件\n人')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -3)

          LODOP.ADD_PRINT_TEXT(177, 30, 332, 20, sjname + '  ' + sjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(193, 30, 366, 35, sjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(225, 10, 15, 36, '寄\n件\n人')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)
          LODOP.ADD_PRINT_TEXT(227, 30, 236, 20, jjname + '  ' + jjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT(239, 30, 263, 20, jjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(263, 10, 100, 20, '付款方式：寄付月结')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(263, 110, 100, 20, '计费重量： ')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(263, 220, 100, 20, '运费： ')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(275, 10, 127, 20, '月结账号：' + yuejiehao)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)

          LODOP.ADD_PRINT_TEXT(309, 10, 15, 36, '托\n寄\n物')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(315, 50, 200, 36, chanpin)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(308, 203, 90, 15, '收件员:')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)
          LODOP.ADD_PRINT_TEXT(320, 203, 100, 9, '寄件日期:' + (timestamp.getMonth() + 1) + '月' + timestamp.getDate() + '日')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)
          LODOP.ADD_PRINT_TEXT(331, 203, 100, 20, '派件员: ')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(308, 291, 100, 20, '签名:')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(328, 308, 125, 20, ' 年  月  日')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)

          LODOP.ADD_PRINT_IMAGE(372, 21, 61, 23, '<img src="../../static/95338.png"/>')
          LODOP.SET_PRINT_STYLEA(0, 'Stretch', 1)
          LODOP.ADD_PRINT_IMAGE(348, 21, 61, 23, '<img src="../../static/sflogo.jpg"/>')
          LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2)

          LODOP.ADD_PRINT_BARCODE(354, 155, '45mm', '10mm', '128C', mailno)

          LODOP.ADD_PRINT_TEXT(403, 10, 15, 36, '寄\n件\n人')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)
          LODOP.ADD_PRINT_TEXT(404, 37, 236, 20, jjname + '  ' + jjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT(416, 37, 260, 20, jjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(440, 10, 15, 36, '收\n件\n人')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(439, 37, 236, 20, sjname + '  ' + sjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT(451, 37, 260, 20, sjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_IMAGE(608, 21, 61, 23, '<img src="../../static/95338.png"/>')
          LODOP.SET_PRINT_STYLEA(0, 'Stretch', 1)
          LODOP.ADD_PRINT_IMAGE(583, 21, 61, 23, '<img src="../../static/sflogo.jpg"/>')
          LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2)

          LODOP.ADD_PRINT_BARCODE(587, 154, '45mm', '10mm', '128C', mailno)

          LODOP.ADD_PRINT_TEXT(639, 10, 15, 36, '寄\n件\n人')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(640, 37, 236, 20, jjname + '  ' + jjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT(655, 37, 260, 20, jjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(676, 10, 15, 36, '收\n件\n人')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(678, 37, 236, 20, sjname + '  ' + sjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(689, 37, 260, 20, sjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          // /*最底下输出自己的订单号*/
          LODOP.ADD_PRINT_TEXT(720, 37, 260, 20, '佰芝堂订单号：【' + dingdanid + '】')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(735, 37, 320, 40, '发货明细：' + goods_detail)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.PREVIEW()
        } else if (logistics_code === '1006') {
          // if (row.orders_logistics.dest_code === undefined || row.orders_logistics.dest_code === '' || row.orders_logistics.dest_code === null) {
          //   this.$message({
          //     type: 'error',
          //     message: '地区编码不能为空'
          //   })
          //   return
          // }
          LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', '')
          LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '100mm')
          LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '180mm')
          // 画线
          LODOP.ADD_PRINT_LINE('14mm', '0mm', '14mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('29mm', '0mm', '29mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('39mm', '0mm', '39mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('54mm', '0mm', '54mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('66mm', '0mm', '66mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('89mm', '0mm', '89mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('109mm', '0mm', '109mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('119mm', '0mm', '119mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('129mm', '0mm', '129mm', '80mm', 0, 1)
          LODOP.ADD_PRINT_LINE('139mm', '0mm', '139mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('148mm', '0mm', '148mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('154mm', '0mm', '154mm', '100mm', 0, 1)
          LODOP.ADD_PRINT_LINE('166mm', '0mm', '166mm', '100mm', 0, 1)

          LODOP.ADD_PRINT_LINE('0mm', '83mm', '14mm', '83mm', 0, 1)
          LODOP.ADD_PRINT_LINE('89mm', '20mm', '109mm', '20mm', 0, 1)
          LODOP.ADD_PRINT_LINE('89mm', '80mm', '109mm', '80mm', 0, 1)
          LODOP.ADD_PRINT_LINE('119mm', '80mm', '139mm', '80mm', 0, 1)

          // if (money > 0) {
          //   LODOP.ADD_PRINT_TEXT(2, 30, 50, 20, 'COD')
          //   LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
          //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20)
          // }
          LODOP.ADD_PRINT_TEXT(20, 160, 180, 20, '代收货款：￥ ' + money)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)

          LODOP.ADD_PRINT_SHAPE(4, 0, '83mm', '17mm', '14mm', 0, 1, '#000000')

          LODOP.SET_PRINT_STYLE('FontColor', '#ffffff')
          LODOP.ADD_PRINT_TEXT('2mm', '86mm', '20mm', '10mm', '代收')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', 3)

          LODOP.ADD_PRINT_TEXT('8mm', '86mm', '20mm', '10mm', '货款')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', 3)

          LODOP.SET_PRINT_STYLE('FontColor', '#000000')
          LODOP.ADD_PRINT_TEXT(56, 30, 600, 36, destcode)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', 'Arial')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 36)

          LODOP.ADD_PRINT_BARCODE('31mm', '50mm', '47mm', '7mm', '128C', dest_extra_code)
          //
          // LODOP.ADD_PRINT_TEXT(184, 10, 15, 36, '收\n件\n人')
          // LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          // LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          // LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -3)

          LODOP.ADD_PRINT_TEXT(155, 40, 332, 20, sjname + '  ' + jphone)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(171, 40, 345, 35, sjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(220, 10, 15, 36, '寄')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(217, 40, 236, 20, jjname + '  ' + jjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT(229, 40, 263, 20, jjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_BARCODE('69mm', '7mm', '90mm', '18mm', '128Auto', mailno)

          LODOP.ADD_PRINT_TEXT(342, 8, 61, 23, now_date)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(352, 8, 61, 23, now_time)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(369, 8, 61, 23, '打印时间')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 9)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(384, 8, 61, 23, '数量：')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(397, 8, 61, 23, '重量：')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(340, 85, 220, 55, sign_need_read)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -2)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_TEXT(397, 248, 81, 23, '签收栏')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -2)

          LODOP.ADD_PRINT_BARCODE(348, 315, '18mm', '18mm', 'QRCode', destcode + '-' + mailno)

          LODOP.ADD_PRINT_BARCODE(417, 155, '50mm', '8mm', '128Auto', mailno)

          LODOP.ADD_PRINT_TEXT(460, 10, 15, 36, '')
          // 收
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(455, 37, 236, 20, sjname + '  ' + jphone)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT(466, 37, 275, 20, sjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -2)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(500, 10, 15, 36, '寄')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(493, 37, 236, 20, jjname + '  ' + jjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT(504, 37, 260, 20, jjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_BARCODE(455, 312, '21mm', '21mm', 'QRCode', 'http://www.baidu.com')

          LODOP.ADD_PRINT_TEXT(530, 10, 145, 36, '圆通速递')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 18)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(533, 185, 245, 36, mailno)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(566, 10, 236, 20, '打印时间：' + now_date + ' ' + now_time)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(566, 200, 236, 20, '数量：      重量：     ')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(584, 10, 15, 36, '')
          // 收
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -5)

          LODOP.ADD_PRINT_TEXT(588, 37, 236, 20, sjname + '  ' + jphone)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -10)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT(599, 37, 275, 20, sjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -2)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          // /*最底下输出自己的订单号*/
          LODOP.ADD_PRINT_TEXT(632, 15, 260, 20, '订单号：【' + dingdanid + '】')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.ADD_PRINT_TEXT(648, 37, 320, 40, '发货明细：' + goods_detail)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -4)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

          LODOP.PREVIEW()
        } else if (logistics_code === '1003') { // 圆通
          LODOP.ADD_PRINT_TEXTA('a', 92, 486, 100, 30, sjname) // a
          LODOP.ADD_PRINT_TEXTA('c', 149, 460, 317, 60, sjaddress + '(提前电联)') // c
          LODOP.ADD_PRINT_TEXTA('d', 93, 133, 75, 28, jjname) // d
          LODOP.ADD_PRINT_TEXTA('h', 370, 246, 112, 40, jjname) // h
          LODOP.ADD_PRINT_TEXTA('l', 200, 164, 130, 25, jjtel) // l
          LODOP.ADD_PRINT_TEXTA('m', 200, 522, 300, 25, jphone) // m
          LODOP.ADD_PRINT_TEXTA('n', 55, 299, 74, 25, dingdanid) // n

          LODOP.SET_PRINT_PAGESIZE(1, '230mm', '127mm', '')
          // LODOP.ADD_PRINT_SETUP_BKIMG('<img border="0" src="../img/yt.jpg?id=9">')
          LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '230mm')
          LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '127mm')
          LODOP.SET_PRINT_STYLEA('All', 'FontSize', 13)
          LODOP.SET_PRINT_STYLEA('All', 'FontName', '宋体')
          LODOP.SET_PRINT_STYLEA('All', 'Bold', 0)
          LODOP.SET_PRINT_STYLEA('2', 'FontSize', 11)
          LODOP.PREVIEW()
        } else if (logistics_code === '1004') { // 圆通代收
          LODOP.ADD_PRINT_TEXTA('a', 95, 475, 100, 30, sjname) // a
          LODOP.ADD_PRINT_TEXTA('c', 150, 445, 317, 60, sjaddress + '(提前电联)') // c
          LODOP.ADD_PRINT_TEXTA('d', 95, 115, 175, 28, jjname) // d
          LODOP.ADD_PRINT_TEXTA('h', 367, 265, 175, 40, jjname) // h
          LODOP.ADD_PRINT_TEXTA('l', 205, 150, 130, 25, jjtel) // l
          LODOP.ADD_PRINT_TEXTA('m', 200, 503, 300, 25, jphone) // m
          LODOP.ADD_PRINT_TEXTA('n', 55, 255, 86, 25, dingdanid) // n
          LODOP.ADD_PRINT_TEXTA('o', 245, 448, 35, 35, '√') // o
          LODOP.ADD_PRINT_TEXTA('s', 245, 634, 25, 30, chinese_number_map[money1]) // s
          LODOP.ADD_PRINT_TEXTA('r', 245, 604, 25, 30, chinese_number_map[money10]) // r
          LODOP.ADD_PRINT_TEXTA('p', 245, 571, 25, 30, chinese_number_map[money100]) // p
          LODOP.ADD_PRINT_TEXTA('q', 245, 535, 25, 30, chinese_number_map[money1000]) // q
          LODOP.ADD_PRINT_TEXTA('t', 245, 504, 25, 30, chinese_number_map[money10000]) // t
          LODOP.ADD_PRINT_TEXTA('u', 245, 714, 200, 30, money) // u

          LODOP.SET_PRINT_PAGESIZE(1, '230mm', '127mm', '')
          // LODOP.ADD_PRINT_SETUP_BKIMG('<img border="0" src="../img/yt-cod.jpg?id=9">')
          LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '230mm')
          LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '127mm')
          LODOP.SET_PRINT_STYLEA('All', 'FontSize', 13)
          LODOP.SET_PRINT_STYLEA('All', 'FontName', '宋体')
          LODOP.SET_PRINT_STYLEA('All', 'Bold', 0)
          LODOP.SET_PRINT_STYLEA('2', 'FontSize', 11)
          LODOP.PREVIEW()
        } else if (logistics_code === '1005') { // EMS
          LODOP.ADD_PRINT_TEXTA('a', 203, 117, 100, 30, sjname) // a
          LODOP.ADD_PRINT_TEXTA('c', 252, 106, 317, 60, sjaddress + '(提前电联)') // c
          LODOP.ADD_PRINT_TEXTA('d', 85, 116, 75, 28, jjname) // d
          LODOP.ADD_PRINT_TEXTA('h', 188, 680, 112, 40, jjname) // h
          LODOP.ADD_PRINT_TEXTA('l', 85, 265, 130, 25, jjtel) // l
          LODOP.ADD_PRINT_TEXTA('m', 203, 270, 300, 25, jphone) // m
          LODOP.ADD_PRINT_TEXTA('n', 55, 208, 94, 25, dingdanid) // n

          LODOP.SET_PRINT_PAGESIZE(1, '230mm', '127mm', '')
          // LODOP.ADD_PRINT_SETUP_BKIMG('<img border="0" src="youzheng.jpg">')
          LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '230mm')
          LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '127mm')
          LODOP.SET_PRINT_STYLEA('All', 'FontSize', 13)
          LODOP.SET_PRINT_STYLEA('All', 'FontName', '宋体')
          LODOP.SET_PRINT_STYLEA('All', 'Bold', 0)
          LODOP.SET_PRINT_STYLEA('2', 'FontSize', 11)
          LODOP.SET_PRINT_STYLEA('12', 'FontSize', 24)
          LODOP.PREVIEW()
        } else if (logistics_code === '1009') {
          console.log('德邦')
          LODOP.SET_PRINT_PAGESIZE(1, '100mm', '180mm', '')
          LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '100mm')
          LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '180mm')

          LODOP.ADD_PRINT_LINE('2mm', '36mm', '2mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('14mm', '2mm', '14mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('2mm', '36mm', '14mm', '36mm', 0, 1)
          LODOP.ADD_PRINT_LINE('2mm', '48mm', '14mm', '48mm', 0, 1)
          LODOP.ADD_PRINT_LINE('2mm', '60mm', '14mm', '60mm', 0, 1)
          LODOP.ADD_PRINT_LINE('2mm', '80mm', '14mm', '80mm', 0, 1)
          LODOP.ADD_PRINT_LINE('14mm', '2mm', '108mm', '2mm', 0, 1)
          LODOP.ADD_PRINT_LINE('2mm', '98mm', '108mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('29mm', '2mm', '29mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('45mm', '2mm', '45mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('57mm', '2mm', '57mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('80mm', '2mm', '80mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('100mm', '2mm', '100mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('108mm', '2mm', '108mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('80mm', '76mm', '100mm', '76mm', 0, 1)
          LODOP.ADD_PRINT_LINE('100mm', '50mm', '108mm', '50mm', 0, 1)

          LODOP.ADD_PRINT_LINE('112mm', '50mm', '112mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('120mm', '2mm', '120mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('129mm', '2mm', '129mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('138mm', '2mm', '138mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('112mm', '50mm', '120mm', '50mm', 0, 1)
          LODOP.ADD_PRINT_LINE('120mm', '2mm', '138mm', '2mm', 0, 1)
          LODOP.ADD_PRINT_LINE('112mm', '98mm', '138mm', '98mm', 0, 1)

          LODOP.ADD_PRINT_LINE('142mm', '2mm', '142mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('178mm', '2mm', '178mm', '98mm', 0, 1)
          LODOP.ADD_PRINT_LINE('142mm', '2mm', '178mm', '2mm', 0, 1)
          LODOP.ADD_PRINT_LINE('142mm', '98mm', '178mm', '98mm', 0, 1)
          if (money > 0) {
            // if (true) {
            LODOP.ADD_PRINT_TEXT('6mm', '36mm', '12mm', '12mm', '到付')
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
            LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
            LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

            LODOP.ADD_PRINT_TEXT('4mm', '60mm', '20mm', '8mm', '代收货款')
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
            LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
            LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
            LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)

            LODOP.ADD_PRINT_TEXT('10mm', '60mm', '20mm', '8mm', '¥' + money + '元')
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
            LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
            LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          }
          LODOP.ADD_PRINT_TEXT('16mm', '2mm', '96mm', '15mm', destcode)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          //收货信息
          LODOP.ADD_PRINT_TEXT('34mm', '2mm', '12mm', '12mm', '收')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 16)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.ADD_PRINT_TEXT('30mm', '15mm', '30mm', '12mm', sjname)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.ADD_PRINT_TEXT('30mm', '40mm', '40mm', '12mm', sjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.ADD_PRINT_TEXT('35mm', '15mm', '75mm', '18mm', sjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

          // 寄件人
          LODOP.ADD_PRINT_TEXT('48mm', '2mm', '12mm', '12mm', '寄')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 16)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.ADD_PRINT_TEXT('48mm', '15mm', '30mm', '12mm', jjname)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.ADD_PRINT_TEXT('48mm', '40mm', '40mm', '12mm', jjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.ADD_PRINT_TEXT('52mm', '15mm', '75mm', '18mm', jjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.ADD_PRINT_BARCODE('60mm', '13mm', '80mm', '16mm', '128B', mailno)
          LODOP.ADD_PRINT_TEXT('83mm', '4mm', '72mm', '20mm', sign_need_read)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.SET_PRINT_STYLEA(0, 'LineSpacing', -2)
          LODOP.SET_PRINT_STYLEA(0, 'LetterSpacing', -1)
          LODOP.ADD_PRINT_TEXT('96mm', '65mm', '20mm', '8mm', '签收栏')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.ADD_PRINT_TEXT('88mm', '78mm', '20mm', '20mm', '已验视')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 13)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.ADD_PRINT_TEXT('100mm', '50mm', '50mm', '10mm', '烟台卧龙工业园区营业部')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)

          LODOP.ADD_PRINT_BARCODE('112mm', '55mm', '50mm', '8mm', '128B', mailno)

          LODOP.ADD_PRINT_TEXT('123mm', '2mm', '10mm', '10mm', '收')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.ADD_PRINT_TEXT('121mm', '15mm', '20mm', '8mm', sjname)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.ADD_PRINT_TEXT('121mm', '40mm', '40mm', '8mm', sjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.ADD_PRINT_TEXT('124mm', '15mm', '80mm', '16mm', sjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)

          LODOP.ADD_PRINT_TEXT('133mm', '2mm', '10mm', '10mm', '寄')
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 14)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
          LODOP.SET_PRINT_STYLEA(0, 'Bold', 1)
          LODOP.ADD_PRINT_TEXT('131mm', '15mm', '20mm', '8mm', jjname)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.ADD_PRINT_TEXT('131mm', '40mm', '40mm', '8mm', jjtel)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)
          LODOP.ADD_PRINT_TEXT('134mm', '15mm', '80mm', '16mm', jjaddress)
          LODOP.SET_PRINT_STYLEA(0, 'FontName', '黑体')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8)
          LODOP.SET_PRINT_STYLEA(0, 'Alignment', 1)

          LODOP.PREVIEW()
        } else {
          // LODOP.ADD_PRINT_TEXTA('a', 190, 117, 100, 30, sjname) // a
          // LODOP.ADD_PRINT_TEXTA('c', 239, 106, 317, 60, sjaddress + '(提前电联)') // c
          // LODOP.ADD_PRINT_TEXTA('d', 85, 116, 75, 28, jjname) // d
          // LODOP.ADD_PRINT_TEXTA('f', '', 244, 60, jjaddress) // f
          // LODOP.ADD_PRINT_TEXTA('g', '', 244, 40, chanpin) // g
          // LODOP.ADD_PRINT_TEXTA('h', '', 112, 40, jjname) // h
          // LODOP.ADD_PRINT_TEXTA('u', '', 199, 30, yuejiehao) // u
          // LODOP.ADD_PRINT_TEXTA('j', '', 199, 30, yuejiehao) // j
          // LODOP.ADD_PRINT_TEXTA('k', '', 85, 30, money) // k
          // LODOP.ADD_PRINT_TEXTA('l', '', 130, 25, jjtel) // l
          // LODOP.ADD_PRINT_TEXTA('m', '', 300, 25, jphone) // m
          // LODOP.ADD_PRINT_TEXTA('n', '', 64, 25, dingdanid) // n
          // LODOP.ADD_PRINT_TEXTA('o', '', 35, 35, '√') // o

          // LODOP.ADD_PRINT_TEXTA('s', 249, 619, 25, 30, chinese_number_map[money1]) // s
          // LODOP.ADD_PRINT_TEXTA('r', 250, 589, 25, 30, chinese_number_map[money10]) // r
          // LODOP.ADD_PRINT_TEXTA('p', 248, 556, 25, 30, chinese_number_map[money100]) // p
          // LODOP.ADD_PRINT_TEXTA('q', 245, 520, 25, 30, chinese_number_map[money1000]) // q
          // LODOP.ADD_PRINT_TEXTA('t', 247, 489, 25, 30, chinese_number_map[money10000]) // t

          LODOP.ADD_PRINT_TEXTA('z', '', 540, 30, '195542') // z
        }
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
<style scoped>
  .el-tag{
    /*height: 24px;*/
    /*line-height: 22px;*/
    /*font-size: 14px;*/
    /*padding: 0 4px;*/
  }
  .el-form--inline .el-form-item__content {
    width: 85%;
    padding: 5px 15% 0px 0px;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 15%;
    color: #5e81bf;
    font-size: 16px;
  }

  .my-edit-type, .my-edit-type:focus {
    color: #288ccb;
    cursor: pointer;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 15px;
    width: 49%;
    margin-left: 1%;
  }

  .my-form-p {
    margin: 0;
    padding: 0;
    line-height: 40px;
    color: #7d3d3d;
  }

  .label-span {
    font-weight: bold;
    color: #5e81bf;
  }

  .deleted-p {
    text-decoration: crimson underline overline line-through;
    text-decoration: underline overline line-through;
  }

</style>
