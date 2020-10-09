<template>
  <div class="mod-schedule">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.jobName" placeholder="任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('job:detail:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('job:detail:remove')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
        <el-button v-if="isAuth('job:detail:pause')" type="danger" @click="pauseHandle()"
                   :disabled="dataListSelections.length <= 0">批量暂停
        </el-button>
        <el-button v-if="isAuth('job:detail:resume')" type="danger" @click="resumeHandle()"
                   :disabled="dataListSelections.length <= 0">批量恢复
        </el-button>
        <el-button v-if="isAuth('job:detail:run')" type="danger" @click="runHandle()"
                   :disabled="dataListSelections.length <= 0">批量立即执行
        </el-button>
        <el-button v-if="isAuth('job:log:list')" type="success" @click="logHandle()">日志列表</el-button>
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
        prop="jobName"
        header-align="center"
        align="center"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="任务类型" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.jobType === 0">bean</span>
          <span v-if="scope.row.jobType === 1">类</span>
          <span v-if="scope.row.jobType === 2">URL</span>
          <span v-if="scope.row.jobType === 3">SQL</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="beanName"
        header-align="center"
        align="center"
        label="bean name">
        <template slot-scope="scope">
          <span v-if="scope.row.jobType === 0">{{scope.row.beanName}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="method"
        header-align="center"
        align="center"
        label="执行内容">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        label="参数">
      </el-table-column>
      <el-table-column
        prop="cron"
        header-align="center"
        align="center"
        label="cron表达式">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">暂停</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('job:detail:update')" type="text" size="small"
                     @click="addOrUpdateHandle(scope.row.id)">修改
          </el-button>
          <el-button v-if="isAuth('job:detail:remove')" type="text" size="small"
                     @click="deleteHandle(scope.row.id)">删除
          </el-button>
          <el-button v-if="isAuth('job:detail:pause')" type="text" size="small" @click="pauseHandle(scope.row.id)">
            暂停
          </el-button>
          <el-button v-if="isAuth('job:detail:resume')" type="text" size="small"
                     @click="resumeHandle(scope.row.id)">恢复
          </el-button>
          <el-button v-if="isAuth('job:detail:run')" type="text" size="small" @click="runHandle(scope.row.id)">
            立即执行
          </el-button>
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
    <!-- 弹窗, 日志列表 -->
    <log v-if="logVisible" ref="log"></log>
  </div>
</template>

<script>
  import AddOrUpdate from './detail-add-or-update'
  import Log from './log'

  export default {
    data () {
      return {
        searchForm: {
          jobName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false,
        logVisible: false
      }
    },
    components: {
      AddOrUpdate,
      Log
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/job/detail/queryPage',
          method: 'get',
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'jobName': this.searchForm.jobName
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
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/job/detail/${ids}`,
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
      },
      // 暂停
      pauseHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/job/detail/pause',
            method: 'post',
            data: ids
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }
          })
        }).catch(() => {
        })
      },
      // 恢复
      resumeHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/job/detail/resume',
            method: 'post',
            data: ids
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }
          })
        }).catch(() => {
        })
      },
      // 立即执行
      runHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/job/detail/run',
            method: 'post',
            data: ids
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            }
          })
        }).catch(() => {
        })
      },
      // 日志列表
      logHandle () {
        this.logVisible = true
        this.$nextTick(() => {
          this.$refs.log.init()
        })
      }
    }
  }
</script>
