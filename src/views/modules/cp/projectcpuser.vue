<template>
  <el-dialog
    :title="'测评师'"
    :close-on-click-modal="false"
    :visible.sync="visible">
  <div class="mod-user">
    <!--<el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>-->
    <el-table
      :data="dataList"
      border
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="mobilePhone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        label="性别">
        <template slot-scope="scope">
          <span>{{transParam('SEX',scope.row.sex)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cpIdcard"
        header-align="center"
        align="center"
        label="身份证号">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="cpShenfen"
        header-align="center"
        align="center"
        label="身份">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cpShenfen ===15">项目经理</el-tag>
          <el-tag v-if="scope.row.cpShenfen ===16">高级测评师</el-tag>
          <el-tag v-if="scope.row.cpShenfen ===17">中级测评师</el-tag>
          <el-tag v-if="scope.row.cpShenfen ===18">初级测评师</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else-if="scope.row.status === 1" size="small" type="success">正常</el-tag>
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
  </el-dialog>
</template>

<script>
  import AddOrUpdate from './cpuser-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          userName: ''
        },
        dataList: [],
        newDataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        visible:false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    methods: {
      // 获取数据列表
      getDataList (projectid) {
        this.visible=true
        this.$http({
          url: '/cp/project/cpslist1',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'projectid': projectid,
            'limit': this.searchForm.limit,
            'userName': this.searchForm.userName
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = []
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
      resetHandle () {
        let userIds = this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`重置后的密码为 888888 ，是否确定？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/base/user/resetPw',
            method: 'post',
            data: {'userIds': userIds}
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
      // 删除
      deleteHandle (id) {
        let userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/base/user/${userIds}`,
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
