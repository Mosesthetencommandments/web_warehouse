<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div>
        <el-select  class="filter-item"
                    style="width: 200px"
                    @change='handleFilter'
                    v-model="listQuery.product_good_id"
                    filterable
                    clearable
                    remote
                    placeholder="选择商品"
                    :remote-method="getProductGoodsList"
                    :loading="productGoodsLoading">
          <el-option v-for="item in productGoodsOptions"
                     :key="item.id"
                     :label="item.goods_name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" class="filter-item"
                   @click="handleFilter">
                    搜索
        </el-button>
        <el-button type="primary" class="filter-item" icon="el-icon-edit" @click="handleAddCost">添加
        </el-button>

        <el-switch v-model="listQuery.show_terminal"
                   @change="handleFilter"
                   style="float: right"
                   :active-value="1"
                   :inactive-value="0"
                   active-text="全部成本"
                   inactive-text="最新成本">
        </el-switch>
      </div>
    </div>
    <el-table :key='tableKey'
              id="productMember"
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit highlight-current-row
              style="width: 100%;" >
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
              <span >
                {{scope.row.id}}
              </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品" min-width="250">
        <template slot-scope="scope">
          <span v-if="scope.row.product_good">
            {{scope.row.product_good.goods_name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" min-width="350">
        <template slot-scope="scope">
          <span>{{scope.row.start_at}}</span>
          --
          <span v-if="scope.row.terminal_at !== null">
            {{scope.row.terminal_at}}
          </span>
          <span v-else> 今 </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="消费" min-width="100">
        <template slot-scope="scope">
          <span>¥ {{scope.row.money}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="成本录入" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width:90%; margin-left:5%;'>
        <el-form-item label="商品" prop="product_goods_id">
          <el-select style="width: 100%"
                     v-model="temp.product_good_id"
                     filterable
                     clearable
                     remote
                     placeholder="商品"
                     :remote-method="getProductGoodsList"
                     :loading="productGoodsLoading">
            <el-option
              v-for="item in productGoodsOptions"
              :key="item.id"
              :label="item.goods_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成本" prop="money">
          <el-input-number v-model="temp.money"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createCost">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { createProductGoodCost, getProductGoodCostList } from '@/api/product_goods'
  import { getProductGoodsList, getProductGoodsSkuList } from '@/api/goods'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'productCost',
    components: { },
    directives: {
      waves
    },
    data() {
      const validate = (rule, value, callback) => {
        if (!value) {
          callback(new Error('输入消费'))
        }
        if (/^\d+(\.\d+)?$/.test(value)) {
          callback()
        } else {
          callback(new Error('只能输入数字'))
        }
      }
      return {
        arry: [],
        scrollTop: 0,
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        listQuery: {
          product_good_id: undefined,
          show_terminal: 0,
          page_size: 20,
          page: 1,
          sort: '-id'
        },
        rules: {
          product_good_id: [{ required: true, message: '选择商品', trigger: 'change' }],
          money: [
            { validator: validate, trigger: 'change' }
          ]
        },
        sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
        temp: {
          product_good_id: undefined,
          money: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        productGoodsOptions: [],
        productGoodsLoading: false,
        productGoodsSkuLoading: false,
        productGoodsSkuOptions: []
      }
    },
    created() {
      this.getList()
    },
    filters: {
      statusUnit(status) {
        const statusTransMap = {
          0: '件',
          1: '斤',
          2: 'g'
        }
        return statusTransMap[status]
      }
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      getProductGoodsList(query) {
        if (query !== '') {
          this.productGoodsLoading = true
          getProductGoodsList({ goods_name: query, page_size: 0, status: 1 }).then(response => {
            this.productGoodsOptions = response.data
            this.productGoodsLoading = false
          })
        }
      },
      getProductGoodsSkuList() {
        if (!this.temp.product_goods_common_id) {
          this.$message.error('选择商品')
          return false
        }
          this.productGoodsSkuLoading = true
          getProductGoodsSkuList({ product_goods_common_id: this.temp.product_goods_common_id, page_size: 0}).then(response => {
            this.productGoodsSkuOptions = response.data
            this.productGoodsSkuLoading = false
          })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleFilter2() {
        this.productOptions = []
        this.listQuery.product_id = undefined
        this.handleFilter()
      },
      handleQueryTypeChange(type) {
        this.list = []
        this.handleFilter()
      },
      getList() {
        this.listLoading = true
        getProductGoodCostList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
          this.listLoading = false
        })
      },
      handleAddCost() {
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createCost() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createProductGoodCost(this.temp).then(response => {
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
      }
    },
    watch: {
      dialogFormVisible(val) {
        if (val === false) {
          this.temp = {
            product_good_id: undefined,
            money: undefined
          }
        }
      }
    },
    deactivated() {
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    },
    activated() {
      this.getList()
      window.scrollTo(0, this.scrollTop)
    }
  }
</script>
<style scoped>
</style>
