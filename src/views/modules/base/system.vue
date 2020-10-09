<template>
  <div class="mod-system">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.systemName" placeholder="系统名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('base:system:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('base:system:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="systemId"
        header-align="center"
        align="center"
        label="系统代码">
      </el-table-column>
      <el-table-column
        prop="systemName"
        header-align="center"
        align="center"
        label="系统名称">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="系统标题">
      </el-table-column>
      <el-table-column
        prop="introduction"
        header-align="center"
        align="center"
        label="简介">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="deployType"
        header-align="center"
        align="center"
        label="支持部署类型">
      </el-table-column>
      <el-table-column
        prop="releaseTime"
        header-align="center"
        align="center"
        label="系统发布时间">
      </el-table-column>
      <el-table-column
        prop="copyright"
        header-align="center"
        align="center"
        label="版权信息">
      </el-table-column>
      <el-table-column
        prop="initMethod"
        header-align="center"
        align="center"
        label="初始化方法">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="系统负责人">
        <template slot-scope="scope">
          <span>{{transUser(scope.row.userId)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('base:system:exportData')" type="text" size="small" @click="exportDataHandle(scope.row.systemId)">导出基础数据</el-button>
          <el-button v-if="isAuth('base:system:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.systemId)">修改</el-button>
          <el-button v-if="isAuth('base:system:remove')" type="text" size="small" @click="deleteHandle(scope.row.systemId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './system-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          systemName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/base/system/list',
          method: 'get',
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'systemName': this.searchForm.systemName
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
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (systemId) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(systemId)
        })
      },
      exportDataHandle (systemId) {
        window.open(this.$http.BASE_URL + `/base/system/exportData?token=${this.$cookie.get('token')}&systemId=` + systemId)
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.systemId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/base/system/${ids}`,
            method: 'delete'
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
        }).catch(() => {
        })
      }
    }
  }
</script>
