<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      TODO
    </div>
  </div>
</template>

<script>
import { getLogsList } from '@/api/system'
import { getUserAccountList } from '@/api/user'
import { getUserAccountTypeList } from '@/api/user_role'
import waves from '@/directive/waves'
// 水波纹指令

export default {
  components: { },
  name: 'actionHistory',
  directives: {
    waves
  },
  data() {
    return {
      scrollTop: 0,
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20,
        sort: '-id',
        user_account_id: undefined,
        user_account_group_id: undefined,
        action: '',
        params: '',
        date_range: undefined
      },
      userAccountLoading: false,
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      userTypeOptions: [],
      userAccountOptions: [],
      showAuditor: false,
      temp: {
        id: undefined,
        nickname: '',
        user: {
          id: '',
          phone: ''
        },
        user_account_type: {
          id: undefined,
          type_name: ''
        },
        user_account_group: {
          id: undefined,
          group_name: ''
        },
        user_account_role: {
          id: undefined,
          role_name: ''
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        domain_name: [{ required: true, message: '请正确填写域名名称', trigger: 'change' }]
      },

      innerList1: null,
      innerTotal1: null,
      innerTableKey1: 1,
      innerTableTitle1: '',
      innerListQuery1: {
        page: 1,
        page_size: 5,
        domain_id: undefined,
        sort: '-id'
      },
      innerTemp1: {
        id: undefined,
        password: '',
        phone: ''
      },
      innerListLoading1: false,
      innerTableVisible1: false,
      innerDialogFormVisible1: false,
      innerRules1: {
        name: [{ required: true, message: '请正确填写名称', trigger: 'change' }]
      },
      colSpanRegular: [],
      countNumber: [],
      countIndex: [],
      typeOptions: [],
      typeDisable: false,
      groupOptions: [],
      roleOptions: [],
      inputDisable: false,
      typeBackground: 'danger',
      roleBackground: 'info',
      groupBackground: 'info',
      phoneDisabled: true,
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
        0: 'gray',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusTranslator(status) {
      const statusTransMap = {
        0: '冻结',
        1: '开启',
        2: '已删除'
      }
      return statusTransMap[status]
    }
  },
  created() {
    this.getList()
    this.getuserAccountList(' ')
    this.getUserTypeList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      getLogsList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getuserAccountList(query) {
      if (query !== '') {
        this.userAccountLoading = true
        getUserAccountList({ nickname: query, status: 1 }).then(response => {
          this.userAccountOptions = response.data.data
          this.userAccountLoading = false
        })
      }
    },
    getUserTypeList() {
      getUserAccountTypeList({}).then(response => {
        if (response.data.data) {
          this.userTypeOptions = response.data.data
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
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
