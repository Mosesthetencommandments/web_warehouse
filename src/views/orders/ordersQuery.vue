<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--<el-date-picker-->
        <!--class="filter-item"-->
        <!--v-model="listQuery.date_range"-->
        <!--type="daterange"-->
        <!--format="yyyy-MM-dd"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--align="right"-->
        <!--unlink-panels-->
        <!--range-separator="~"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--:picker-options="pickerOptions2"-->
        <!--@change='handleFilter'>-->
      <!--</el-date-picker>-->
      <!--<el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="listQuery.status"-->
                 <!--placeholder="订单状态">-->
        <!--<el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 250px;" class="filter-item" placeholder="订单号"-->
                <!--v-model="listQuery.orders_unique_id">-->
      <!--</el-input>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="物流单号"-->
                <!--v-model="listQuery.orders_logistics_number">-->
      <!--</el-input>-->
      <!--<el-select clearable @change='handleFilter' style="width: 120px" class="filter-item"-->
                 <!--v-model="listQuery.support_user_account_group_id" placeholder="客服部门">-->
        <!--<el-option v-for="item in userGroupOptions" :key="item.id" :label="item.group_name" :value="item.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客服"-->
                <!--v-model="listQuery.support_member_nickname">-->
      <!--</el-input>-->
      <!--<el-select v-model="listQuery.product_weixin_id"-->
                 <!--filterable-->
                 <!--clearable-->
                 <!--remote-->
                 <!--class="filter-item"-->
                 <!--:remote-method="getProductWeixinList"-->
                 <!--:loading="productWeixinLoading2"-->
                 <!--placeholder="搜索微信号"-->
                 <!--@change="handleFilter">-->
        <!--<el-option-->
          <!--v-for="item in productWeixinOptions2"-->
          <!--:key="item.id"-->
          <!--:label="item.info"-->
          <!--:value="item.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品名称"-->
                <!--v-model="listQuery.product_name">-->
      <!--</el-input>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="推广渠道" v-model="listQuery.channel_name">-->
      <!--</el-input>-->

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="收件人姓名"
                v-model="listQuery.weixin_fans_address_receive_name">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="收件人电话"
                v-model="listQuery.weixin_fans_address_phone">
      </el-input>

      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="备注信息"-->
                <!--v-model="listQuery.remark">-->
      <!--</el-input>-->
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <!--<el-button class="filter-item" @click="handleCreate" type="primary" con="el-icon-edit">添加</el-button>-->
      <el-button class="filter-item" v-waves icon="el-icon-refresh" style="float:right;" @click="handleFilter" type="primary">刷新</el-button>
      <!--<div>-->
        <!--<p style="float:right;padding-right:20px;font-size:22px;"-->
           <!--v-if="$store.state.user.roles === 'administrator' || $store.state.user.roles === 'warehouse'">-->
          <!--<span>今日订单：<span style="color:red;">{{today_orders}}</span></span>-->
          <!--<span>待发货：<span style="color:red;">{{need_delivery}}</span></span>-->
        <!--</p>-->
      <!--</div>-->
    </div>

    <el-table stripe :key='tableKey2' class="table" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%" :default-expand-all="ifExpandAll" :row-class-name="tableRowClassName">
      <el-table-column type="expand" :default-expand-all="ifExpandAll">
        <template slot-scope="scope">
          <el-form label-position="left" label-width="20%" inline class="demo-table-expand">
            <el-form-item label="所有商品">
              <p class="my-form-p" v-for="item in scope.row.orders_items">
                {{item.product_goods.goods_name}}
                x {{item.number}}件
              </p>
              <!--<el-button size="mini" type="primary" icon="el-icon-edit" @click="handleOpenInner1(scope.row)">编辑商品信息</el-button>-->
            </el-form-item>
            <el-form-item label="发货信息">
              <p class="my-form-p">
                <span class="label-span">发货人：</span><span>{{scope.row.product_weixin.weixin_nickname}}</span>
              </p>
              <p class="my-form-p">
                <span class="label-span">联系电话：</span><span>{{scope.row.product_weixin.phone}}</span>
              </p>
            </el-form-item>
            <el-form-item label="收款信息">
              <p class="my-form-p" v-for="item in scope.row.orders_payment.orders_payment_items"
                 :class="item.status===2?if_deleted:''">
                <el-tag style="height:20px;line-height:20px;" :type="'success'" :class="item.status===2?if_deleted:''">
                  {{item.orders_pay_type.type_name}}
                </el-tag>
                ￥{{item.paid_money}}
              </p>
              <!--<el-button size="mini" type="primary" icon="el-icon-edit" @click="handleOpenAnotherInner5(scope.row)">-->
                <!--编辑收款信息-->
              <!--</el-button>-->
            </el-form-item>
            <el-form-item label="收货信息">
              <div v-if="scope.row.product_weixin_fans_address">
                <p class="my-form-p">
                  <span class="label-span">收货人：</span><span v-if="scope.row.product_weixin_fans_address.receive_name">{{scope.row.product_weixin_fans_address.receive_name}}</span>
                </p>
                <p class="my-form-p">
                  <span class="label-span">联系电话：</span>
                  <span
                    v-if="($store.state.user.roles === 'warehouse') || ($store.state.user.roles === 'administrator') || ($store.state.user.roles === 'supportManager') || (user_account_id === scope.row.support_user_account_id)">{{scope.row.product_weixin_fans_address.phone}}</span>
                  <span v-else>{{scope.row.product_weixin_fans_address.phone|orderPhoneVisibleTranslator}}</span>
                </p>
                <p class="my-form-p">
                  <span class="label-span">收货地址：</span>
                  <span>
                    {{scope.row.product_weixin_fans_address.province_name}} {{scope.row.product_weixin_fans_address.city_name}} {{scope.row.product_weixin_fans_address.district_name}}
                    {{scope.row.product_weixin_fans_address.address}}
                  </span>
                </p>
              </div>
              <!--<el-button size="mini" type="primary" icon="el-icon-edit" @click="handleOpenAnotherInner4(scope.row)">-->
                <!--编辑收货信息-->
              <!--</el-button>-->
            </el-form-item>
            <el-form-item label="留言备注">
              <p class="my-form-p" v-for="item in scope.row.orders_remarks" :class="item.status===0?if_deleted:''">
                <span class="label-span">{{item.user_account_type_id|userTypeStatusTranslator}}：</span>
                <span>{{item.remark}}</span>
              </p>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleOpenInner2(scope.row)">编辑留言信息
              </el-button>
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
                  <span class="link-type">{{scope.row.orders_logistics.logistics_number}}</span>
                </p>
                <!--<el-button size="mini" type="primary" icon="el-icon-edit" @click="printOrders(scope.row)">打印订单-->
                <!--</el-button>-->
              </div>
              <!--<el-button size="mini" type="primary" icon="el-icon-edit" @click="handleInnerUpdate3(scope.row)">编辑物流信息-->
              <!--</el-button>-->
            </el-form-item>
          </el-form>
          <div class="logBtn">
            <el-button v-if="$store.state.user.roles === 'administrator' || $store.state.user.roles === 'warehouse'"
                       size="mini" type="success" icon="el-icon-search" @click="handleOpenInner3(scope.row)">订单日志查询
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单号" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.orders_unique_id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="客服">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.support_member.nickname}}</span><br/><span>({{scope.row.support_member.user_account_group.group_name}})</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="微信号">
        <template slot-scope="scope">
          <span >{{scope.row.product_weixin.weixin_account}}</span><br/><span>({{scope.row.product_weixin.info}})</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="渠道" v-if="$store.state.user.roles === 'administrator'">
        <template slot-scope="scope">
          <span v-if="scope.row.promotion_channel !== null">{{scope.row.promotion_channel.channel_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="加粉时间">
        <template slot-scope="scope">
          <span>{{scope.row.product_weixin_fans.pivot.join_time.substr(0, 10)}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="订单金额">
        <template slot-scope="scope">
          <span>￥{{scope.row.actual_pay}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="130px" align="center" label="收货人">
        <template slot-scope="scope">
          <span>{{scope.row.product_weixin_fans_address.receive_name}}</span><br>
          <span
            v-if="($store.state.user.roles === 'warehouse') || ($store.state.user.roles === 'administrator') || ($store.state.user.roles === 'supportManager') || (user_account_id === temp.support_user_account_id)">{{scope.row.product_weixin_fans_address.phone}}</span>
          <span v-else>{{scope.row.product_weixin_fans_address.phone|orderPhoneVisibleTranslator}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="订单状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | orderStatusFilter">{{scope.row.status|orderStatusTranslator}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="操作" min-width="320" class-name="small-padding">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-if="scope.row.status===1" type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>-->
          <!--<el-button v-if="scope.row.status===1" :loading="btnLoading" size="small" type="success" @click="handleCheckOrders(scope.row)">确认订单</el-button>-->
          <!--<el-button v-if="scope.row.status===2" size="small" type="info" @click="handleModifyStatus(scope.row,1)">未确认</el-button>-->
          <!--<el-button v-if="scope.row.status===2 || scope.row.status === 4" size="small" type="success" @click="handleDeliverOrders(scope.row,0)">确认发货</el-button>-->
          <!--<el-button v-if="scope.row.status===2" size="small" type="warning" @click="handleDeliverOrders(scope.row,1)">已断货</el-button>-->
          <!--<el-button v-if="scope.row.status===3" size="small" type="success" @click="handleHandleOrders(scope.row,1)">确认签收</el-button>-->
          <!--<el-button v-if="scope.row.status===3" size="small" type="warning" @click="handleHandleOrders(scope.row,0)">已拒收</el-button>-->
          <!--<el-button v-if="scope.row.status===5" size="small" type="success" @click="handleResultOrders(scope.row)">已完成</el-button>-->
          <!--<el-button-->
            <!--v-if="($store.state.user.roles === 'supportManager' || $store.state.user.roles === 'administrator') && scope.row.status!==9"-->
            <!--size="small" type="danger" @click="handleDestoryOrders(scope.row)">删除-->
          <!--</el-button>-->
          <!--&lt;!&ndash;<el-button v-if="scope.row.status===1" size="small" type="danger" @click="handleDeleteOrder(scope.row,9)">删除</el-button>&ndash;&gt;-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm1" :model="temp" label-position="left" label-width="20%"
               style='width: 80%; margin-left:10%;'>
        <el-form-item label="客服" prop="support_member.id">
          <multiselect :disabled="roles === 'support'" v-model="temp.support_member" :options="supportMemberOptions"
                       @input="resetSupportMember" @search-change="querySupportMemberList" placeholder="搜索客服"
                       selectLabel="选择"
                       deselectLabel="删除" track-by="nickname" :internalSearch="false" label="nickname">
            <span slot='noResult'>无结果</span>
          </multiselect>
        </el-form-item>
        <el-form-item label="推广微信号" prop="product_weixin.id">
          <multiselect v-model="temp.product_weixin" :options="productWeixinOptions" @input="resetProductWeixin"
                       @search-change="queryProductWeixinList" placeholder="搜索推广微信号" selectLabel="选择"
                       deselectLabel="删除" track-by="weixin_account" :internalSearch="false" label="weixin_account">
            <span slot='noResult'>无结果</span>
          </multiselect>
        </el-form-item>
        <el-form-item label="粉丝微信号" prop="product_weixin_fans.id">
          <multiselect v-model="temp.product_weixin_fans" :options="productWeixinFansOptions"
                       @input="resetProductWeixinFans" @search-change="queryProductWeixinFansList" placeholder="搜索粉丝微信号"
                       selectLabel="选择"
                       deselectLabel="删除" track-by="weixin_account" :internalSearch="false" label="weixin_account">
            <span slot='noResult'>无结果</span>
          </multiselect>
        </el-form-item>
        <el-form-item label="发货时间" prop="deliver_date">
          <el-date-picker
            v-model="temp.deliver_date"
            align="right"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="stepStatus=='create'" :loading="btnLoading" type="primary" @click="createData">下一步</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="innerTableTitle1" :visible.sync="innerTableVisible1" width="80%">
      <div class="filter-container" align="right">
        <el-button align="right" class="filter-item" style="margin-left: 10px;" @click="handleInnerCreate1"
                   type="primary" icon="el-icon-edit">添加
        </el-button>
      </div>
      <el-table :key='innerTableKey1' :data="temp.orders_items" v-loading="innerListLoading1"
                element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" label="序号" min-width="65">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="商品名称">
          <template slot-scope="scope">
            <span class="link-type" @click="handleInnerUpdate1(scope.row)">{{scope.row.product_goods.goods_name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="单价">
          <template slot-scope="scope">
            <span class="link-type" @click="handleInnerUpdate1(scope.row)">￥{{scope.row.product_goods.price}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="数量">
          <template slot-scope="scope">
            <span class="link-type" @click="handleInnerUpdate1(scope.row)">{{scope.row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="添加时间">
          <template slot-scope="scope">
            <span>{{scope.row.updated_at}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="320" class-name="small-padding">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleInnerUpdate1(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleInnerDelete1(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form :rules="rules1" ref="dataForm" :model="temp" label-position="left" label-width="40%"
               style='width: 40%;margin-top:30px;margin-left:60%;text-align: center;'>
        <el-form-item label="订单总金额" prop="actual_pay">
          <div v-if="actualPayEditable">
            <el-input class="edit-input" size="small" v-model="temp.actual_pay"></el-input>
            <el-button class='cancel-btn' size="small" icon="el-icon-refresh" type="warning"
                       @click="actualPayEditable=false">取消
            </el-button>
            <el-button type="success" @click="updateActualPayData()" size="small" icon="el-icon-circle-check-outline">
              完成
            </el-button>
          </div>
          <span style="font-size:40px !important;text-align:right;" @click='actualPayEditable=true' v-else>￥{{ temp.actual_pay }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="stepStatus=='create'" type="primary" @click="handleOpenInner4">下一步</el-button>
        <el-button v-else type="primary" @click="innerTableVisible1 = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible1" width="40%">
      <el-form :rules="innerRules1" ref="innerDataForm1" :model="innerTemp1" label-position="left" label-width="80px"
               style='width: 80%; margin-left:10%;'>
        <el-form-item label="商品名称" prop="product_goods.id">
          <multiselect v-model="innerTemp1.product_goods" :options="productGoodsOptions"
                       @search-change="queryProductGoodsList" placeholder="搜索商品名称" selectLabel="选择"
                       deselectLabel="删除" track-by="goods_name" :internalSearch="false" label="goods_name">
            <span slot='noResult'>无结果</span>
          </multiselect>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="innerTemp1.number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerDialogFormVisible1 = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" :loading="btnLoading" @click="createInnerData1">确 定</el-button>
        <el-button v-else type="primary" :loading="btnLoading" @click="updateInnerData1">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="innerTableTitle2" :visible.sync="innerTableVisible2" width="90%">
      <div class="filter-container" align="right">
        <el-button align="right" class="filter-item" style="margin-left: 10px;" @click="handleInnerCreate2"
                   type="primary" icon="el-icon-edit">添加
        </el-button>
      </div>
      <el-table :key='innerTableKey2' :data="temp.orders_remarks" v-loading="innerListLoading2"
                element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="用户身份">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.user_account_type_id|userTypeStatusTranslator}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="内容">
          <template slot-scope="scope">
            <span :class="scope.row.status===0?if_deleted:'link-type'">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="添加时间">
          <template slot-scope="scope">
            <span>{{scope.row.updated_at}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="操作" width="220" class-name="small-padding">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button v-if="scope.row.status===1" size="mini" type="danger" @click="handleInnerDelete2(scope.row)">删除-->
            <!--</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </el-dialog>
    <el-dialog :title="innerTableTitle3" :visible.sync="innerTableVisible3" width="90%">
      <el-table :key='innerTableKey3' :data="innerList3" v-loading="innerListLoading3" element-loading-text="给我一点时间"
                border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" label="序号" min-width="65">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作人" min-width="100px">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.type_name}}</el-tag>
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="具体操作" min-width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.action_desc}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" min-width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.created_at}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!innerListLoading1" class="pagination-container">
        <el-pagination background @size-change="handleInnerSizeChange3" @current-change="handleInnerCurrentChange3"
                       :current-page.sync="innerListQuery3.page"
                       :page-sizes="[10,20,50, 100]" :page-size="innerListQuery3.page_size"
                       layout="total, sizes, prev, pager, next, jumper" :total="innerTotal3">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible2" width="50%">
      <el-form :rules="innerRules2" ref="innerDataForm2" :model="innerTemp2" label-position="left" label-width="80px"
               style='width: 80%; margin-left:10%;'>
        <el-form-item label="备注信息" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15}" placeholder="请输入内容"
                    v-model="innerTemp2.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerDialogFormVisible2 = false">取 消</el-button>
        <el-button v-if="dialogStatus == 'create'" :loading="btnLoading" type="primary" @click="createInnerData2">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible3" width="70%">
      <el-form :rules="innerRules3" ref="innerDataForm3" :model="innerTemp3" label-position="left" label-width="80px"
               style='width: 80%; margin-left:10%;'>
        <el-form-item label="物流仓库" prop="product_deliver_id">
          <el-select v-model="innerTemp3.product_deliver_id"
                     @change="resetLogisticsNumber3"
                     style="width: 100%"
                     clearable
                     filterable
                     remote
                     placeholder="请选择物流仓库"
                     :remote-method="getWarehouseList"
                     :loading="productDeliverLoading">
            <el-option v-for="item in productDeliverOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="物流名称" prop="product_weixin">-->
        <!--<multiselect v-model="innerTemp3.orders_logistics_type" :options="logisticsTypeOptions" @input="resetLogisticsNumber" @search-change="queryLogisticsTypeList" placeholder="搜索物流名称" selectLabel="选择"-->
        <!--deselectLabel="删除" track-by="name" :internalSearch="false" label="name">-->
        <!--<span slot='noResult'>无结果</span>-->
        <!--</multiselect>-->
        <!--</el-form-item>-->
        <el-form-item label="物流名称" prop="orders_logistics_type.code">
          <el-select v-model="innerTemp3.orders_logistics_type"
                     @change="resetLogisticsNumber"
                     style="width: 100%"
                     value-key="id"
                     clearable
                     filterable
                     remote
                     placeholder="请选物流名称"
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
                      v-if="innerTemp3.orders_logistics_type.code === '1001' || innerTemp3.orders_logistics_type.code === '1006'">
          <el-select v-model="innerTemp3.product_deliver_extra_id"
                     @change="resetLogisticsNumber2"
                     style="width: 100%"
                     clearable
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
          <el-input :disabled="innerTemp3.orders_logistics_type.code === '1001'"
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
    <el-dialog :title="innerTableTitle4" :visible.sync="innerTableVisible4" width="90%">
      <div class="filter-container" align="right">
        <el-button align="right" class="filter-item" style="margin-left: 10px;" @click="handleInnerCreate4"
                   type="primary" icon="el-icon-edit">添加
        </el-button>
      </div>

      <el-table @cell-click="handleAddressRowClick" :key='innerTableKey4' :data="innerList4"
                v-loading="innerListLoading4" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" label="序号" min-width="65">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="收货人">
          <template slot-scope="scope">
            <span class="link-type" @click="handleInnerUpdate4(scope.row)">{{scope.row.receive_name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="联系电话">
          <template slot-scope="scope">
            <span class="link-type"
                  v-if="($store.state.user.roles === 'administrator') || ($store.state.user.roles === 'supportManager') || (user_account_id === temp.support_user_account_id)">{{scope.row.phone}}</span>
            <span class="link-type" v-else>{{scope.row.phone|orderPhoneVisibleTranslator}}</span>
            <!--<span class="link-type" @click="handleInnerUpdate4(scope.row)">{{scope.row.phone}}</span>-->
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" label="收货地址">
          <template slot-scope="scope">
            <span>
              {{scope.row.province_name}} {{scope.row.city_name}} {{scope.row.district_name}} {{scope.row.address}}
              <el-tag :type="'success'"
                      v-if="scope.row.id === temp.product_weixin_fans.default_address_id">默认收货地址</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag :type="'warning'" v-if="scope.row.id === temp.product_weixin_fans_address_id">已选中</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="320" class-name="small-padding">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleInnerUpdate4(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleInnerDelete4(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="stepStatus=='create'" type="primary" @click="updateOrderAddressCreate">下一步</el-button>
        <el-button v-else type="primary" @click="updateOrderAddress">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible4" width="70%">
      <el-form :rules="innerRules4" ref="innerDataForm4" :model="innerTemp4" label-position="left" label-width="15%"
               style='width: 80%; margin-left:10%;'>
        <el-form-item label="收货人姓名" prop="receive_name">
          <el-input v-model="innerTemp4.receive_name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model.trim="innerTemp4.phone"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-cascader
            size="large"
            change-on-select
            :options="regionData"
            v-model="innerTemp4.regions"
            @change="handleRegionChange"
            :props="props"
            style="width:100%;">
          </el-cascader>
        </el-form-item>
        <el-form-item label="地址详情" prop="address">
          <el-input v-model="innerTemp4.address"></el-input>
        </el-form-item>
        <el-form-item label="是否默认收货地址" prop="address">
          <el-checkbox-group v-model="innerTemp4.if_default">
            <el-checkbox-button :label="1">默认收货地址</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerDialogFormVisible4 = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createInnerData4">确 定</el-button>
        <el-button v-else type="primary" @click="updateInnerData4">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="innerTableTitle5" :visible.sync="innerTableVisible5" width="80%">
      <div class="filter-container" align="right">
        <el-button align="right" class="filter-item" style="margin-left: 10px;" @click="handleInnerCreate5"
                   type="primary" icon="el-icon-edit">添加
        </el-button>
      </div>
      <el-table :key='innerTableKey5' :data="temp.orders_payment.orders_payment_items" v-loading="innerListLoading5"
                element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" label="序号" min-width="65">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="收款方式">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.orders_pay_type.type_name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="收款金额">
          <template slot-scope="scope">
            <span class="link-type">￥{{scope.row.paid_money}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="收款证明">
          <template slot-scope="scope">
            <span class="link-type" v-if="scope.row.orders_pay_proof"
                  @click="handleOpenImage(scope.row.orders_pay_proof.image_url)"><img style="height:40px;width:100%;"
                                                                                      :src="scope.row.orders_pay_proof.image_url"/></span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | paymentItemStatusFilter">
              {{scope.row.status|paymentItemStatusTranslator}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="320" class-name="small-padding">
          <template slot-scope="scope">
            <!--<el-button type="primary" size="mini" @click="handleInnerUpdate5(scope.row)" v-if="scope.row.orders_pay_type.id === 2 && scope.row.status === 0">编辑</el-button>-->
            <el-button size="mini" type="danger" @click="handleInnerDelete5(scope.row)"
                       v-if="scope.row.orders_pay_type.id !== 2 && scope.row.status !== 3 && scope.row.status !== 2">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="stepStatus=='create'" type="primary" @click="innerTableVisible5 = false">完1 成</el-button>
        <el-button v-else type="primary" @click="innerTableVisible5 = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible5" width="50%">
      <el-form :rules="innerRules5" ref="innerDataForm5" :model="innerTemp5" label-position="left" label-width="160px"
               style='width: 80%; margin-left:10%;'>
        <el-form-item label="付款方式" prop="orders_pay_type_id">
          <el-select v-model="innerTemp5.orders_pay_type_id"
                     filterable
                     style="width: 100%"
                     :disabled="payTypeDisabled"
                     remote
                     :remote-method="queryOrderPayTypeList"
                     :loading="payTypeLoading"
                     placeholder="请选择付款方式"
                     @change="handleChangePayType">
            <el-option
              v-for="item in payTypeOptions"
              :key="item.id"
              :label="item.type_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款金额" prop="paid_money">
          <el-input v-model="innerTemp5.paid_money" :disabled="paidMoneyEnabled"></el-input>
        </el-form-item>
        <el-form-item label="付款凭证" prop="address" v-if="innerTemp5.orders_pay_type_id && innerTemp5.orders_pay_type_id !== 1 && innerTemp5.orders_pay_type_id !==2">
          <span v-if="payProofImageUrl">
            <img style="width: 100%" :src="payProofImageUrl"/><br>
          </span>
          <!--<el-input v-model="innerTemp5.orders_pay_proof_id"></el-input>-->
          <el-button type="primary"
                     style="width: 100%"
                     icon="el-icon-picture"
                     @click="handleOpenPayProof">选择付款凭证
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerDialogFormVisible5 = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="btnLoading" type="primary" @click="createInnerData5">确 定</el-button>
        <el-button v-else type="primary" @click="updateInnerData5">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="innerTablePayProofVisible" width="80%">
      <el-table :key='tableKey' :data="ordersPayProofList" v-loading="listLoading" element-loading-text="给我一点时间" border
                fit highlight-current-row
                style="width: 100%" stripe>
        <el-table-column align="center" label="序号" width="65">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" align="center" label="付款方式">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.orders_pay_type.type_name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="付款金额">
          <template slot-scope="scope">
            <span class="link-type" style="font-size: 20px">¥ {{scope.row.paid_money}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="凭证图片">
          <template slot-scope="scope">
            <span class="link-type" @click="handleOpenImage(scope.row.image_url)">
              <img style="height:100%;width:100%;" :src="scope.row.image_url"/>
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="180px" align="center" label="上传时间">
          <template slot-scope="scope">
            <span>{{scope.row.created_at}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="120" class-name="small-padding">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleSelectPayProof(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="imageDialogVisible">
      <img width="100%" :src="publicImageUrl">
    </el-dialog>
  </div>
</template>

<script>
  import {
    getProductList,
    deleteProduct,
    getProductTemplateList,
    getWarehouseList,
    getWarehouseLogisticsExtraList
  } from '@/api/product'
  import { getProductGoodsList } from '@/api/product_goods'
  // import { getSystemGlobalSettingInfo } from '@/api/system_global_setting'
  import {
    getOrdersCountInfo,
    findOrdersList,
    createOrders,
    updateOrders,
    createOrdersItem,
    updateOrdersItem,
    deleteOrdersItem,
    deleteOrdersRemark,
    createOrdersRemark,
    updateOrdersLogistics,
    getOrdersLogisticsTypeList,
    getOrdersPayTypeList,
    createOrdersPaymentItem,
    updateOrdersPaymentItem,
    deleteOrdersPaymentItem,
    getOrdersPayProofList,
    getOrdersSFLogisticsNumber,
    getOrdersLogsList,
    getOrdersYTOLogisticsNumber,
    getOrdersAreaList,
    resultOrders,
    destroyOrders,
    checkOrders,
    deliverOrders,
    handleOrders
  } from '@/api/orders'
  import { getSupportMemberList } from '@/api/support_member'
  import { getProductWeixinList, getProductWeixinFansList } from '@/api/product_weixin'
  import { getUserAccountGroupList } from '@/api/user_group'
  import {
    getProductWeixinFansAddressList,
    createProductWeixinFansAddress,
    updateProductWeixinFansAddress,
    deleteProductWeixinFansAddress
  } from '@/api/product_weixin_fans'
  import waves from '@/directive/waves' // 水波纹指令
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  // import { regionData, CodeToText } from 'element-china-area-data'
  import { getLodop } from '@/directive/lodop/LodopFuncs'
  import { mapGetters } from 'vuex'
  import bus from '@/views/layout/bus'

  export default {
    name: 'ordersQuery',
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
        scrollTop: 0,
        ifExpandAll: false,
        tableKey: 0,
        tableKey2: 0,
        list: [],
        total: 0,
        listLoading: false,
        chooseId: undefined,
        listQuery: {
          date_range: '',
          page: 1,
          page_size: 20,
          weixin_fans_address_receive_name: '',
          weixin_fans_address_phone: '',
          sort: '-id',
          orders_unique_id: '',
          orders_logistics_number: '',
          support_member_nickname: '',
          product_weixin_id: undefined,
          product_name: '',
          status: '',
          remark: ''
        },
        props: {
          value: 'area_number',
          label: 'area_name',
          children: 'children'
        },
        btnLoading: false,
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
          deliver_date: new Date(),
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
            city_name: '',
            district_name: '',
            province_name: '',
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
          product_name: [{ required: true, message: '请正确填写商品名称', trigger: 'change' }],
          support_member: {
            id: [{ required: true, message: '选择客服', trigger: 'change' }]
          },
          product_weixin: {
            id: [{ required: true, message: '选择推广微信', trigger: 'change' }]
          },
          product_weixin_fans: {
            id: [{ required: true, message: '选择粉丝微信', trigger: 'change' }]
          },
          deliver_date: [{ required: true, message: '选择发货时间', trigger: 'change' }]
        },
        rules1: {
          actual_pay: [
            { validator: validate, trigger: 'change' }
          ]
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
          product_goods: undefined,
          number: ''
        },
        innerListLoading1: false,
        innerTableVisible1: false,
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
        innerTableVisible2: false,
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
        innerTemp4: {
          id: undefined,
          product: undefined,
          receive_name: '',
          phone: '',
          province: '',
          province_name: '',
          city: '',
          city_name: '',
          district: '',
          district_name: '',
          regions: [],
          address: '',
          if_default: undefined,
          product_weixin_fans_address_id: undefined
        },
        innerListLoading4: false,
        innerTableVisible4: false,
        innerDialogFormVisible4: false,
        innerList5: null,
        innerTotal5: null,
        innerTableKey5: 5,
        innerTableTitle5: '',
        innerListQuery5: {
          page: 1,
          page_size: 5,
          product_id: undefined,
          sort: '-id'
        },
        innerTemp5: {
          id: undefined,
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
        sf_monthly_account: ''
      }
    },
    computed: {
      ...mapGetters([
        'user_account_id',
        'roles'
      ])
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
          1: 'info',
          2: 'warning',
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
      // this.getList()
      this.getProductWeixinList(' ')
      this.queryOrderPayTypeList(' ')
      this.getOrdersCountInfo()
      // this.getSystemDeliveryAddress()
      // this.getSystemDeliveryProductName()
      // this.getSystemSfMonthlyAccount()
      this.getGroupList()
      this.getregionData()
    },
    methods: {
      getregionData() {
        getOrdersAreaList().then(response => {
          this.regionData = response.data
        })
      },
      getWarehouseLogisticsExtraList(query) {
        if (query !== '') {
          console.log(this.logisticsTypeOptions)
          console.log(this.innerTemp3.orders_logistics_type.code)
          console.log(this.logisticsTypeOptions[this.logisticsTypeOptions.findIndex(d => d.company_code === this.innerTemp3.orders_logistics_type.code)])
          this.productDeliverExtraLoading = true
          getWarehouseLogisticsExtraList({
            order_logistics_type_id: this.logisticsTypeOptions[this.logisticsTypeOptions.findIndex(d => d.code === this.innerTemp3.orders_logistics_type.code)].id,
            product_deliver_id: this.innerTemp3.product_deliver_id,
            description: query
          }).then(response => {
            this.productDeliverExtraOptions = response.data.data
            this.productDeliverExtraLoading = false
          })
        }
      },
      getWarehouseList(query) {
        if (query !== '') {
          this.productDeliverLoading = true
          getWarehouseList({ product_id: this.tempProductId, name: query }).then(response => {
            this.productDeliverOptions = response.data.data
            this.productDeliverLoading = false
          })
        }
      },
      getGroupList() {
        getUserAccountGroupList({ user_account_type_id: 2 }).then(response => {
          if (response.data.data) {
            this.userGroupOptions = response.data.data
          }
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
        // this.getOrdersCountInfo()
        this.getList()
      },
      getOrdersCountInfo() {
        getOrdersCountInfo({}).then(response => {
          this.today_orders = response.data.today_orders
          this.need_delivery = response.data.need_delivery
        })
      },
      resetLogisticsNumber2() {
        if (this.innerTemp3.orders_logistics_type.code === '1001') {
          this.$confirm('选择顺丰快递将不可以修改订单内容， 确定选择？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const tempdata = {}
            tempdata.orders_id = this.temp.id
            tempdata.product_deliver_id = this.innerTemp3.product_deliver_id
            tempdata.product_deliver_extra_id = this.innerTemp3.product_deliver_extra_id
            tempdata.province_name = this.temp.product_weixin_fans_address.province_name
            tempdata.city_name = this.temp.product_weixin_fans_address.city_name
            tempdata.district_name = this.temp.product_weixin_fans_address.district_name
            tempdata.address = this.temp.product_weixin_fans_address.province_name + this.temp.product_weixin_fans_address.city_name + this.temp.product_weixin_fans_address.district_name + this.temp.product_weixin_fans_address.address
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
            tempdata.product_deliver_id = this.innerTemp3.product_deliver_id
            tempdata.product_deliver_extra_id = this.innerTemp3.product_deliver_extra_id
            tempdata.province = this.temp.product_weixin_fans_address.province_name
            tempdata.city = this.temp.product_weixin_fans_address.city_name
            let tempCity = this.temp.product_weixin_fans_address.city_name
            if ((tempCity === undefined) || (tempCity === null)) {
              tempCity = ''
            }
            let tempDistrict = this.temp.product_weixin_fans_address.district_name
            if ((tempDistrict === undefined) || (tempDistrict === null)) {
              tempDistrict = ''
            }
            tempdata.address = this.temp.product_weixin_fans_address.province_name + tempCity + tempDistrict + this.temp.product_weixin_fans_address.address
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
        }
      },
      resetLogisticsNumber() {
        console.log(this.innerTemp3)
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
      printOrdersa() {
        const basicUrl = process.env.BASE_API + '/api/orders/downloadNeedCheckOrder' + '?token=' + this.$store.state.user.token
        const form = document.createElement('form')
        form.action = basicUrl
        form.method = 'post'
        form.style.display = 'none'
        const button = document.createElement('input')
        button.type = 'submit'
        form.appendChild(button)
        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
        // downloadNeedCheckOrder().then()
      },
      printOrders(row) {
        // console.log(JSON.stringify(row))
        if (row.product_weixin.weixin_nickname === undefined || row.product_weixin.weixin_nickname === '' || row.product_weixin.weixin_nickname === null) {
          this.$message({
            type: 'error',
            message: '请先设置发件人姓名'
          })
          return
        }
        if (row.product_weixin.phone === undefined || row.product_weixin.phone === '' || row.product_weixin.phone === null) {
          this.$message({
            type: 'error',
            message: '请先设置发件人电话'
          })
          return
        }
        if (row.product_weixin_fans_address.receive_name === undefined || row.product_weixin_fans_address.receive_name === '' || row.product_weixin_fans_address.receive_name === null) {
          this.$message({
            type: 'error',
            message: '请先设置收件人姓名'
          })
          return
        }
        if (row.product_weixin_fans_address.phone === undefined || row.product_weixin_fans_address.phone === '' || row.product_weixin_fans_address.phone === null) {
          this.$message({
            type: 'error',
            message: '请先设置收件人电话'
          })
          return
        }
        if (row.product_weixin_fans_address.address === undefined || row.product_weixin_fans_address.address === '' || row.product_weixin_fans_address.address === null) {
          this.$message({
            type: 'error',
            message: '请先设置收货地址'
          })
          return
        }
        if (row.product_weixin_fans_address.province_name === null || row.product_weixin_fans_address.city_name === null || row.product_weixin_fans_address.district_name === null) {
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
        if (row.orders_unique_id === undefined || row.orders_unique_id === '' || row.orders_unique_id === null) {
          this.$message({
            type: 'error',
            message: '系统错误, 订单号不能为空'
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
        const jphone = row.product_weixin_fans_address.phone
        const timestamp = new Date()
        const jjname = row.product_weixin.weixin_nickname// 寄件人姓名
        const jjtel = row.product_weixin.phone//  寄件人电话
        const jjaddress = row.orders_logistics.product_deliver.delivery_address// 寄件人地址
        const sjname = row.product_weixin_fans_address.receive_name//  收件人姓名
        const sjtel = jphone.substr(0, 3) + '****' + jphone.substr(7)// 收件人电话
        const sjaddress = row.product_weixin_fans_address.province_name + row.product_weixin_fans_address.city_name + row.product_weixin_fans_address.district_name + row.product_weixin_fans_address.address//  收件人地址
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
        // 1001 顺丰热敏打印
        if (logistics_code === '1001') {
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

          LODOP.ADD_PRINT_BARCODE('69mm', '7mm', '90mm', '18mm', '128C', mailno)

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

          LODOP.ADD_PRINT_BARCODE(417, 155, '50mm', '8mm', '128C', mailno)

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
      queryOrderPayTypeList(query) {
        if (query !== '') {
          this.payTypeLoading = true
          getOrdersPayTypeList({ type_name: query }).then(response => {
            this.payTypeOptions = response.data
            this.payTypeLoading = false
          })
        } else {
          this.payTypeOptions = []
        }
      },
      getProductWeixinList(query) {
        if (query !== '') {
          this.productWeixinLoading2 = true
          getProductWeixinList({ info: query }).then(response => {
            this.productWeixinOptions2 = response.data.data
            this.productWeixinLoading2 = false
          })
        }
      },
      handleAddressRowClick(row, column, cell, event) {
        console.log(cell)
        // console.log(cell.path)
        // console.log(cell.path[1].classList)
        if (cell.cellIndex === 4) {
          this.temp.product_weixin_fans_address_id = row.id
        }
        this.innerTemp4 = Object.assign({}, row) // copy obj
        // console.log(this.innerTemp4)
      },
      handleRegionChange(value) {
        console.log(value)
      },
      tableRowClassName({ row, rowIndex }) {
        return 'colored-row'
      },
      querySupportMemberList(query) {
        getSupportMemberList({ nickname: query, user_account_type_code: 'support', status: '1' }).then(response => {
          if (!response.data.data) return
          console.log(response)
          this.supportMemberOptions = response.data.data
        })
      },
      queryProductWeixinList(query) {
        if (!this.temp.support_member.id) {
          return
        }
        const tempData = {}
        tempData.weixin_account = query
        if ((this.$store.state.user.roles === 'administrator') || (this.$store.state.user.roles === 'supportManager')) {
          // alert(this.$store.state.user.roles)
        } else {
          tempData.support_user_account_id = this.temp.support_member.id
        }
        getProductWeixinList(tempData).then(response => {
          if (!response.data.data) return
          console.log(response)
          this.productWeixinOptions = response.data.data
          for (const v of this.productWeixinOptions) {
            v.weixin_account = v.weixin_account + '  (' + v.info + ')'
            const index = this.productWeixinOptions.indexOf(v)
            this.productWeixinOptions.splice(index, 1, v)
          }
        })
      },
      queryProductWeixinFansList(query) {
        if (!this.temp.product_weixin.id) {
          return
        }
        getProductWeixinFansList({
          weixin_account: query,
          product_weixin_id: this.temp.product_weixin.id
        }).then(response => {
          if (!response.data.data) return
          console.log(response)
          this.productWeixinFansOptions = response.data.data
        })
      },
      queryProductList(query) {
        getProductList({ product_name: query }).then(response => {
          if (!response.data.data) return
          console.log(response)
          this.productOptions = response.data.data
        })
      },
      queryProductGoodsList(query) {
        getProductGoodsList({ goods_name: query, status: '1' }).then(response => {
          if (!response.data.data) return
          console.log(response)
          this.productGoodsOptions = response.data.data
        })
      },
      queryLogisticsTypeList(query) {
        if (this.innerTemp3.product_deliver_id === undefined || this.innerTemp3.product_deliver_id === '') {
          this.$message.error('先选择仓库')
          return
        }
        if (query !== '') {
          this.queryLogisticsTypeLoading = true
          getOrdersLogisticsTypeList({
            logistics_name: query,
            product_deliver_id: this.innerTemp3.product_deliver_id
          }).then(response => {
            // if (!response.data.data) return
            console.log(response)
            this.logisticsTypeOptions = response.data.data
            this.queryLogisticsTypeLoading = false
          })
        }
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
        findOrdersList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        if (this.listQuery.weixin_fans_address_phone === '' && this.listQuery.weixin_fans_address_receive_name === '') {
          this.$message.error('搜索不能为空')
          return false
        }
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
      handleCheckOrders(row) {
        checkOrders({ orders_id: row.id }).then(res => {
          row.status = 2
        }).catch(() => {
        })
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
        }).catch(() => {
        })
      },
      handleDestoryOrders(row) {
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tempParms = {
            orders_id: row.id
          }
          destroyOrders(tempParms).then(res => {
            row.status = 9
          }).catch(() => {
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          orders_unique_id: '',
          support_user_account_id: undefined,
          product_weixin_id: undefined,
          product_weixin_fans_id: undefined,
          product_weixin_fans_address_id: undefined,
          price_total: undefined,
          actual_pay: undefined,
          deliver_date: new Date(),
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
              code: '',
              status: undefined
            }
          }
        }
        if (this.$store.state.user.roles === 'support') {
          this.temp.support_member.id = this.$store.state.user.user_account_id
          this.temp.support_member.nickname = this.$store.state.user.name
        }
      },
      handleCreate() {
        this.stepStatus = 'create'
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm1'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm1'].validate((valid) => {
          if (valid) {
            this.temp.support_user_account_id = this.temp.support_member.id
            this.temp.product_weixin_id = this.temp.product_weixin.id
            this.temp.product_weixin_fans_id = this.temp.product_weixin_fans.id
            createOrders(this.temp).then(response => {
              this.temp = response.data
              // this.list.unshift(this.temp)
              this.getList()
              this.dialogFormVisible = false
              this.handleOpenInnerFromCreate1(this.temp)
              // this.total++
            })
          }
        })
      },
      handleUpdate(row) {
        this.stepStatus = 'update'
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm1'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm1'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.orders_id = this.temp.id
            tempData.support_user_account_id = this.temp.support_member.id
            tempData.product_weixin_id = this.temp.product_weixin.id
            tempData.product_weixin_fans_id = this.temp.product_weixin_fans.id
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
      updateActualPayData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.orders_id = this.temp.id
            tempData.actual_pay = this.temp.actual_pay
            updateOrders(tempData).then(() => {
              this.handleCashOnDeliveryPaidMoney()
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              bus.$emit('upDateRealTimeRanking')
              this.actualPayEditable = false
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ttempData = {
            product_id: row.id
          }
          deleteProduct(ttempData).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.total--
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleOpenInner1(row) {
        this.stepStatus = 'update'
        this.innerTableVisible1 = true
        this.dialogStatus = 'update'
        this.innerTableTitle1 = row.orders_unique_id + ' -- 商品列表'
        this.temp = Object.assign({}, row) // copy obj
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        // this.getInnerList1()
      },
      handleOpenInnerFromCreate1(row) {
        this.stepStatus = 'create'
        this.innerTableVisible1 = true
        this.dialogStatus = 'update'
        this.innerTableTitle1 = row.orders_unique_id + ' -- 商品列表'
        this.temp = Object.assign({}, row) // copy obj
        // this.getInnerList1()
      },
      getInnerList1() {
        this.innerListQuery1.product_id = this.temp.id
        this.innerTemp1.product_id = this.temp.id
        this.innerListLoading1 = true
        getProductTemplateList(this.innerListQuery1).then(response => {
          this.innerList1 = response.data.data
          this.innerTotal1 = response.data.total
          this.innerListLoading1 = false
        })
      },
      handleInnerFilter1() {
        this.innerListQuery1.page = 1
        this.getInnerList1()
      },
      handleInnerSizeChange1(val) {
        this.innerListQuery1.page_size = val
        this.getInnerList1()
      },
      handleInnerCurrentChange1(val) {
        this.innerListQuery1.page = val
        this.getInnerList1()
      },
      resetInnerTemp1() {
        this.innerTemp1 = {
          id: undefined,
          product_goods: undefined,
          number: ''
        }
      },
      handleInnerCreate1() {
        this.resetInnerTemp1()
        this.dialogStatus = 'create'
        this.innerDialogFormVisible1 = true
        this.innerTemp1.product_id = this.temp.id
        this.$nextTick(() => {
          this.$refs['innerDataForm1'].clearValidate()
        })
      },
      createInnerData1() {
        this.$refs['innerDataForm1'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            this.innerTemp1.product_goods_id = this.innerTemp1.product_goods.id
            this.innerTemp1.orders_id = this.temp.id
            createOrdersItem(this.innerTemp1).then(response => {
              this.innerTotal1++
              this.innerTemp1.id = response.data.id
              this.innerTemp1.updated_at = response.data.updated_at
              this.temp.orders_items.unshift(this.innerTemp1)
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
        this.dialogStatus = 'update'
        this.innerDialogFormVisible1 = true
        this.$nextTick(() => {
          this.$refs['innerDataForm1'].clearValidate()
        })
      },
      updateInnerData1() {
        this.$refs['innerDataForm1'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            const tempData = Object.assign({}, this.innerTemp1)
            tempData.orders_item_id = this.innerTemp1.id
            tempData.product_goods_id = this.innerTemp1.product_goods.id
            updateOrdersItem(tempData).then(response => {
              this.innerTemp1.updated_at = response.data.updated_at
              for (const v of this.temp.orders_items) {
                if (v.id === this.innerTemp1.id) {
                  const index = this.temp.orders_items.indexOf(v)
                  this.temp.orders_items.splice(index, 1, this.innerTemp1)
                  break
                }
              }
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
          const ttempData = {
            orders_item_id: row.id
          }
          deleteOrdersItem(ttempData).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.temp.orders_items.indexOf(row)
            this.temp.orders_items.splice(index, 1)
            this.innerTotal1--
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleOpenInner2(row) {
        this.innerTableVisible2 = true
        this.innerTableTitle2 = row.orders_unique_id + ' -- 备注'
        this.temp = Object.assign({}, row) // copy obj
        // this.getInnerList1()
      },
      handleInnerSizeChange3(val) {
        this.innerListQuery3.page_size = val
        this.getInnerList3()
      },
      handleInnerCurrentChange3(val) {
        this.innerListQuery3.page = val
        this.getInnerList3()
      },
      getInnerList3() {
        this.innerListQuery3.orders_id = this.temp.id
        this.innerListLoading3 = true
        getOrdersLogsList(this.innerListQuery3).then(response => {
          this.innerList3 = response.data.data
          this.innerTotal3 = response.data.total
          this.innerListLoading3 = false
        })
      },
      handleOpenInner3(row) {
        this.innerTableVisible3 = true
        this.innerTableTitle3 = row.orders_unique_id + ' -- 订单日志'
        this.temp = Object.assign({}, row) // copy obj
        this.getInnerList3()
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
        console.log(row)
        this.logisticsTypeOptions = []
        this.tempProductId = row.product_id
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.innerDialogFormVisible3 = true
        if (row.orders_logistics.id !== 0) {
          this.logisticsTypeOptions.push({
            id: row.orders_logistics.orders_logistics_type.id,
            name: row.orders_logistics.orders_logistics_type.name,
            code: row.orders_logistics.orders_logistics_type.code
          })
          if (row.orders_logistics.product_deliver_extra_id !== null) {
            this.productDeliverExtraOptions = [{
              id: row.orders_logistics.product_deliver_extra.id,
              description: row.orders_logistics.product_deliver_extra.description
            }]
          }
          this.productDeliverOptions = [{
            id: row.orders_logistics.product_deliver.id,
            name: row.orders_logistics.product_deliver.name
          }]
          this.innerTemp3 = Object.assign({}, row.orders_logistics)
          console.log('innerTemp3', this.innerTemp3)
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
              const index = this.list.findIndex(d => d.id === this.temp.id)
              this.list[index].orders_logistics = response.data
            })
          }
        })
      },
      handleOpenInner4() {
        this.stepStatus = 'create'
        this.innerTableVisible4 = true
        this.innerTableVisible1 = false
        this.dialogStatus = 'create'
        this.innerTableTitle4 = this.temp.orders_unique_id + ' -- 编辑收货地址'
        this.getInnerList4()
      },
      handleOpenAnotherInner4(row) {
        console.log(row)
        this.stepStatus = 'update'
        this.innerTableVisible4 = true
        this.dialogStatus = 'update'
        this.innerTableTitle4 = row.orders_unique_id + ' -- 编辑收货地址'
        this.temp = Object.assign({}, row) // copy obj
        // this.chooseId = this.temp.product_weixin_fans_address_id
        // this.temp.product_weixin_fans_address_id = this.innerTemp4.product_weixin_fans_address_id
        this.getInnerList4()
      },
      getInnerList4() {
        this.innerListQuery4.product_id = this.temp.id
        this.innerTemp4.product_weixin_fans_id = this.temp.id
        this.innerTemp4.product_weixin_fans_address_id = this.temp.product_weixin_fans_address_id
        const tempdata = {}
        tempdata.product_weixin_fans_id = this.temp.product_weixin_fans_id
        this.innerListLoading4 = true
        getProductWeixinFansAddressList(tempdata).then(response => {
          this.innerList4 = response.data.data
          this.innerTotal4 = response.data.total
          this.innerListLoading4 = false
        })
      },
      handleInnerFilter4() {
        this.innerListQuery4.page = 1
        this.getInnerList4()
      },
      handleInnerSizeChange4(val) {
        this.innerListQuery4.page_size = val
        this.getInnerList4()
      },
      handleInnerCurrentChange4(val) {
        this.innerListQuery4.page = val
        this.getInnerList4()
      },
      resetInnerTemp4() {
        this.innerTemp4 = {
          id: undefined,
          product: undefined,
          receive_name: '',
          phone: '',
          province: '',
          province_name: '',
          city: '',
          city_name: '',
          district: '',
          district_name: '',
          regions: [],
          address: '',
          if_default: undefined,
          product_weixin_fans_address_id: undefined
        }
      },
      handleInnerCreate4() {
        this.resetInnerTemp4()
        this.dialogStatus = 'create'
        this.innerDialogFormVisible4 = true
        this.innerTemp4.product_weixin_fans_id = this.temp.product_weixin_fans_id
        this.$nextTick(() => {
          this.$refs['innerDataForm4'].clearValidate()
        })
      },
      createInnerData4() {
        this.$refs['innerDataForm4'].validate((valid) => {
          if (valid) {
            this.innerTemp4.orders_id = this.temp.id
            this.innerTemp4.province = this.innerTemp4.regions[0]
            this.innerTemp4.city = this.innerTemp4.regions[1]
            this.innerTemp4.district = this.innerTemp4.regions[2]
            createProductWeixinFansAddress(this.innerTemp4).then(response => {
              if (this.innerTemp4.if_default) {
                this.temp.product_weixin_fans.default_address_id = response.data.id
              }
              this.innerTotal4++
              this.innerTemp4.id = response.data.id
              this.innerTemp4.updated_at = response.data.updated_at
              const province = parseInt(response.data.province)
              const city = parseInt(response.data.city)
              const district = parseInt(response.data.district)
              const regions = [province, city, district]
              response.data.regions = regions
              this.innerList4.unshift(response.data)
              this.innerDialogFormVisible4 = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleInnerUpdate4(row) {
        this.innerTemp4 = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.innerDialogFormVisible4 = true
        this.innerTemp4.product_weixin_fans_id = this.temp.product_weixin_fans_id
        this.innerTemp4.if_default = (this.temp.product_weixin_fans.default_address_id === this.innerTemp4.id)
        this.$nextTick(() => {
          this.$refs['innerDataForm4'].clearValidate()
        })
      },
      updateInnerData4() {
        this.$refs['innerDataForm4'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.innerTemp4)
            tempData.province = this.innerTemp4.regions[0]
            tempData.city = this.innerTemp4.regions[1]
            tempData.district = this.innerTemp4.regions[2]
            tempData.product_weixin_fans_address_id = this.innerTemp4.id
            updateProductWeixinFansAddress(tempData).then(response => {
              if (this.innerTemp4.if_default) {
                this.temp.product_weixin_fans.default_address_id = this.innerTemp4.id
              }
              this.innerTemp4.province_name = response.data.province_name
              this.innerTemp4.city_name = response.data.city_name
              this.innerTemp4.district_name = response.data.district_name
              this.innerTemp4.updated_at = response.data.updated_at
              for (const v of this.innerList4) {
                if (v.id === this.innerTemp4.id) {
                  const index = this.innerList4.indexOf(v)
                  this.innerList4.splice(index, 1, this.innerTemp4)
                  break
                }
              }
              this.innerDialogFormVisible4 = false
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
      handleInnerDelete4(row) {
        this.$confirm('确定删除收货地址?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // if (this.temp.product_weixin_fans_address_id === row.id) {
          //   this.$message({
          //     type: 'warning',
          //     message: '不能删除已选中的收货地址'
          //   })
          //   return
          // }
          const ttempData = {
            product_weixin_fans_address_id: row.id,
            product_weixin_fans_id: row.product_weixin_fans_id
          }
          deleteProductWeixinFansAddress(ttempData).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.innerList4.indexOf(row)
            this.innerList4.splice(index, 1)
            this.innerTotal4--
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      updateOrderAddress() {
        const tempData = {}
        tempData.product_weixin_fans_address_id = this.temp.product_weixin_fans_address_id
        tempData.orders_id = this.temp.id
        updateOrders(tempData).then(response => {
          for (const v of this.list) {
            if (v.id === response.data.id) {
              const index = this.list.indexOf(v)
              this.list[index].product_weixin_fans_address_id = response.data.product_weixin_fans_address_id
            }
          }
          // for (const v in this.list) {
          //   if (this.list[v].id === response.data.id) {
          //     this.list[v].product_weixin_fans_address_id = response.data.product_weixin_fans_address_id
          //     this.list[v].product_weixin_fans_address.province_name = this.innerTemp4.province_name
          //     this.list[v].product_weixin_fans_address.city_name = this.innerTemp4.city_name
          //     this.list[v].product_weixin_fans_address.district_name = this.innerTemp4.district_name
          //   }
          // }
          let tempAddressInfo = null
          for (const v of this.innerList4) {
            if (v.id === this.temp.product_weixin_fans_address_id) {
              const index = this.innerList4.indexOf(v)
              tempAddressInfo = this.innerList4[index]
            }
          }
          if (tempAddressInfo === null) {
            this.$message({
              type: 'error',
              message: '请先选择地址信息'
            })
            return
          }
          this.temp.product_weixin_fans_address_id = tempAddressInfo.product_weixin_fans_address_id
          this.temp.product_weixin_fans_address.id = tempAddressInfo.id
          this.temp.product_weixin_fans_address.receive_name = tempAddressInfo.receive_name
          this.temp.product_weixin_fans_address.phone = tempAddressInfo.phone
          this.temp.product_weixin_fans_address.address = tempAddressInfo.address
          this.temp.product_weixin_fans_address.province_name = tempAddressInfo.province_name
          this.temp.product_weixin_fans_address.city_name = tempAddressInfo.city_name
          this.temp.product_weixin_fans_address.district_name = tempAddressInfo.district_name
          console.log(tempAddressInfo)
          console.log(this.temp)
          this.innerTableVisible4 = false
        })
      },
      updateOrderAddressCreate() {
        const tempData = {}
        tempData.product_weixin_fans_address_id = this.temp.product_weixin_fans_address_id
        tempData.orders_id = this.temp.id
        updateOrders(tempData).then(response => {
          for (const v of this.list) {
            if (v.id === response.data.id) {
              const index = this.list.indexOf(v)
              this.list[index].product_weixin_fans_address_id = response.data.product_weixin_fans_address_id
            }
          }
          // for (const v in this.list) {
          //   if (this.list[v].id === response.data.id) {
          //     this.list[v].product_weixin_fans_address_id = response.data.product_weixin_fans_address_id
          //     this.list[v].product_weixin_fans_address.province_name = this.innerTemp4.province_name
          //     this.list[v].product_weixin_fans_address.city_name = this.innerTemp4.city_name
          //     this.list[v].product_weixin_fans_address.district_name = this.innerTemp4.district_name
          //   }
          // }
          let tempAddressInfo = null
          for (const v of this.innerList4) {
            if (v.id === this.temp.product_weixin_fans_address_id) {
              const index = this.innerList4.indexOf(v)
              tempAddressInfo = this.innerList4[index]
            }
          }
          if (tempAddressInfo === null) {
            this.$message({
              type: 'error',
              message: '请先选择地址信息'
            })
            return
          }
          this.temp.product_weixin_fans_address_id = tempAddressInfo.product_weixin_fans_address_id
          this.temp.product_weixin_fans_address.id = tempAddressInfo.id
          this.temp.product_weixin_fans_address.receive_name = tempAddressInfo.receive_name
          this.temp.product_weixin_fans_address.phone = tempAddressInfo.phone
          this.temp.product_weixin_fans_address.address = tempAddressInfo.address
          this.temp.product_weixin_fans_address.province_name = tempAddressInfo.province_name
          this.temp.product_weixin_fans_address.city_name = tempAddressInfo.city_name
          this.temp.product_weixin_fans_address.district_name = tempAddressInfo.district_name
          console.log(tempAddressInfo)
          console.log(this.temp)
          this.innerTableVisible4 = false
          this.innerTableVisible5 = true
          this.stepStatus = 'create'
        })
      },
      handleOpenInner5(row) {
        this.innerTableVisible5 = true
        this.dialogStatus = 'create'
        this.innerTableTitle5 = row.orders_unique_id + ' -- 编辑收款信息'
        this.temp = Object.assign({}, row) // copy obj
      },
      handleOpenPayProof() {
        this.innerTablePayProofVisible = true
        this.ordersPayProofList = []
        getOrdersPayProofList({ is_used: 0, pay_type_id: this.innerTemp5.orders_pay_type_id }).then(response => {
          this.ordersPayProofList = response.data.data
        })
      },
      handleSelectPayProof(row) {
        this.innerTemp5.paid_money = row.paid_money
        this.payProofImageUrl = row.image_url
        this.innerTemp5.orders_pay_proof_id = row.id
        this.innerTablePayProofVisible = false
      },
      handleOpenAnotherInner5(row) {
        this.innerTableVisible5 = true
        this.dialogStatus = 'update'
        this.innerTableTitle5 = row.orders_unique_id + ' -- 编辑收款信息'
        this.temp = Object.assign({}, row) // copy obj
      },
      resetInnerTemp5() {
        this.innerTemp5 = {
          id: undefined,
          orders_pay_type_id: undefined,
          paid_money: undefined,
          orders_pay_proof_id: undefined
        }
        this.payProofImageUrl = false
      },
      handleInnerCreate5() {
        this.resetInnerTemp5()
        this.dialogStatus = 'create'
        this.payTypeDisabled = false
        this.innerDialogFormVisible5 = true
        this.innerTemp5.orders_payment_id = this.temp.orders_payment.id
        this.$nextTick(() => {
          this.$refs['innerDataForm5'].clearValidate()
        })
      },
      createInnerData5() {
        this.$refs['innerDataForm5'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            createOrdersPaymentItem(this.innerTemp5).then(response => {
              this.innerTotal5++
              this.innerTemp5.id = response.data.id
              this.innerTemp5.status = response.data.status
              this.innerTemp5.orders_pay_type = response.data.orders_pay_type
              this.innerTemp5.orders_pay_proof = response.data.orders_pay_proof
              this.innerTemp5.updated_at = response.data.updated_at
              this.temp.orders_payment.orders_payment_items.push(this.innerTemp5)
              this.handleCashOnDeliveryPaidMoney()
              this.innerDialogFormVisible5 = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.btnLoading = false
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      handleInnerUpdate5(row) {
        this.innerTemp5 = Object.assign({}, row) // copy obj
        this.payTypeDisabled = true
        this.dialogStatus = 'update'
        this.innerDialogFormVisible5 = true
        this.innerTemp5.orders_payment_id = this.temp.orders_payment.id
        this.innerTemp5.orders_pay_type_id = row.orders_pay_type.id
        this.innerTemp5.orders_payment_item_id = row.id
        this.$nextTick(() => {
          this.$refs['innerDataForm5'].clearValidate()
        })
      },
      updateInnerData5() {
        this.$refs['innerDataForm5'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.innerTemp5)
            updateOrdersPaymentItem(tempData).then(response => {
              this.innerTemp5.updated_at = response.data.updated_at
              for (const v of this.temp.orders_payment.orders_payment_items) {
                if (v.id === this.innerTemp5.id) {
                  const index = this.temp.orders_payment.orders_payment_items.indexOf(v)
                  this.temp.orders_payment.orders_payment_items.splice(index, 1, this.innerTemp5)
                  break
                }
              }
              this.handleCashOnDeliveryPaidMoney()
              this.innerDialogFormVisible5 = false
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
      handleInnerDelete5(row) {
        this.$confirm('确定删除收款信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 2
          const tempData = { orders_payment_item_id: row.id }
          deleteOrdersPaymentItem(tempData).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.temp.orders_payment.orders_payment_items.indexOf(row)
            this.temp.orders_payment.orders_payment_items.splice(index, 1, row)
            this.handleCashOnDeliveryPaidMoney()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleOpenImage(imageUrl) {
        this.publicImageUrl = imageUrl
        this.imageDialogVisible = true
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
  .table >>> .el-form-item__content {
    width: 80%;
    padding: 5px 15% 0px 0px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .table >>> .el-form-item__label {
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
    line-height: 30px;
    color: #7d3d3d;
  }

  .label-span {
    font-weight: bold;
    color: #5e81bf;
  }

  /*.el-table .colored-row {*/
  /*background: #eaf5ff;*/
  /*}*/

  .deleted-p {
    text-decoration: crimson underline overline line-through;
    text-decoration: underline overline line-through;
  }

  .logBtn {
    float: right;
    margin-right: 50px;
  }
</style>
