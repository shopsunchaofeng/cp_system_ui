<template>
  <div class="mod-clentsystem">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('base:clentsystem:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('base:clentsystem:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="clentId"
        header-align="center"
        align="center"
        label="客户id">
      </el-table-column>
                            <el-table-column
        prop="systemId"
        header-align="center"
        align="center"
        label="系统编号">
      </el-table-column>
                            <el-table-column
        prop="locationProvinceId"
        header-align="center"
        align="center"
        label="所在省ID">
      </el-table-column>
                            <el-table-column
        prop="locationCityId"
        header-align="center"
        align="center"
        label="所在市ID">
      </el-table-column>
                            <el-table-column
        prop="locationCountyId"
        header-align="center"
        align="center"
        label="所在区ID">
      </el-table-column>
                            <el-table-column
        prop="locationDetail"
        header-align="center"
        align="center"
        label="详细地址">
      </el-table-column>
                            <el-table-column
        prop="validTime"
        header-align="center"
        align="center"
        label="有效期限">
      </el-table-column>
                            <el-table-column
        prop="contractNo"
        header-align="center"
        align="center"
        label="合同编号">
      </el-table-column>
                            <el-table-column
        prop="signUserId"
        header-align="center"
        align="center"
        label="签约人">
      </el-table-column>
                            <el-table-column
        prop="signTime"
        header-align="center"
        align="center"
        label="签约日期">
      </el-table-column>
                            <el-table-column
        prop="signPlace"
        header-align="center"
        align="center"
        label="签约地点">
      </el-table-column>
                            <el-table-column
        prop="agentId"
        header-align="center"
        align="center"
        label="代理商id">
      </el-table-column>
                            <el-table-column
        prop="annexId"
        header-align="center"
        align="center"
        label="附件ID，合同编号">
      </el-table-column>
                            <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态，1有效，0无效">
      </el-table-column>
                            <el-table-column
        prop="crtTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
                            <el-table-column
        prop="crtUser"
        header-align="center"
        align="center"
        label="创建人id">
      </el-table-column>
                            <el-table-column
        prop="crtName"
        header-align="center"
        align="center"
        label="创建人名称">
      </el-table-column>
                            <el-table-column
        prop="crtHost"
        header-align="center"
        align="center"
        label="创建IP">
      </el-table-column>
                            <el-table-column
        prop="updTime"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
                            <el-table-column
        prop="updUser"
        header-align="center"
        align="center"
        label="更新人id">
      </el-table-column>
                            <el-table-column
        prop="updName"
        header-align="center"
        align="center"
        label="更新人名称">
      </el-table-column>
                            <el-table-column
        prop="updHost"
        header-align="center"
        align="center"
        label="更新IP">
      </el-table-column>
                    <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('base:clentsystem:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('base:clentsystem:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './clentsystem-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          name: ''
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
          url: '/base/clentsystem/list',
          method: 'get',
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
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
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/base/clentsystem/${ids}`,
            method: 'DELETE'
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
