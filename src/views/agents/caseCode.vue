<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves @click="produce">生成箱码</el-button>
      <el-button class="filter-item" type="primary" v-waves @click="download">打包下载</el-button>
    </div>
    <!-- 商品列表 -->
    <el-table
      :stripe="true"
      :data="list"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="单品数量">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.item_number}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="批次">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.batch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 生成箱码弹窗 -->
    <el-dialog title="生成箱码" :visible.sync="dialogVisibles" width="30%">
      <el-form :model="temp" label-position="left" style="width: 90%; margin-left:15%;">
        <el-form-item label="数量 :">
          <el-input-number style="width: 300px" v-model="temp.number" :min="0" :max="1000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="createdatas">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 打包箱码弹窗 -->
    <el-dialog title="打包箱码" :visible.sync="dialogVisiblesl" width="30%">
      <el-form :model="temps" label-position="left" style="width: 90%; margin-left:15%;">
        <el-form-item label="批次 :">
          <el-input-number style="width: 300px" v-model="temps.batch"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblesl = false">取 消</el-button>
        <el-button type="primary" @click="createdataList">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAgentGoodsBoxList, createBox, zipPackage } from "@/api/agent";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "caseCode",
  directives: {
    waves
  },
  data() {
    return {
      dialogVisibles: false, //生成二维码
      dialogVisiblesl: false, //打包二维码
      list: [], //数据列表
      total: null, //数据条数
      listLoading: true, //加载
      listQuery: {
        //分页
        page: 1,
        page_size: 10,
        shop_store_id: 1
      },
      temp: {
        //生成二维码提交对象
        batch: 1,
        number: 0,
        shop_store_id: 1,
        // url: `http://warehouseapp.home258.com/#/pages/inware/inware` //测试
        url: `http://shop.badboluo.com/#/pages/inware/inware` //正式
      },
      temps: {
        //打包箱码提交对象
        batch: 0,
        shop_store_id: 1,
        zipClass: "zipBox"
      },
      batchs: undefined,
      file_path: ""
    };
  },
  created() {
    this.getList();
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "0": "未入库",
        "1": "已入库",
        "2": "已出库"
      };
      return statusMap[status];
    }
  },
  methods: {
    // 获取商品列表
    getList() {
      this.listLoading = true;
      getAgentGoodsBoxList(this.listQuery).then(response => {
        this.list = response.data.data.data;
        this.total = response.data.data.total;
        this.listLoading = false;
      });
    },
    //生成箱码
    produce() {
      this.dialogVisibles = true;
      this.temp.number = 0;
    },
    // 生成箱码
    createdatas() {
      if (this.temp.number <= 0) {
        this.$message("请输入正确的数量");
      } else if (this.temp.number > 1000) {
        this.$message("生成数量不可以超过1000");
      } else {
        this.listLoading = true;
        this.dialogVisibles = false;
        createBox(this.temp).then(response => {
          this.$notify({
            title: "成功",
            message: "生成成功",
            type: "success",
            duration: 2000
          });
          this.getList();
          this.listLoading = false;
        });
      }
    },
    //打包下载
    download() {
      this.dialogVisiblesl = true;
      this.temps.batch = 0;
    },
    // 打包箱码码确定
    createdataList() {
      if (this.temps.batch <= 0) {
        this.$message("请输入正确的批次");
      }else {
        zipPackage(this.temps).then(res => {
          this.file_path = res.data;
          console.log(this.file_path, 1111);
          const form = document.createElement("form");
          form.action =
            process.env.BASE_API +
            "/api/agent/zipDownload" +
            "?token=" +
            this.$store.state.user.token;
          form.method = "post";
          form.style.display = "none";
          //路径
          const file_path = document.createElement("input");
          file_path.name = "file_path";
          file_path.value = this.file_path;
          form.appendChild(file_path);
          const button = document.createElement("input");
          button.type = "submit";
          form.appendChild(button);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        });
        this.getList();
        this.dialogVisiblesl = false;
      }
    },

    //搜索方法
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    //分页
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>
