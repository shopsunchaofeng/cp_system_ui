<template>
  <el-dialog
    :title="`测评任务`"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="`1200px`">
    <div class="mod-nape">
      <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-select v-model="searchForm.cpnstatus" placeholder="所有状态">
            <el-option
              v-for="store in cpnstatusList"
              :key="store.cpnstatus"
              :label="store.cpnstatusName"
              :value="store.cpnstatus">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.realName" placeholder="全部测评师">
            <el-option value="-1" key="-1" label="全部测评师"></el-option>
            <el-option
              v-for="store in cpuserList"
              :key="store.realName"
              :label="store.realName"
              :value="store.realName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.yiceng" placeholder="第一层" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.erceng" placeholder="第二层" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.sanceng" placeholder="第三层" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.siceng" placeholder="第四层" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          prop="jibie"
          header-align="center"
          align="center"
          label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.jibie ===2">二级</el-tag>
            <el-tag v-if="scope.row.jibie ===3">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="yiceng"
          header-align="center"
          align="center"
          label="第一层">
        </el-table-column>
        <el-table-column
          prop="erceng"
          header-align="center"
          align="center"
          label="第二层">
        </el-table-column>
        <el-table-column
          prop="sanceng"
          header-align="center"
          align="center"
          label="第三层">
        </el-table-column>
        <el-table-column
          prop="siceng"
          header-align="center"
          align="center"
          label="第四层">
        </el-table-column>
        <el-table-column
          prop="yaoqiu"
          header-align="center"
          align="center"
          label="要求">
        </el-table-column>
        <el-table-column
          prop="cpnstatus"
          header-align="center"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cpnstatus ==='0'">未测评</el-tag>
            <el-tag v-if="scope.row.cpnstatus ==='1'">已测评</el-tag>
            <el-tag v-if="scope.row.cpnstatus ==='2'">已汇总</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="cpsname"
          header-align="center"
          align="center"
          label="测评师">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="searchForm.page"
        :page-sizes="[8, 10, 20, 50, 100]"
        :page-size="searchForm.limit"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-dialog>
</template>

<script>
  import AddOrUpdate from './nape-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          cpnstatus:-1,
          realName:'',
          yiceng: '',
          erceng: '',
          sanceng: '',
          siceng: '',
          page: 1,
          limit: 8,
          name: ''
        },
        dataList: [],
        cpuserList: [],
        projectid: '',
        cpnstatusList: [{cpnstatus:-1,cpnstatusName:"全部"},{cpnstatus:0,cpnstatusName:"未测评"},{cpnstatus:1,cpnstatusName:"已测评"},{cpnstatus:2,cpnstatusName:"已汇总"}],
        totalPage: 0,
        dataListSelections: [],
        visible:false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    methods: {
      // 获取数据列表
      getDataList (projectid,systemdengji) {
        this.visible=true
        if (projectid){
          this.projectid=projectid
          this.searchForm.jibie=systemdengji
        }
        this.getcpuserHandle()
        this.$http({
          url: '/cp/nape/cprwlist',
          method: 'get',
          params: {
            'projectid': this.projectid,
            'realName': this.searchForm.realName,
            'cpnstatus': this.searchForm.cpnstatus,
            'yiceng': this.searchForm.yiceng,
            'erceng': this.searchForm.erceng,
            'sanceng': this.searchForm.sanceng,
            'siceng': this.searchForm.siceng,
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'name': this.searchForm.name
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.page.records
            this.totalPage = data.page.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.searchForm.limit = val
        this.searchForm.page = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.searchForm.page = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //获取所有测评师
      getcpuserHandle() {
        this.$http({
          url: `/cp/project/cpslist1?projectid=${this.projectid}`,
          method: 'GET'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.cpuserList = data.page.records
          }
        })
      },
      qxfenpeiHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$http({
          url: `/cp/nape/qxfenpei/${ids}?projectid=${this.projectid}`,
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.getDataList()
          }
        })
      },
      //单元测评任务分配确认
      querenHandle() {
        this.$http({
          url: `/cp/nape/querenFenpei?projectid=${this.projectid}`,
          method: 'GET'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.$emit('refreshDataList')
          }else{
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 1500
            })
          }
        })
      },
      // 分配
      fenpeiHandle (id) {
        if (this.cpuserid === '-1'){
          this.$message({
            message: '请选择测评师!',
            type: 'error',
            duration: 1500
          })
          return false
        }
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$http({
          url: `/cp/nape/fenpei/${ids}?projectid=${this.projectid}&cpuserid=${this.cpuserid}`,
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.getDataList()
          }
        })
      }
    }
  }
</script>
