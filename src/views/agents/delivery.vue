<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索 | 添加2 -->
    <div class="filter-container">
      <el-select
        @change="handleFilter"
        style="width: 200px"
        class="filter-item"
        v-model="recordList.status"
        placeholder="状态"
        clearable
      >
        <el-option
          v-for="item in commentOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <!-- <el-button v-print="'#form1'">打印</el-button> -->
      <el-button class="filter-item el-icon-printer" type="primary" @click="handleBatchPrintCode">
        <span style="margin-left:5px">打印出货单</span>
      </el-button>
    </div>
    <!-- 查看提货单 -->
    <el-table
      :stripe="true"
      :data="dataList"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      ref="table"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品ID">
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.agent_goods.goods_image" style="width:100px;height:100px" />
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="订单二维码">
        <template slot-scope="scope">
          <div :id="`qrcode${scope.row.id}`" style="margin-left:10px"></div>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="商品价格">
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.actual_price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品规格">
        <template slot-scope="scope">
          <span>{{scope.row.agent_goods.goods_specs}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提货量">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提货时间">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提货人">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | groupFuncTranslator}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="recordList.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="recordList.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 打印模板 -->
    <div id="form1" v-show="show">
      <form
        v-for="(item,index) in this.multipleSelection"
        :key="index"
        style="page-break-after:always"
      >
        <table border="1" width="100%" cellspacing="0">
          <tr>
            <td colspan="2" rowspan="3" width="25%" height="170px">
              <div :id="`qrcode${item.id}`" style="margin-left:13px"></div>
            </td>
            <td
              rowspan="2"
              colspan="7"
              width="75%"
              height="60px"
              style="text-align: center;"
            >壹口两口出库单</td>
          </tr>
          <tr></tr>
          <tr>
            <td colspan="7" rowspan="1" height="120px" style="font-size: 14px;text-align: right">
              <p>打印人 : {{$store.state.user.name}}</p>
              <p>打印时间 : {{item.created_at}}</p>
              <p>第 {{item.export_count + 1}} 次打印</p>
            </td>
          </tr>
          <tr>
            <td colspan="3" width="33%" height="50px" style="text-align: center;">商品名称</td>
            <td colspan="3" width="33%" height="50px" style="text-align: center;">规格</td>
            <td colspan="3" width="33%" height="50px" style="text-align: center;">数量</td>
          </tr>
          <tr>
            <td
              colspan="3"
              width="33%"
              height="300px"
              style="font-size: 18px;vertical-align:top;text-align:center;padding-top:20px"
            >{{item.agent_goods.goods_name}}</td>
            <td
              colspan="3"
              width="33%"
              height="300px"
              style="font-size: 18px;vertical-align:top;text-align:center;padding-top:20px"
            >{{item.agent_goods.goods_specs}}</td>
            <td
              colspan="3"
              width="33%"
              height="300px"
              style="font-size: 18px;vertical-align:top;text-align:center;padding-top:20px"
            >{{item.number}}</td>
          </tr>
          <tr>
            <td width="11%" height="150px" colspan="9">
              <p style="font-size: 14px;">收货人 : {{item.receive_name}}</p>
              <p style="font-size: 14px;">收件人手机号 : {{item.phone}}</p>
              <p style="font-size: 14px;">收货地址 : {{item.address}}</p>
            </td>
          </tr>
        </table>
      </form>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import {
  getAgentGoodsApprovalRecordList,
  updateAgentGoodsExportCount
} from "@/api/agent";
import { getLodop } from "../../common/LodopFuncs";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "delivery",
  directives: {
    waves
  },
  data() {
    return {
      id: [],
      show: true,
      listLoading: false,
      commentOptions: [
        //状态
        { key: 6, label: "未导出" },
        { key: 4, label: "已导出" },
        { key: 5, label: "已出库" }
      ],
      commentOption: [
        //状态
        { key: 1, label: "总部提货" }
      ],
      tabKey: 0,
      multipleSelection: [],
      dataList: [], //列表数组
      total: 0, //列表total
      recordList: {
        //货单
        shop_store_id: 1,
        status: "",
        page: 1,
        page_size: 10
      },
      dataLists: [],
      orders: {
        //同意
        approval_id: undefined,
        status: 1,
        type: 2,
        goods_id: undefined,
        customer_id: undefined,
        number: undefined
      },
      ordersl: {
        //拒绝
        approval_id: undefined,
        status: 2,
        type: 2,
        goods_id: undefined,
        customer_id: undefined,
        number: undefined
      },
      rows: [],
      status: ""
    };
  },

  filters: {
    groupFuncTranslator(func) {
      const statusMap = {
        6: "未导出",
        4: "已导出",
        5: "已出库"
      };
      return statusMap[func];
    }
  },
  created() {
    this.deliverys();
  },
  methods: {
    //打印
    handleBatchPrintCode() {
      //首先先判断有没有选中提示信息
      if (this.multipleSelection == "") {
        this.$message({
          showClose: true,
          message: "请先选择数据"
        });
        return;
      }
      //判断是否安装LOODP控件
      const LODOP = getLodop();
      if (LODOP == null || typeof LODOP.VERSION === "undefined") {
        this.$message({
          type: "info",
          message: "请先安装lodop控件"
        });
        return;
      }
      //判断已出库订单
      this.multipleSelection.map(v => {
        this.status = v.status;
      });
      if (this.status === 5) {
        this.$message({
          showClose: true,
          message: "已出库订单不可打印"
        });
        return;
      }

      //如果勾选的数据长度为1的话就可以打印预览，否则直接打印
      this.CreateOneFormPage();
      if (this.multipleSelection.length === 1) {
        LODOP.PREVIEW();
        this.multipleSelection.map(res => {
          updateAgentGoodsExportCount({
            id: res.id,
            shop_store_id: 1
          }).then(res => {});
        });
      } else {
        LODOP.PRINT();
        this.multipleSelection.map(res => {
          updateAgentGoodsExportCount({
            id: res.id,
            shop_store_id: 1
          }).then(res => {});
        });
      }
    },
    //lodop打印生成预览
    CreateOneFormPage() {
      LODOP = getLodop();
      LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
      LODOP.SET_PRINT_STYLE("FontSize", 18);
      LODOP.SET_PRINT_STYLE("Bold", 1);
      LODOP.NewPage();
      // LODOP.SET_PRINT_MODE("WINDOW_DEFPRINTER",某打印机名或序号);
      LODOP.ADD_PRINT_HTM(
        100,
        30,
        650,
        700,
        document.getElementById("form1").innerHTML
      );
    },
    //勾选时动态生成二维码
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.show = false;
      this.multipleSelection.map((item, index) => {
        this.$nextTick(function() {
          document.getElementById(`qrcode${item.id}`).innerHTML = "";
          const qrcode = new QRCode(`qrcode${item.id}`, {
            width: 130,
            height: 130,
            text: "id=" + item.id,
            colorDark: "#000",
            colorLight: "#fff"
          });
        });
      });
    },
    //查看提货单
    deliverys() {
      this.listLoading = true;
      getAgentGoodsApprovalRecordList(this.recordList).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    //分页
    handleSizeChange(val) {
      this.recordList.page_size = val;
      this.deliverys();
    },
    handleCurrentChange(val) {
      this.recordList.page = val;
      this.deliverys();
    },
    // 状态搜索
    handleFilter() {
      this.recordList.page = 1;
      this.deliverys();
    }
  }
};
</script>
<style>
/* 去除打印机页眉页脚和时间 */
@page {
  size: auto; /* auto is the initial value */
  margin: 3mm; /* this affects the margin in the printer settings */
}
</style>
