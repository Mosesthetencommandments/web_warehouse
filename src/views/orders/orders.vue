<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="filter-item">
        <div class="filter-label">订单下单时间</div>
        <el-date-picker
          v-model="listQuery.created_at"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          size="small"
          style="width: 350px"
          unlink-panels
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
        ></el-date-picker>
      </div>
      <div class="filter-item">
        <div class="filter-label">订单发货时间</div>
        <el-date-picker
          v-model="listQuery.date_range"
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
        ></el-date-picker>
      </div>
      <div class="filter-item">
        <div class="filter-label">收件人姓名</div>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 100px;"
          size="small"
          placeholder
          v-model="listQuery.weixin_fans_address_receive_name"
        ></el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">收件人电话</div>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 160px;"
          size="small"
          placeholder
          v-model="listQuery.weixin_fans_address_phone"
        ></el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">订单号</div>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 220px;"
          size="small"
          placeholder
          v-model="listQuery.orders_unique_id"
        ></el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">物流单号</div>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 220px;"
          size="small"
          placeholder
          v-model="listQuery.orders_logistics_number"
        ></el-input>
      </div>
      <div class="filter-item">
        <div class="filter-label">物流类型</div>
        <el-select
          v-model="listQuery.logistics_type_id"
          clearable
          style="width: 220px;"
          size="small"
          placeholder="选择物流类型"
          @change="handleFilter"
        >
          <el-option
            v-for="item in logisticsTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <div class="filter-label">备注信息</div>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 200px;"
          size="small"
          placeholder
          v-model="listQuery.remark"
        ></el-input>
      </div>
      <el-select
        class="filter-item"
        v-model="listQuery.warehouse_id"
        filterable
        size="small"
        @change="handleFilter"
        clearable
        placeholder="仓库"
      >
        <el-option
          v-for="item in warehouseOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>

      <div class="filter-row">
        <div class="filter-item">
          <el-button
            class="filter-item"
            :disabled="sumDisabled"
            size="small"
            type="primary"
            v-waves
            icon="el-icon-tickets"
            @click="handleSumDeliveryOrders"
          >生成运单号</el-button>
        </div>
        <div class="filter-item">
          <el-button
            class="filter-item"
            :disabled="sumDisabled"
            size="small"
            type="primary"
            v-waves
            icon="el-icon-printer"
            @click="sumPrint"
          >打印订单</el-button>
        </div>
        <div class="filter-item">
          <el-button
            class="filter-item"
            size="small"
            plain
            v-waves
            icon="el-icon-download"
            @click="downExcel"
          >导出订单</el-button>
        </div>
        <div class="filter-item">
          <download-excel
            class="export-excel-wrapper"
            :data="this.datas"
            :fields="json_fields"
            name="中通模板.xls"
          >
            <el-button
              size="small"
              plain
              v-waves
              icon="el-icon-download"
              class="filter-item"
              @click="multipleSelections"
            >中通导出模板</el-button>
          </download-excel>
        </div>
        <div class="filter-item">
          <el-button
            class="filter-item"
            size="small"
            plain
            v-waves
            icon="el-icon-upload2"
            @click="handleOpenInner8"
          >导入订单物流单号</el-button>
        </div>

        <div class="filter-float">
          <div style="margin-right: 20px">
            <span>
              今日订单：
              <span style="color:red;">{{today_orders}}</span>
            </span>
            <span>
              待发货：
              <span style="color:red;">{{need_delivery}}</span>
            </span>
          </div>
          <el-button
            class="filter-item"
            size="small"
            type="primary"
            v-waves
            icon="el-icon-search"
            @click="handleFilter"
          >搜索</el-button>
        </div>
      </div>
    </div>
    <div :class="tableLoading">
      <el-tabs v-model="tabSelection" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="all"></el-tab-pane>
        <el-tab-pane label="待发货订单" name="2"></el-tab-pane>
        <el-tab-pane label="已发货订单" name="3"></el-tab-pane>
        <el-tab-pane label="断货中订单" name="4"></el-tab-pane>
        <el-tab-pane label="已签收订单" name="5"></el-tab-pane>
        <el-tab-pane label="已拒收订单" name="6"></el-tab-pane>
        <el-tab-pane name="7">
          <span slot="label">
            已完成
            <i class="el-icon-success"></i>
          </span>
        </el-tab-pane>
        <el-tab-pane name="8">
          <span slot="label">
            已退回
            <i class="el-icon-error"></i>
          </span>
        </el-tab-pane>
      </el-tabs>
      <sticky :sticky-top="74">
        <el-row>
          <el-col :span="1">
            <div class="grid-content bg-purple-light">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                :checked="checkAll"
                @change="handleCheckAllChange"
              ></el-checkbox>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">商品</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple-light">买家</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">仓储/物流</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple">价格</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple-light">状态</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">操作</div>
          </el-col>
        </el-row>
      </sticky>
      <br />
      <!--<el-checkbox-group v-model="checkedOrders" @change="handleCheckedOrdersChange">-->
      <div v-for="orders in list" :key="orders.id">
        <div
          style="border:1px solid #ebeef5;width:100%;line-height:20px;padding:15px 20px;background-color:#f7f8fa;margin-bottom:-1px;color:#323233;"
        >
          <div style="float:left;display:table-cell;line-height:30px;">
            <el-checkbox
              v-model="orders.is_checked"
              @change="(el) => {handleCheckedOrdersChange(el, orders)}"
            ></el-checkbox>
            <span>订单号： {{orders.orders_unique_id}}</span>
            <span style="margin-left:20px;">下单时间： {{orders.created_at}}</span>
            <span style="margin-left:20px;">发货时间： {{orders.delivered_at}}</span>
          </div>
          <div style="float:right;">
            <el-button size="mini" icon="el-icon-search" @click="handleOpenInner3(orders)">日志查询</el-button>
            <el-button
              v-if="orders.status === 2 || orders.status === 4"
              size="mini"
              type="success"
              @click="handleInnerUpdate3(orders, 0)"
            >
              <span>确认发货</span>
              <br />
            </el-button>
            <el-button
              v-if="orders.status === 2"
              size="mini"
              type="warning"
              @click="handleDeliverOrders(orders, 1)"
            >
              <span>断货中</span>
              <br />
            </el-button>
            <el-button
              v-if="orders.status === 3"
              size="mini"
              type="danger"
              @click="handleDestoryOrders(orders)"
            >
              <span>废弃</span>
              <br />
            </el-button>
          </div>
          <div style="clear:both;"></div>
        </div>
        <el-table
          :show-header="hideTableHeader"
          :key="tableKey2"
          :data="[orders]"
          element-loading-text="给我一点时间"
          border
          fit
          style="width: 100%;"
          :row-style="rowStyle1"
          :cell-style="cellStyle1"
        >
          <el-table-column min-width="22" align="center" label="选择">
            <template slot-scope="scope"></template>
          </el-table-column>
          <el-table-column align="left" label="商品" min-width="280">
            <template slot-scope="scope">
              <el-table
                :show-header="hideTableHeader"
                :key="tableKey2"
                :cell-style="cellStyle2"
                :data="scope.row.orders_items"
                element-loading-text="给我一点时间"
                fit
                style="width: 100%;border:none;margin-bottom:-2px;"
              >
                <el-table-column align="left" label="商品">
                  <template slot-scope="scope">
                    <p class="my-form-p">
                      {{scope.row.product_goods.goods_name}} x {{scope.row.number}}
                      <span
                        v-if="scope.row.product_goods.unit !== '0' && scope.row.product_goods.unit !== null"
                      >({{scope.row.product_goods.unit}})</span>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column min-width="200" align="center" label="收货人">
            <template slot-scope="scope">
              <p
                style="padding:0;margin:0;text-align: left;"
                slot="reference"
                class="link-type"
              >{{scope.row.orders_receiver_info.receive_name}}({{scope.row.orders_receiver_info.phone}})</p>
              <p
                style="padding:0;margin:0;text-align: left;"
              >{{ scope.row.orders_receiver_info.province_name + ' ' + scope.row.orders_receiver_info.city_name + ' ' + (scope.row.orders_receiver_info.district_name !== undefined ? scope.row.orders_receiver_info.district_name : '') + ' ' + scope.row.orders_receiver_info.address }}</p>
            </template>
          </el-table-column>
          <el-table-column min-width="125" align="center" label="发货仓">
            <template slot-scope="scope">
              <span>{{scope.row.warehouse.name}}</span>
              <br />
              <div v-if="scope.row.orders_logistics">
                <span>
                  <el-tag
                    v-if="scope.row.orders_logistics.orders_logistics_type.name"
                    style="height:20px;line-height:20px;"
                    type="warning"
                  >{{scope.row.orders_logistics.orders_logistics_type.name}}</el-tag>
                </span>
                <br />
                <div
                  v-if="scope.row.logisitics_editable !== undefined && scope.row.logisitics_editable !== null"
                >
                  <el-input
                    class="edit-input"
                    size="small"
                    v-model="scope.row.orders_logistics.logistics_number"
                  ></el-input>
                  <el-button
                    class="cancel-btn"
                    size="small"
                    icon="el-icon-refresh"
                    type="warning"
                    @click="scope.row.logisitics_editable = null"
                  >取消</el-button>
                  <el-button
                    type="success"
                    @click="updateLogisticsNumber(scope.row.id, scope.row.orders_logistics.logistics_number);scope.row.logisitics_editable = null"
                    size="small"
                    icon="el-icon-circle-check-outline"
                  >完成</el-button>
                </div>
                <span
                  class="link-type"
                  @click="handleEditLogisticsNumber(scope.row)"
                  v-else
                >{{ scope.row.orders_logistics.logistics_number }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100" align="center" label="订单金额/代收金额">
            <template slot-scope="scope">
              <span>￥{{scope.row.actual_pay}}</span>
              <br />
              <span
                v-for="(item,index) in scope.row.orders_payment.orders_payment_items" :key="index"
                :class="item.status === 2?if_deleted:''"
              >
                <span
                  v-if="item.orders_pay_type.type_code === 'cash_on_delivery' && item.paid_money > 0"
                >
                  <el-tag
                    style="height:20px;line-height:20px;"
                    :type="'danger'"
                  >代收{{item.paid_money}}</el-tag>
                </span>
                <span v-else-if="item.paid_money > 0 && item.status !== 2">
                  <el-tag
                    style="height:20px;line-height:20px;"
                    :type="'success'"
                  >已收{{item.paid_money}}</el-tag>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="80" align="center" label="状态">
            <template slot-scope="scope">
              {{scope.row.status|orderStatusTranslator}}
              <br />
              <span
                v-if="scope.row.orders_logistics !== null && scope.row.orders_logistics.print_times > 0"
              >
                <el-tag
                  style="height:20px;line-height:20px;"
                  :type="'danger'"
                >已打印{{scope.row.orders_logistics.print_times}}次</el-tag>
              </span>
              <span v-else-if="scope.row.orders_logistics !== null">
                <el-tag style="height:20px;line-height:20px;" :type="'success'">待打印</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="90" align="center" label="操作">
            <template slot-scope="scope">
              <span class="link-type" @click="printOrders(scope.row)">打印订单</span>
              <br />
              <span class="link-type" @click="handleOpenInner2(scope.row)">添加备注</span>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="orders.orders_remarks.length > 0"
          style="background-color:#fffaeb;border:1px solid #ebeef5;width:100%;line-height:10px;padding: 14px 10px 14px 20px;color:#f90;font-size:14px;margin-top:-1px;"
        >
          <span v-for="remark in orders.orders_remarks">
            <span v-if="remark.status === 1">{{remark.type_name}}：</span>
            <span v-if="remark.status === 1">{{remark.remark}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>
        </div>
        <br />
      </div>
      <!--</el-checkbox-group>-->
    </div>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50,100]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog :title="innerTableTitle2" :visible.sync="innerTableVisible2" width="90%">
      <div class="filter-container" align="right">
        <el-button
          align="right"
          class="filter-item"
          style="margin-left: 10px;"
          @click="handleInnerCreate2"
          type="primary"
          icon="el-icon-edit"
        >添加</el-button>
      </div>
      <el-table
        :key="innerTableKey2"
        :data="temp.orders_remarks"
        v-loading="innerListLoading2"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="用户身份">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.type_name}}</span>
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
        <el-table-column align="center" label="操作" width="220" class-name="small-padding">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status===1"
              size="mini"
              type="danger"
              @click="handleInnerDelete2(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="innerTableTitle3" :visible.sync="innerTableVisible3" width="90%">
      <el-table
        :key="innerTableKey3"
        :data="innerList3"
        v-loading="innerListLoading3"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" min-width="65">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作人" min-width="100px">
          <template slot-scope="scope">
            <!--<el-tag type="success">{{scope.row.type_name}}</el-tag>-->
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
        <el-pagination
          background
          @size-change="handleInnerSizeChange3"
          @current-change="handleInnerCurrentChange3"
          :current-page.sync="innerListQuery3.page"
          :page-sizes="[10,20,50, 100]"
          :page-size="innerListQuery3.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="innerTotal3"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible2" width="50%">
      <el-form
        :rules="innerRules2"
        ref="innerDataForm2"
        :model="innerTemp2"
        label-position="left"
        label-width="80px"
        style="width: 80%; margin-left:10%;"
      >
        <el-form-item label="备注信息" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 15}"
            placeholder="请输入内容"
            v-model="innerTemp2.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerDialogFormVisible2 = false">取 消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          :loading="btnLoading"
          type="primary"
          @click="createInnerData2"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible3" width="70%">
      <el-form
        :rules="innerRules3"
        ref="innerDataForm3"
        :model="innerTemp3"
        label-position="left"
        label-width="80px"
        style="width: 80%; margin-left:10%;"
      >
        <el-form-item label="物流名称" prop="orders_logistics_type.code">
          <el-select
            v-model="innerTemp3.logistics_type_id"
            @change="resetLogisticsNumber"
            style="width: 100%"
            value-key="id"
            clearable
            filterable
            remote
            placeholder="请选物流名称"
            :remote-method="queryLogisticsTypeList"
            :loading="queryLogisticsTypeLoading"
          >
            <el-option
              v-for="item in logisticsTypeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="额外信息"
          prop="product_deliver_extra_id"
          v-if="(innerTemp3.logistics_type_code === '1001' || innerTemp3.logistics_type_code === '1006' || innerTemp3.logistics_type_code === '1009' || innerTemp3.logistics_type_code === '1012') && needSelectExtra"
        >
          <el-select
            v-model="innerTemp3.warehouse_logistics_extra_id"
            style="width: 100%"
            placeholder="请选额外信息"
            :loading="productDeliverExtraLoading"
          >
            <el-option
              v-for="item in productDeliverExtraOptions"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="物流单号"
          prop="logistics_number"
          v-if="(innerTemp3.logistics_type_code !== '1001' && innerTemp3.logistics_type_code !== '1006' && innerTemp3.logistics_type_code !== '1009' && innerTemp3.logistics_type_code !== '1012')"
        >
          <el-input
            :disabled="innerTemp3.logistics_type_code === '1001' || innerTemp3.logistics_type_code === '1009'"
            v-model="innerTemp3.logistics_number"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerDialogFormVisible3 = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="logisticsDialogLoading"
          v-if="logisticsDialogLoading"
        >确认发货并打印订单</el-button>
        <el-dropdown
          v-if="!logisticsDialogLoading"
          trigger="click"
          placement="top-end"
          split-button
          type="primary"
          @click="createInnerData3(0, 1)"
          @command="handleCommand"
        >
          确认发货并打印订单
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="onlyDelivery">确认发货</el-dropdown-item>
            <el-dropdown-item command="onlyEmptyStock">断货中</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="imageDialogVisible">
      <img width="100%" :src="publicImageUrl" />
    </el-dialog>
    <el-dialog :title="innerTableTitle8" :visible.sync="innerTableVisible8">
      <div class="filter-container">
        <el-upload
          :action="baseUrl"
          :headers="uploadHeaders"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handlePictureSuccess"
          :on-progress="handleOnProgress"
          name="excel"
          :show-file-list="true"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">上传物流单号</el-button>
        </el-upload>
      </div>
      <el-table
        v-if="innerList8 !== null"
        :key="innerTableKey8"
        :data="innerList8"
        v-loading="innerListLoading8"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column min-width="100px" align="center" label="所属订单号">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.orders_unique_id}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="220px" align="center" label="物流信息">
          <template slot-scope="scope">
            <el-tag>{{scope.row.orders_logistics_type_name}}</el-tag>
            <span>{{scope.row.orders_logistics_number}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status | logisticsNumberImportStatusFilter"
            >{{scope.row.status|logisticsNumberImportStatusTranslator}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" v-if="innerList8 !== null">
        <el-button
          :loading="buttonInnerCreate8Loading"
          :disabled="(innerList8 === null) || (innerList8.length < 1)"
          type="primary"
          @click="createInnerData8"
        >确认上传物流单号</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible9" width="70%">
      <el-form
        ref="innerDataForm9"
        label-position="left"
        label-width="80px"
        style="width: 80%; margin-left:10%;"
      >
        <el-form-item label="物流名称" prop="orders_logistics_type.code">
          <el-select
            v-model="sum_logistics_type_id"
            @change="resetSumLogisticsNumber"
            style="width: 100%"
            value-key="id"
            clearable
            filterable
            remote
            placeholder="请选物流名称"
            :remote-method="queryLogisticsTypeList"
            :loading="queryLogisticsTypeLoading"
          >
            <el-option
              v-for="item in logisticsTypeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="额外信息"
          prop="product_deliver_extra_id"
          v-if="(sum_logistics_type_code === '1001' || sum_logistics_type_code === '1006' || sum_logistics_type_code === '1009' || sum_logistics_type_code === '1012') && needSelectExtra"
        >
          <el-select
            v-model="sum_warehouse_extra_id"
            style="width: 100%"
            placeholder="请选额外信息"
            :loading="productDeliverExtraLoading"
          >
            <el-option
              v-for="item in productDeliverExtraOptions"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerDialogFormVisible9 = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="logisticsDialogLoading"
          v-if="logisticsDialogLoading"
        >生成运单号并打印订单</el-button>
        <el-dropdown
          v-if="!logisticsDialogLoading"
          trigger="click"
          placement="top-end"
          split-button
          type="primary"
          @click="sumDeliveryOrdersAndPrint(1)"
          @command="handleSumCommand"
        >
          生成运单号并打印订单
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="onlySumDelivery">生成运单号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="innerDialogFormVisible10" width="40%">
      <p>批量任务数量: {{sumTotalTask}}</p>
      <p>待执行数量: {{sumRemainTask}}</p>
      <p>
        成功数量:
        <span style="color:green;">{{sumSuccessTask}}</span>
      </p>
      <p>
        错误数量:
        <span style="color:red;">{{sumFailedTask}}</span>
      </p>
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="sumTaskPercentage"
        status="success"
      ></el-progress>
    </el-dialog>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0">
      <defs>
        <filter id="f1">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script>
import {
  getWarehouseLogisticsExtraList,
  getWarehouseList
} from "@/api/product";
import {
  getOrdersCountInfo,
  getOrdersList,
  deleteOrdersRemark,
  createOrdersRemark,
  updateOrdersLogistics,
  getOrdersLogisticsTypeList,
  getOrdersSFLogisticsNumber,
  getOrdersLogsList,
  getOrdersYTOLogisticsNumber,
  getOrdersZTOLogisticsNumber,
  getOrdersDepponLogisticsNumber,
  destroyOrders,
  deliverOrders,
  updateOrdersLogisticsPrintTimes,
  updateOrdersLogisticsNumber
} from "@/api/orders";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { print_orders } from "@/utils/print_orders";
import { sum_print_orders } from "@/utils/sum_print_orders";
import waves from "@/directive/waves"; // 水波纹指令
import Multiselect from "vue-multiselect"; // 使用的一个多选框组件，element-ui的select不能满足所有需求
import "vue-multiselect/dist/vue-multiselect.min.css"; // 多选框组件css
import { getLodop } from "@/directive/lodop/LodopFuncs";
import { mapGetters } from "vuex";
import { parseTime } from "@/utils/index";

export default {
  name: "ordersManage",
  components: {
    Multiselect
  },
  directives: {
    waves
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      const myreg = /^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/;
      if (!myreg.test(this.innerTemp4.phone)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    const validate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("输入"));
      }
      if (/^\d+(\.\d+)?$/.test(value)) {
        callback();
      } else {
        callback(new Error("输入数字"));
      }
    };
    return {
      datas: [],
      multipleSelection: [],
      json_fields: {}, //导出数据
      warehouseOptions: [],
      tableLoading: "",
      scrollTop: 0,
      ifExpandAll: false,
      tableKey: 0,
      tableKey2: 0,
      tableKey3: 1,
      list: [],
      list1: null,
      total: null,
      total1: null,
      listLoading: false,
      chooseId: undefined,
      listQuery: {
        date_range: "",
        created_at: "",
        page: 1,
        page_size: 20,
        weixin_fans_address_receive_name: "",
        weixin_fans_address_phone: "",
        sort: "-delivered_at",
        orders_unique_id: "",
        orders_logistics_number: "",
        status: 2,
        remark: "",
        logistics_type_id: undefined,
        warehouse_id: undefined
      },
      props: {
        value: "area_number",
        label: "area_name",
        children: "children"
      },
      btnLoading: false,
      btnDisabled: true,
      productDeliverExtraOptions: [],
      productDeliverExtraLoading: false,
      productDeliverOptions: [],
      queryLogisticsTypeOptions: [],
      queryLogisticsTypeLoading: false,
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "按ID升序列", key: "+id" },
        { label: "按ID降序", key: "-id" }
      ],
      statusOptions: [
        { key: 2, label: "待发货" },
        { key: 3, label: "发货中" },
        { key: 4, label: "断货中" },
        { key: 6, label: "已拒收" },
        { key: 8, label: "已退回" },
        { key: 9, label: "已废弃" }
      ],
      expandList: [],
      temp: {
        id: undefined,
        orders_unique_id: "",
        support_user_account_id: undefined,
        product_weixin_id: undefined,
        product_weixin_fans_id: undefined,
        product_weixin_fans_address_id: undefined,
        price_total: undefined,
        actual_pay: 0.0,
        status: 1,
        deliver_date: new Date(),
        orders_items: [],
        support_member: {
          id: undefined,
          user_id: undefined,
          nickname: "",
          head_img: "",
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
          weixin_nickname: "",
          weixin_account: "",
          phone: "",
          qq: "",
          promotion_channel: {
            id: undefined,
            channel_name: ""
          },
          product_goods: {
            id: undefined,
            goods_name: "",
            price: undefined,
            stock: undefined
          }
        },
        product_weixin_fans_address: {
          id: undefined,
          product_weixin_fans_id: undefined,
          city_name: "",
          district_name: "",
          province_name: "",
          receive_name: "",
          phone: "",
          postcode: "",
          address: "",
          remark: ""
        },
        product_weixin_fans: {
          id: undefined,
          product_weixin_id: undefined,
          weixin_account: "",
          weixin_nickname: "",
          default_address_id: undefined,
          created_at: ""
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
          logistics_name: "",
          logistics_number: "",
          orders_logistics_type: {
            code: ""
          }
        }
      },
      tempOrderRemark: {
        id: undefined,
        orders_id: undefined,
        user_account_id: undefined,
        user_account_type_id: undefined,
        remark: "",
        created_at: ""
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      innerList2: null,
      innerTotal2: null,
      innerTableKey2: 2,
      innerTableTitle2: "",
      innerListQuery2: {
        page: 1,
        page_size: 5,
        product_id: undefined,
        sort: "-id"
      },
      innerTemp2: {
        id: undefined,
        product: undefined,
        number: ""
      },
      innerListLoading2: false,
      innerTableVisible2: false,
      innerDialogFormVisible2: false,
      innerRules2: {
        remark: [
          { required: true, message: "输入备注信息内容", trigger: "change" }
        ]
      },
      innerListLoading1: false,
      innerListLoading3: false,
      innerTableVisible3: false,
      innerTableTitle3: "",
      innerTableKey3: 3,
      innerList3: null,
      innerTotal3: null,
      innerListQuery3: {
        page: 1,
        page_size: 10,
        sort: "-id",
        orders_id: undefined
      },
      innerTemp3: {
        id: undefined,
        warehouse_id: undefined,
        warehouse_logistics_extra_id: undefined,
        warehouse_logistics_extra: undefined,
        logistics_type_id: undefined,
        logistics_type_code: "",
        logistics_number: "",
        dest_code: "",
        dest_extra_code: ""
      },
      innerDialogFormVisible3: false,
      innerRules3: {
        template_name: [
          { required: true, message: "请正确填写模板名称", trigger: "change" }
        ],
        template_code: [
          { required: true, message: "请正确填写模板内容", trigger: "change" }
        ]
      },
      logisticsTypeOptions: [],
      if_deleted: "deleted-p",
      publicImageUrl: "",
      imageDialogVisible: false,
      today_orders: 0,
      need_delivery: 0,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      sf_monthly_account: "",
      innerTableTitle8: "上传物流单号Excel",
      innerTableKey8: 8,
      innerTableVisible8: false,
      buttonInnerCreate8Loading: false,
      baseUrl: process.env.BASE_API + "/api/orders/uploadOrdersLogisticsExcel",
      uploadHeaders: {
        authorization: this.$store.state.user.token
      },
      innerListLoading8: false,
      innerList8: null,
      fileList: [],
      hideTableHeader: false,
      tabSelection: "2",
      needSelectExtra: false,
      logisticsDialogLoading: false,
      isIndeterminate: false,
      checkAll: false,
      ordersOptions: [],
      checkedOrders: [],
      innerDialogFormVisible9: false,
      sum_logistics_type_id: undefined,
      sum_logistics_type_code: undefined,
      sum_warehouse_extra_id: undefined,
      sum_warehoue_extra: undefined,
      sumDisabled: true,
      sumTotalTask: 0,
      sumRemainTask: 0,
      sumSuccessTask: 0,
      sumFailedTask: 0,
      innerDialogFormVisible10: false,
      is_checkeds:'',
    };
  },
  computed: {
    sumTaskPercentage() {
      let returnPercentage = 0;
      if (this.sumTotalTask > 0) {
        returnPercentage =
          Math.round(
            ((this.sumTotalTask - this.sumRemainTask) / this.sumTotalTask) *
              10000
          ) / 100;
      }

      return returnPercentage;
    },
    ...mapGetters(["user_account_id", "roles"])
  },
  filters: {
    orderStatusFilter(status) {
      const statusMap = {
        0: "info",
        1: "info",
        2: "warning",
        3: "success",
        4: "danger",
        5: "success",
        6: "danger",
        7: "success",
        8: "danger",
        9: "danger"
      };
      return statusMap[status];
    },
    orderStatusTranslator(status) {
      const statusMap = {
        0: "无效订单",
        1: "未确认",
        2: "待发货",
        3: "发货中",
        4: "断货中",
        5: "已签收",
        6: "已拒收",
        7: "已完成",
        8: "已退回",
        9: "废弃",
        10: "已退款"
      };
      return statusMap[status];
    },
    logisticsNumberImportStatusFilter(status) {
      const statusMap = {
        0: "info",
        1: "success",
        2: "danger"
      };
      return statusMap[status];
    },
    logisticsNumberImportStatusTranslator(status) {
      const statusMap = {
        0: "未确认",
        1: "已导入",
        2: "导入失败"
      };
      return statusMap[status];
    }
  },
  created() {
    this.handleFilter();
    this.queryLogisticsTypeList();
    this.getWarehouseList();
  },
  methods: {
    handleCheckedOrdersChange(value, orders) {
      if(value == true){
          this.multipleSelection.push(orders);
      }
      let checkedCount = 0;

      for (const v of this.list) {
        if (v.id === orders.id) {
          const index = this.list.indexOf(v);
          v.is_checked = value;
          this.list.splice(index, 1, v);
        }
        if (v.is_checked === true) {
          checkedCount++;
        }
      }
      this.sumDisabled = checkedCount <= 0;
      this.checkAll = checkedCount === this.list.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.list.length;
    },
    //中通导出订单
    multipleSelections() {
      //判断是否选中数据
      if (this.multipleSelection.length == 0) {
        this.$message("请选择数据");
        return;
      }
      //将拿到的数据循环,因为插件不支持拿到数组里面的内容，需要重新声明对象和数组将值赋值过去
      this.multipleSelection.map(v => {
        const dataList = {};
        dataList.orders_unique_id = v.orders_unique_id;
        dataList.paid_money = v.orders_payment.orders_payment_items[0].paid_money;
        dataList.receive_name = v.orders_receiver_info.receive_name;
        dataList.phone = v.orders_receiver_info.phone;
        dataList.macks = v.orders_receiver_info.phone;
        dataList.orders_receiver_infos =
          v.orders_receiver_info.province_name +
          v.orders_receiver_info.city_name +
          v.orders_receiver_info.district_name +
          v.orders_receiver_info.address;
        dataList.paidremoos = v.orders_receiver_info.receive_name;
        dataList.goods_name = v.orders_items.map(res=> {
              return res.product_goods.goods_name;
        }).join(',');
        dataList.number = v.orders_items.map(res=> {
              return res.number;
        }).join(',');
        dataList.remark = v.orders_remarks.map(res=> {
             if(res.status == 1){
                 return res.remark;
             }
        }).join(',');
        dataList.remarks = v.orders_remarks.map(res=> {
             if(res.status == 2){
                 return res.remark;
             }
        }).join(',');
        this.datas.push(dataList);
      });
      //导出的头部和内容
      this.json_fields.订单号 = "orders_unique_id";
      this.json_fields.代收金额 = "paid_money";
      this.json_fields.收件人姓名 = "receive_name";
      this.json_fields.收件人手机 = "phone";
      this.json_fields.收件人电话 = "macks";
      this.json_fields.收件人地址 = "orders_receiver_infos";
      this.json_fields.收件人单位 = "paidremoos";
      this.json_fields.品名 = "goods_name";
      this.json_fields.数量 = "number";
      this.json_fields.买家备注 = "remarks";
      this.json_fields.卖家备注 = "remark";
      //清空导出数组和单选框和全部
      this.datas = []
      this.multipleSelection = [];
      this.checkAll = false
      this.list.map(res=>{
        res.is_checked = false
      })
    },

    getWarehouseList() {
      getWarehouseList().then(response => {
        this.warehouseOptions = response.data.data;
      });
    },
    handleEditLogisticsNumber(row) {
      this.$set(row, "logisitics_editable", 1);
    },
    updateLogisticsNumber(orders_id, logistics_number) {
      const tempData = {};
      tempData.orders_id = orders_id;
      tempData.logistics_number = logistics_number;
      updateOrdersLogisticsNumber(tempData).then(() => {
        this.actualPayEditable = false;
      });
    },
    async createInnerData8() {
      this.buttonInnerCreate8Loading = true;
      for (const v of this.innerList8) {
        const params = {};
        params.orders_unique_id = v.orders_unique_id;
        params.logistics_type_id = v.logistics_type_id;
        params.logistics_number = v.orders_logistics_number;
        try {
          const returnData = await updateOrdersLogistics(params);
          await deliverOrders({
            orders_id: returnData.data.orders_id,
            is_empty: 0
          });
          v.status = 1;
        } catch (error) {
          v.status = 2;
        }
        const index = this.innerList8.indexOf(v);
        this.innerList8.splice(index, 1, v);
      }
      this.buttonInnerCreate8Loading = false;
    },
    resetSumDeliveryParams() {
      this.sum_logistics_type_id = undefined;
      this.sum_logistics_type_code = undefined;
      this.sum_warehouse_extra_id = undefined;
      this.sum_warehouse_extra = undefined;
    },
    handleSumDeliveryOrders() {
      this.resetSumDeliveryParams();
      this.innerDialogFormVisible9 = true;
    },
    resetSumLogisticsNumber() {
      this.productDeliverExtraOptions = [];
      this.sum_logistics_type_code = this.logisticsTypeOptions[
        this.logisticsTypeOptions.findIndex(
          d => d.id === this.sum_logistics_type_id
        )
      ].code;
      this.sum_warehouse_extra_id = undefined;
      this.getSumWarehouseLogisticsExtraList(" ");
    },
    getSumWarehouseLogisticsExtraList() {
      getWarehouseList().then(res => {
        const warehouseList = res.data.data;
        if (!(warehouseList instanceof Array) || warehouseList.length <= 0) {
          this.$message({
            type: "info",
            message: "仓库信息配置错误"
          });
          return;
        }
        const warehouseId = warehouseList[0].id;
        this.productDeliverExtraLoading = true;
        getWarehouseLogisticsExtraList({
          order_logistics_type_id: this.sum_logistics_type_id,
          warehouse_id: warehouseId
        }).then(response => {
          this.productDeliverExtraOptions = response.data;
          this.productDeliverExtraLoading = false;
          if (
            this.productDeliverExtraOptions instanceof Array &&
            this.productDeliverExtraOptions.length > 0
          ) {
            this.sum_warehouse_extra_id = this.productDeliverExtraOptions[0].id;
            this.sum_warehouse_extra = this.productDeliverExtraOptions[0];
            if (this.productDeliverExtraOptions.length > 1) {
              this.needSelectExtra = true;
            }
          }
        });
      });
    },
    handleCheckAllChange(val) {
      const is_checked = val ? true : false;
      this.sumDisabled = !is_checked;
      this.is_checkeds = val
      console.log(val,11111)
      if(val == true){
          this.list.map(v=>{
             this.multipleSelection.push(v)
          })
      }
      for (const v of this.list) {
        const index = this.list.indexOf(v);
        v.is_checked = is_checked;
        this.list.splice(index, 1, v);
      }
      this.checkAll = is_checked;
      this.isIndeterminate = false;
    },
    handleCommand(command) {
      if (command === "onlyDelivery") {
        this.createInnerData3(0, 0);
      } else if (command === "onlyEmptyStock") {
        this.createInnerData3(1, 0);
      }
    },
    handleSumCommand(command) {
      if (command === "onlySumDelivery") {
        this.sumDeliveryOrdersAndPrint(0);
      }
    },
    handleClick(tab, event) {
      this.listQuery.status = "";
      if (tab.name !== "all") {
        this.listQuery.status = parseInt(tab.name);
      }
      this.handleFilter();
    },
    rowStyle1() {
      return "min-height: 160px;";
    },
    cellStyle1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "padding: 0px;border-bottom:none;";
      }
    },
    cellStyle2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "border-right:none;";
      }
    },
    getWarehouseLogisticsExtraList() {
      this.productDeliverExtraLoading = true;
      getWarehouseLogisticsExtraList({
        order_logistics_type_id: this.innerTemp3.logistics_type_id,
        warehouse_id: this.innerTemp3.warehouse_id
      }).then(response => {
        this.productDeliverExtraOptions = response.data;
        this.productDeliverExtraLoading = false;
        if (
          this.productDeliverExtraOptions instanceof Array &&
          this.productDeliverExtraOptions.length > 0
        ) {
          this.innerTemp3.warehouse_logistics_extra_id = this.productDeliverExtraOptions[0].id;
          this.innerTemp3.warehouse_logistics_extra = this.productDeliverExtraOptions[0];
          if (this.productDeliverExtraOptions.length > 1) {
            this.needSelectExtra = true;
          }
        }
      });
    },
    resetLogisticsNumber() {
      this.productDeliverExtraOptions = [];
      this.innerTemp3.logistics_type_code = this.logisticsTypeOptions[
        this.logisticsTypeOptions.findIndex(
          d => d.id === this.innerTemp3.logistics_type_id
        )
      ].code;
      this.innerTemp3.logistics_number = "";
      this.innerTemp3.dest_code = undefined;
      this.innerTemp3.dest_extra_code = undefined;
      this.innerTemp3.warehouse_logistics_extra_id = undefined;
      this.getWarehouseLogisticsExtraList(" ");
    },
    getOrdersCountInfo() {
      getOrdersCountInfo({}).then(response => {
        this.today_orders = response.data.today_orders;
        this.need_delivery = response.data.need_delivery;
      });
    },
    printOrders(row) {
      console.log(row, 11111);
      updateOrdersLogisticsPrintTimes({ orders_id: row.id });
      print_orders(row);
    },
    queryLogisticsTypeList() {
      this.queryLogisticsTypeLoading = true;
      getOrdersLogisticsTypeList().then(res => {
        this.logisticsTypeOptions = res.data.data;
        this.queryLogisticsTypeLoading = false;
      });
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
      this.getOrdersCountInfo();
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleDeliverOrders(row, empty) {
      const tempParms = {
        orders_id: row.id,
        is_empty: empty
      };
      deliverOrders(tempParms)
        .then(res => {
          if (empty === 0) {
            row.status = 3;
          } else {
            row.status = 4;
          }
        })
        .catch(() => {});
    },
    handleDestoryOrders(row) {
      this.$confirm("此操作将永久删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const tempParms = {
            orders_id: row.id
          };
          destroyOrders(tempParms)
            .then(res => {
              row.status = 9;
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleOpenInner2(row) {
      this.innerTableVisible2 = true;
      this.innerTableTitle2 = row.orders_unique_id + " -- 备注";
      this.temp = Object.assign({}, row); // copy obj
      // this.getInnerList1()
    },
    // 打开关闭行
    expandRow(row, expandedRows) {
      this.expandList = expandedRows.map(item => {
        return item.id;
      });
      console.log(this.expandList);
    },
    handleInnerSizeChange3(val) {
      this.innerListQuery3.page_size = val;
      this.getInnerList3();
    },
    handleInnerCurrentChange3(val) {
      this.innerListQuery3.page = val;
      this.getInnerList3();
    },
    getInnerList3() {
      this.innerListQuery3.orders_id = this.temp.id;
      this.innerListLoading3 = true;
      getOrdersLogsList(this.innerListQuery3).then(response => {
        this.innerList3 = response.data.data;
        this.innerTotal3 = response.data.total;
        this.innerListLoading3 = false;
      });
    },
    handleOpenInner3(row) {
      this.innerTableVisible3 = true;
      this.innerTableTitle3 = row.orders_unique_id + " -- 订单日志";
      this.temp = Object.assign({}, row); // copy obj
      this.getInnerList3();
    },
    resetInnerTemp2() {
      this.innerTemp2 = {};
    },
    handleInnerCreate2() {
      this.resetInnerTemp2();
      this.dialogStatus = "create";
      this.innerDialogFormVisible2 = true;
      this.$nextTick(() => {
        this.$refs["innerDataForm1"].clearValidate();
      });
    },
    createInnerData2() {
      this.$refs["innerDataForm2"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.innerTemp2.orders_id = this.temp.id;
          createOrdersRemark(this.innerTemp2)
            .then(response => {
              this.innerTotal2++;
              this.innerTemp2.id = response.data.id;
              this.innerTemp2.status = 1;
              this.innerTemp2.type_name = response.data.type_name;
              this.innerTemp2.updated_at = response.data.updated_at;
              this.temp.orders_remarks.push(this.innerTemp2);
              this.innerDialogFormVisible2 = false;
              this.btnLoading = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            })
            .catch(() => {
              this.btnLoading = false;
            });
        }
      });
    },
    handleInnerDelete2(row) {
      this.$confirm("确定删除此备注?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const ttempData = Object.assign({}, row); // copy obj
          ttempData.orders_remark_id = row.id;
          deleteOrdersRemark(ttempData).then(response => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            ttempData.status = 0;
            const index = this.temp.orders_remarks.indexOf(row);
            this.temp.orders_remarks.splice(index, 1, ttempData);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    resetInnerTemp3() {
      this.innerTemp3 = {
        id: undefined,
        warehouse_id: undefined,
        warehouse_logistics_extra_id: undefined,
        logistics_type_id: undefined,
        logistics_type_code: "",
        logistics_number: "",
        dest_code: "",
        dest_extra_code: ""
      };
    },
    handleInnerUpdate3(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "update";
      this.innerDialogFormVisible3 = true;
      if (row.orders_logistics !== null) {
        this.innerTemp3 = Object.assign({}, row.orders_logistics);
        this.innerTemp3.warehouse_id = this.temp.warehouse_id;
        this.innerTemp3.logistics_type_code =
          row.orders_logistics.orders_logistics_type.code;
      } else {
        this.resetInnerTemp3();
        this.innerTemp3.warehouse_id = this.temp.warehouse_id;
      }
    },
    async sumPrint() {
      const LODOP = getLodop();
      if (LODOP == null || typeof LODOP.VERSION === "undefined") {
        this.$message({
          type: "info",
          message: "请先安装lodop控件"
        });
        return;
      }
      try {
        this.logisticsDialogLoading = true;
        for (const v of this.list) {
          if (v.is_checked) {
            await updateOrdersLogisticsPrintTimes({ orders_id: v.id });
            sum_print_orders(v);
          }
        }
      } catch (error) {
      } finally {
        this.checkAll = false;
        this.isIndeterminate = false;
        this.logisticsDialogLoading = false;
      }
    },
    resetSumTask() {
      this.sumTotalTask = 0;
      this.sumRemainTask = 0;
      this.sumSuccessTask = 0;
      this.sumFailedTask = 0;
    },
    async sumDeliveryOrdersAndPrint(ifPrint) {
      if (ifPrint) {
        const LODOP = getLodop();
        // if ((LODOP == null) || (typeof (LODOP.VERSION) === 'undefined')) {
        //   this.$message({
        //     type: 'info',
        //     message: '请先安装lodop控件'
        //   })
        //   return
        // }
      }
      this.resetSumTask();
      for (const v of this.list) {
        if (v.is_checked) {
          this.sumTotalTask += 1;
          this.sumRemainTask += 1;
        }
      }
      this.innerDialogFormVisible9 = false;
      this.innerDialogFormVisible10 = true;
      this.logisticsDialogLoading = true;

      for (const v of this.list) {
        if (v.is_checked) {
          try {
            // 生成物流单号
            const tempdata = {};
            tempdata.orders_id = v.id;
            tempdata.logistics_type_id = this.sum_logistics_type_id;
            tempdata.warehouse_extra_id = this.sum_warehouse_extra_id;
            let logisticsNumberInfo = null;
            if (this.sum_logistics_type_code === "1001") {
              logisticsNumberInfo = await getOrdersSFLogisticsNumber(tempdata);
            } else if (this.sum_logistics_type_code === "1006") {
              logisticsNumberInfo = await getOrdersYTOLogisticsNumber(tempdata);
            } else if (this.sum_logistics_type_code === "1009") {
              logisticsNumberInfo = await getOrdersDepponLogisticsNumber(
                tempdata
              );
            } else if (this.sum_logistics_type_code === "1012") {
              logisticsNumberInfo = await getOrdersZTOLogisticsNumber(tempdata);
            } else {
              this.$message({
                type: "info",
                message: "不支持批量操作的物流方式"
              });
              break;
            }
            if (logisticsNumberInfo === null) {
              this.$message({
                type: "info",
                message: "获取物流单号信息错误"
              });
              continue;
            }
            // 更新订单物流单号
            tempdata.logistics_number =
              logisticsNumberInfo.data.logistics_number;
            tempdata.dest_code = logisticsNumberInfo.data.dest_code;
            tempdata.dest_extra_code = logisticsNumberInfo.data.dest_extra_code;
            await updateOrdersLogistics(tempdata);
            // 操作订单发货
            // await deliverOrders({orders_id: v.id, is_empty: 0})
            v.orders_logistics = {};
            v.orders_logistics.orders_logistics_type = {};
            v.orders_logistics.logistics_number =
              logisticsNumberInfo.data.logistics_number;
            v.orders_logistics.orders_logistics_type.code = this.sum_logistics_type_code;
            v.orders_logistics.dest_code = logisticsNumberInfo.data.dest_code;
            v.orders_logistics.dest_extra_code =
              logisticsNumberInfo.data.dest_extra_code;
            v.orders_logistics.product_deliver_extra = this.sum_warehouse_extra;
            // 打印订单
            if (ifPrint) {
              await updateOrdersLogisticsPrintTimes({ orders_id: v.id });
              sum_print_orders(v);
            }
            this.sumSuccessTask += 1;
          } catch (error) {
            console.log(error.message);
            this.sumFailedTask += 1;
          } finally {
            this.sumRemainTask -= 1;
          }
        }
      }
      this.checkAll = false;
      this.isIndeterminate = false;
      this.logisticsDialogLoading = false;

      const listInfo = await getOrdersList(this.listQuery);
      this.getOrdersCountInfo();
      this.list = listInfo.data.data;
      this.total = listInfo.data.total;
      for (const v of this.list) {
        const index = this.list.indexOf(v);
        v.is_checked = false;
        this.list.splice(index, 1, v);
      }
    },
    async createInnerData3(empty, ifPrint) {
      if (ifPrint) {
        const LODOP = getLodop();
        // if ((LODOP == null) || (typeof (LODOP.VERSION) === 'undefined')) {
        //   this.$message({
        //     type: 'info',
        //     message: '请先安装lodop控件'
        //   })
        //   return
        // }
      }
      try {
        this.logisticsDialogLoading = true;
        const tempdata = {};
        tempdata.orders_id = this.temp.id;
        tempdata.warehouse_extra_id = this.innerTemp3.warehouse_logistics_extra_id;
        let logisticsNumberInfo = null;
        if (this.innerTemp3.logistics_type_code === "1001") {
          logisticsNumberInfo = await getOrdersSFLogisticsNumber(tempdata);
        } else if (this.innerTemp3.logistics_type_code === "1006") {
          logisticsNumberInfo = await getOrdersYTOLogisticsNumber(tempdata);
        } else if (this.innerTemp3.logistics_type_code === "1009") {
          logisticsNumberInfo = await getOrdersDepponLogisticsNumber(tempdata);
        } else if (this.innerTemp3.logistics_type_code === "1012") {
          logisticsNumberInfo = await getOrdersZTOLogisticsNumber(tempdata);
        }
        if (logisticsNumberInfo !== null) {
          this.innerTemp3.logistics_number =
            logisticsNumberInfo.data.logistics_number;
          this.innerTemp3.dest_code = logisticsNumberInfo.data.dest_code;
          this.innerTemp3.dest_extra_code =
            logisticsNumberInfo.data.dest_extra_code;
        }
        // 更新物流单号
        const tempData = this.innerTemp3;
        tempData.orders_id = this.temp.id;
        tempData.warehouse_extra_id = this.innerTemp3.warehouse_logistics_extra_id;
        await updateOrdersLogistics(tempData);
        // 发货
        const tempParams = {
          orders_id: this.temp.id,
          is_empty: empty
        };
        await deliverOrders(tempParams);
        // 获取订单列表
        const listInfo = await getOrdersList(this.listQuery);
        this.getOrdersCountInfo();
        this.list = listInfo.data.data;
        this.total = listInfo.data.total;
        for (const v of this.list) {
          const index = this.list.indexOf(v);
          v.is_checked = false;
          this.list.splice(index, 1, v);
        }
        this.temp.orders_logistics = {
          logistics_number: this.innerTemp3.logistics_number
        };
        if (
          this.innerTemp3.logistics_type_code !== undefined &&
          this.innerTemp3.logistics_type_code !== null
        ) {
          this.temp.orders_logistics.orders_logistics_type = {
            code: this.innerTemp3.logistics_type_code
          };
        }
        if (
          this.innerTemp3.dest_code !== undefined &&
          this.innerTemp3.dest_code !== null
        ) {
          this.temp.orders_logistics.dest_code = this.innerTemp3.dest_code;
        }
        if (
          this.innerTemp3.dest_extra_code !== undefined &&
          this.innerTemp3.dest_extra_code !== null
        ) {
          this.temp.orders_logistics.dest_extra_code = this.innerTemp3.dest_extra_code;
        }
        if (
          this.innerTemp3.warehouse_logistics_extra !== undefined &&
          this.innerTemp3.warehouse_logistics_extra !== null
        ) {
          this.temp.orders_logistics.product_deliver_extra = this.innerTemp3.warehouse_logistics_extra;
        }
        if (ifPrint) {
          this.printOrders(this.temp);
        }
        this.logisticsDialogLoading = false;
        this.innerDialogFormVisible3 = false;
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
          duration: 2000
        });
      } catch (error) {
        console.log(error.message);
        this.logisticsDialogLoading = false;
      }
    },
    getList() {
      this.tableLoading = "filtered";
      getOrdersList(this.listQuery).then(response => {
        this.list = response.data.data;
        console.log(this.list, 999999);
        this.total = response.data.total;
        for (const v of this.list) {
          const index = this.list.indexOf(v);
          v.is_checked = false;
          this.list.splice(index, 1, v);
        }
        this.tableLoading = "";
      });
    },

    downExcel() {
      //前端实现表单将参数给后端，后端负责导出
      // console.log(this.listQuery.date_range)
      const form = document.createElement("form");
      form.action =
        process.env.BASE_API +
        "/api/orders/downloadNeedDeliveredOrders" +
        "?token=" +
        this.$store.state.user.token;
      form.method = "post";
      form.style.display = "none";
      const orders_status = document.createElement("input");
      // 订单状态
      const orders_unique_id = document.createElement("input");
      //仓库
      const warehouse_id = document.createElement("input");
      // 订单号
      const orders_logistics_number = document.createElement("input");
      // 物流单号
      const group_name = document.createElement("input");
      // 客服部门
      const nickname = document.createElement("input");
      // 客服
      const product_weixin_id = document.createElement("input");
      // 搜索微信号
      const product_name = document.createElement("input"); // 产品名称
      const receive_name = document.createElement("input");
      // 收件人姓名
      const receive_phone = document.createElement("input");
      // 收件人电话
      const remark = document.createElement("input");
      // 备注
      let need_select_time = true;
      if (
        this.listQuery.date_range !== null &&
        this.listQuery.date_range !== undefined &&
        this.listQuery.date_range !== ""
      ) {
        need_select_time = false;
        const date_range = document.createElement("input");
        const date_range2 = document.createElement("input");
        date_range.name = "date_range[0]";
        date_range.value = this.listQuery.date_range[0];
        date_range2.name = "date_range[1]";
        date_range2.value = this.listQuery.date_range[1];
        form.appendChild(date_range);
        form.appendChild(date_range2);
        const sdate = new Date(date_range.value);
        const now = new Date(date_range2.value);
        const days = now.getTime() - sdate.getTime();
        const day = parseInt(days / (1000 * 60 * 60 * 24));
        if (day > 31) {
          this.$message({
            type: "info",
            message: "最多只能导出30天数据"
          });
          return;
        }
      }
      if (
        this.listQuery.created_at !== null &&
        this.listQuery.created_at !== undefined &&
        this.listQuery.created_at !== ""
      ) {
        need_select_time = false;
        const created_at = document.createElement("input");
        const created_at2 = document.createElement("input");
        created_at.name = "created_at[0]";
        created_at.value = this.listQuery.created_at[0];
        created_at2.name = "created_at[1]";
        created_at2.value = this.listQuery.created_at[1];
        form.appendChild(created_at);
        form.appendChild(created_at2);

        const sdate = new Date(created_at.value);
        const now = new Date(created_at2.value);
        const days = now.getTime() - sdate.getTime();
        const day = parseInt(days / (1000 * 60 * 60 * 24));
        if (day > 31) {
          this.$message({
            type: "info",
            message: "最多只能导出30天数据"
          });
          return;
        }
      }
      if (need_select_time) {
        this.$message({
          type: "info",
          message: "请选择时间区间"
        });
        return;
      }
      orders_status.name = "status";
      orders_status.value = this.listQuery.status;
      warehouse_id.name = "warehouse_id";
      warehouse_id.value = this.listQuery.warehouse_id;
      orders_unique_id.name = "orders_unique_id";
      orders_unique_id.value = this.listQuery.orders_unique_id;
      orders_logistics_number.name = "orders_logistics_number";
      orders_logistics_number.value = this.listQuery.orders_logistics_number;
      group_name.name = "support_user_account_group_id";
      group_name.value = this.listQuery.support_user_account_group_id;
      nickname.name = "support_member_nickname";
      nickname.value = this.listQuery.support_member_nickname;
      product_weixin_id.name = "product_weixin_id";
      product_weixin_id.value = this.listQuery.product_weixin_id;
      product_name.name = "product_name";
      product_name.value = this.listQuery.product_name;
      receive_name.name = "weixin_fans_address_receive_name";
      receive_name.value = this.listQuery.weixin_fans_address_receive_name;
      receive_phone.name = "weixin_fans_address_phone";
      receive_phone.value = this.listQuery.weixin_fans_address_phone;
      remark.name = "remark";
      remark.value = this.listQuery.remark;
      form.appendChild(orders_status);
      form.appendChild(orders_unique_id);
      form.appendChild(warehouse_id);
      form.appendChild(orders_logistics_number);
      form.appendChild(group_name);
      form.appendChild(nickname);
      form.appendChild(product_weixin_id);
      form.appendChild(product_name);
      form.appendChild(receive_name);
      form.appendChild(receive_phone);
      form.appendChild(remark);
      const button = document.createElement("input");
      button.type = "submit";
      form.appendChild(button);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    handlePreview(file) {
      console.log(1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleOnProgress(event, file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件`);
    },
    handlePictureSuccess(response, file, fileList) {
      this.innerListLoading8 = false;
      this.fileList = [];
      this.fileList.push(file);
      if (response.code === 200) {
        this.innerList8 = response.data;
      } else {
        this.$message.error(response.errstr);
        this.innerList8 = null;
      }
    },
    handleOpenInner8() {
      this.innerList8 = null;
      this.fileList = [];
      this.innerTableVisible8 = true;
    }
  },
  deactivated() {
    this.scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
  },
  activated() {
    window.scrollTo(0, this.scrollTop);
  }
};
</script>
<style scoped>
.el-tag {
  height: 24px;
  line-height: 22px;
  font-size: 14px;
  font-weight: 600;
  padding: 0 4px;
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

.my-edit-type,
.my-edit-type:focus {
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

.deleted-p {
  text-decoration: crimson underline overline line-through;
  text-decoration: underline overline line-through;
}

.logBtn {
  float: right;
  margin-right: 50px;
}
.grid-content {
  text-align: left;
  background-color: #edf2f9;
  color: #323233;
  padding: 15px 25px;
}
.filtered {
  -webkit-filter: url(#f1);
  filter: url(#f1);
}
</style>
