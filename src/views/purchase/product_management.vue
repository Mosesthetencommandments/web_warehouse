<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select  class="filter-item"
                  style="width: 200px"
                  @change='handleFilter'
                  v-model="listQuery.brand_id"
                  filterable
                  clearable
                  remote
                  placeholder="选择品牌"
                  :remote-method="getBrandList"
                  :loading="brandLoading">
        <el-option v-for="item in brandOptions"
                   :key="item.id"
                   :label="item.brand_name"
                   :value="item.id">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="商品名称" v-model="listQuery.goods_name">
      </el-input>
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 120px" clearable class="filter-item" v-model="listQuery.is_sale">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%" stripe>
      <el-table-column min-width="200px" align="center" label="商品名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="75" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_sale | TypeStatusFilter">{{scope.row.is_sale | TypeStatusTranslator}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="140" align="center" label="品牌">
        <template slot-scope="scope">
          <span v-if="scope.row.brand">{{ scope.row.brand.brand_name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="所属产品分类">
        <template slot-scope="scope">
          <div v-for="item in scope.row.product_relations">
            <span>
              {{item.product.product_name}}
            </span>
            <el-tag :type="item.product.is_promote | statusFilter">{{item.product.is_promote | statusTranslator}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="warning"　size="mini" @click="handleBelong(scope.row)">所属产品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--所属产品弹出-->
    <el-dialog title="选择所属产品" :visible.sync="dialogBelong" width="40%">
      <template>
        <el-form>
          <el-form-item label="所属产品">
          <el-select v-model="listQuery3.product_ids" multiple placeholder="请选择"　style="width: 100%;">
            <el-option
            v-for="item in productsOptions"
            :key="item.id"
            :label="item.product_name"
            :value="item.id">
          </el-option>
          </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: right;">
          <el-button @click="dialogBelong = false">取 消</el-button>
          <el-button type="primary" @click="updateProductRProductGoods">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--图片上传-->
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form :rules="rules" ref="dataForm1" :model="temp1" label-position="left"  label-width="15%">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input placeholder="请输入商品名称" v-model="temp1.goods_name" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="所属品牌" prop="brand_id">
          <el-select  class="filter-item"
                      style="width: 300px"
                      v-model="temp1.brand_id"
                      filterable
                      clearable
                      remote
                      placeholder="选择品牌"
                      :remote-method="getBrandList1"
                      :loading="brandLoading">
            <el-option v-for="item in brandOptions1"
                       :key="item.id"
                       :label="item.brand_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="temp1.unit" placeholder="如袋、g、kg等" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="temp1.price"></el-input-number>
        </el-form-item>
        <el-form-item label="生产周期" prop="production_cycle">
          <el-input-number placeholder="天数" v-model="temp1.production_cycle"></el-input-number>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="temp1.is_sale" size="small">
            <el-radio-button label="0">非在售</el-radio-button>
            <el-radio-button label="1">在售</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="是否为赠品">
          <el-radio-group v-model="temp1.is_gift" size="small">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getProductList } from '@/api/product'
  import { changeProductGoodsStatus, getBrandList, updateProductRProductGoods, getProductGoodsList, createProductGoods, updateProductGoods, getProductGoodsInfo } from '@/api/goods'
  import waves from '@/directive/waves' // 水波纹指令
  import { wangEditor } from '@/utils/wang.js'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  // 富文本编辑器
  export default {
    name: 'productManagement',
    components: { Multiselect },
    directives: {
      waves
    },
    data() {
      return {
        success: true,
        danger: false,
        checked: false,
        dialogSet: false,
        listLoading1: true,
        dialogSetEdit: false,
        dialogBelong: false,
        dialogImageUrl: '',
        tableKey1: undefined,
        dialogVisible: false,
        scrollTop: 0,
        tableKey: 0,
        list: null,
        total: null,
        list1: null,
        total1: null,
        listLoading: true,
        classOptions: [],
        classOptions1: [],
        classOptions2: [],
        temp1: {
          goods_name: undefined,
          brand_id: undefined,
          is_sale: 0,
          is_gift: 1,
          unit: undefined,
          production_cycle: undefined,
          price: undefined
        },
        brandOptions1: [],
        temp2: {
          main_images: [],
          main_images_default: undefined
        },
        fileList: [],
        fileList1: [],
        fileList3: [],
        temp3: {
          radio1: 1
        },
        temp4: {
          goods_attribute: [{
            value: undefined,
            label: undefined
          }],
          product_goods_category_id: []
        },
        props: {
          value: 'id',
          children: 'son',
          label: 'category_name'
        },
        temp5: {
          species_values: [],
          species_names: []
        },
        listQuery: {
          page: 1,
          page_size: 20,
          goods_name: undefined,
          sort: '-id',
          is_sale: undefined,
          // brand: undefined,
          brand_id: undefined
        },
        listQuery1: {
          page: 1,
          page_size: 20,
          sort: '-id',
          is_open: 1,
          product_goods_common_id: undefined
        },
        product_goods_id: undefined,
        listQuery3: {
          product_ids: [],
          product_goods_common_id: undefined
        },
        productsOptions: [],
        importanceOptions: [1, 2, 3],
        unitOptions: [
          {
            label: '件',
            id: 0
          },
          {
            label: '斤',
            id: 1
          },
          {
            label: 'g',
            id: 2
          }
        ],
        sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
        statusOptions: [{ label: '非在售', key: 0 }, { label: '在售', key: 1 }],
        brandLoading: false,
        brandOptions: [],
        // typeOptions: [{ label: '非在售', key: 0 }, { label: '在售', key: 1 }],
        showAuditor: false,
        temp_product_ids: [],
        temp: {
          id: undefined,
          goods_name: '',
          unit: undefined,
          price: undefined,
          stock: undefined,
          production_cycle: undefined,
          product: [],
          product_ids: [],
          status: 1
        },
        price1: {
          goods_common_id: undefined,
          product_goods_id: undefined,
          image_thumb: undefined,
          origin_price: undefined,
          actual_price: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogStatus1: '',
        textMap1: {
          update: '编辑',
          create: '创建'
        },
        createName: false,
        rules: {
          goods_name: [{ required: true, message: '填写商品名称', trigger: 'change' }],
          brand_id: [{ required: true, message: '选择品牌', trigger: 'change' }],
          unit: [{ required: true, message: '规格单位', trigger: 'change' }],
          production_cycle: [{ required: true, message: '生产周期天数', trigger: 'change' }],
          price: [{ required: true, message: '填写价格', trigger: 'change' }]
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
        tempData: {
          goods_common_id: undefined,
          product_goods_id: undefined,
          species_value: undefined,
          image_thumb: undefined,
          origin_price: undefined,
          actual_price: undefined,
          status: undefined
        },
        productOptions: [],
        productLoading: false,
        productResult: []
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          2: '',
          3: 'danger'
        }
        return statusMap[status]
      },
      statusUnit(status) {
        const statusTransMap = {
          0: '件',
          1: '斤',
          2: 'g'
        }
        return statusTransMap[status]
      },
      statusTranslator(status) {
        const statusMap = {
          1: '推广',
          2: '附属产品',
          3: '赠品'
        }
        return statusMap[status]
      },
      TypeStatusFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'danger'
        }
        return statusMap[status]
      },
      TypeStatusTranslator(status) {
        const statusMap = {
          1: '在售',
          0: '非在售'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
      this.getProductList()
    },
    mounted() {
    },
    methods: {
      getList() {
        this.listLoading = true
        getProductGoodsList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      // 列表页所属产品操作
      handleBelong(row) {
        this.listQuery3.product_goods_id = row.id
        this.listQuery3.product_ids = row.product_relations == null ? [] : row.product_relations.map(item => {
          return item.product.id
        })
        this.dialogBelong = true
      },
      updateProductRProductGoods() {
        updateProductRProductGoods(this.listQuery3).then(res => {
          this.dialogBelong = false
          this.getList()
        })
      },
      getProductList() {
        getProductList({ page_size: 0 }).then(res => {
          this.productsOptions = res.data
        })
      },
      // 商品属性下所有分类
      // 规格设置列表开关状态
      handleSwich(row) {
        changeProductGoodsStatus({ product_goods_id: row.id, status: row.status }).then(res => {
          this.getSeetingList()
          this.$message.success('修改成功')
        })
      },
      // 显示关闭表格
      handleStatus() {
        this.getSeetingList()
      },
      tableRowClassName({ row }) {
        if (row.status === 1) {
          return ''
        } else {
          return 'warning-row'
        }
      },
      // 规格明细列表
      getSeetingList(row) {
        this.listLoading1 = true
        getProductGoodsList(this.listQuery1).then(response => {
          this.list1 = response.data
          // this.total1 = response.data.total
          this.listLoading1 = false
        })
      },
      getBrandList(query) {
        if (query !== '') {
          this.brandLoading = true
          getBrandList({ brand_name: query, page_size: 0 }).then(response => {
            this.brandOptions = response.data
            this.brandLoading = false
          })
        }
      },
      // 基本信息所属品牌
      getBrandList1(query) {
        if (query !== '') {
          this.brandLoading = true
          getBrandList({ brand_name: query, page_size: 0 }).then(response => {
            this.brandOptions1 = response.data
            this.brandLoading = false
          })
        }
      },
      // 创建基本信息
      createData() {
        this.$refs['dataForm1'].validate((valid) => {
          if (valid) {
            createProductGoods(this.temp1).then(() => {
              this.getList()
              this.dialogFormVisible = false
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
      // 编辑基本信息
      handleUpdate(row) {
        this.product_goods_id = row.id
        getProductGoodsInfo({ product_goods_id: row.id }).then(response => {
          this.temp1 = response.data
          this.getBrandList1()
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm1'].clearValidate()
          })
        })
      },
      // 点击确定编辑
      updateData() {
        this.$refs[`dataForm1`].validate((valid) => {
          if (valid) {
            const params = Object.assign({
              product_goods_id: this.product_goods_id
            }, this.temp1)
            updateProductGoods(params).then(() => {
              this.getList()
              this.dialogFormVisible = false
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
      handleRemove1(file, fileList) {
        this.temp2.main_images_default = ''
      },
      // 规格设置上传主图
      handlePictureSuccess(response, file, fileList) {
        this.price1.image_thumb = response.data.url
      },
      // 商品属性添加属性事件
      addAttribute() {
        this.temp4.goods_attribute.push({
          label: undefined,
          value: undefined
        })
      },
      // 商品属性删除
      handleDel2(index) {
        this.temp4.goods_attribute.splice(index, 1)
      },
      // 规格设置删除规格明细
      handleDel(index, index1) {
        this.temp5.species_values[index].attr_val.splice(index1, 1)
      },
      // 规格设置恢复明细
      handleBack(index, index1) {
        // this.temp5.species_values[index].attr_val[index1].splice(0, -1)
      },
      // 删除所有规格明细
      handleDel1(index) {
        this.temp5.species_values.splice(index, 1)
      },
      // 恢复父级规格明细
      // handleBack1(index) {
      //   this.temp5.species_values[index].attr_status = 1
      //   this.temp5.species_values[index].attr_val.map(item => {
      //     item.status = 1
      //   })
      // },
      handleExceed1() {
        this.$message.error('主图限制上传一张')
      },
      handleRemove1(file, fileList) {
        this.temp2.main_images_default = ''
      },
      handleRemove3(file, fileList) {
        this.price1.image_thumb = undefined
      },
      handleRemove(file, fileList) {
        this.fileList = fileList.map(item => {
          return {
            name: item.name,
            url: item.response ? item.response.data.url : item.url
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handlePictureCardPreview1(file) {
        this.dialogImageUrl = file.main_images_default
        this.dialogVisible = true
      },
      handlePictureCardPreview2(file) {
        this.dialogImageUrl = file.image_thumb
        this.dialogVisible = true
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG png 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
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
      handleSizeChange1(val) {
        this.listQuery1.page_size = val
        this.getList()
      },
      handleCurrentChange1(val) {
        this.listQuery1.page = val
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp1 = {
          goods_name: undefined,
            brand_id: undefined,
            is_sale: 0,
            is_gift: 1,
            unit: undefined,
            production_cycle: undefined,
            price: undefined
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm1'].clearValidate()
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ttempData = {
            product_goods_id: row.id
          }
          deleteProductGoods(ttempData).then(response => {
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
  .el-table >>> .warning-row {
    background: #f5f5f5!important;
  }

  .el-table .success-row {
    background: #fff;
  }
  .el-table >>> thead {
    font-size: 13px;
  }
  .el-tag {
    padding: 0 4px;
    font-size: 14px;
    line-height: 26px;
    height: 26px;
  }
  .iconStyle {
    font-weight: bold;
    font-size: 20px;
    color: #000;
    vertical-align: top;
    margin-top: 12px;
  }
  .picName{
    border: 1px solid rgb(139, 195, 74);
    width: 74%;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    margin-left: 10px;
    text-align: center;
    color: #000;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .addAttr{
    position: absolute;
    top: 0;
    left: 45%;
  }
</style>
