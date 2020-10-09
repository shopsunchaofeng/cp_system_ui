<template>
  <div class="mod-ossfile">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.fileUrl" placeholder="文件URL" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('base:ossfile:config')" type="primary" @click="configHandle()">云存储配置</el-button>
        <el-button v-if="isAuth('base:ossfile:upload')" type="primary" @click="uploadHandle()">上传文件</el-button>
        <el-button v-if="isAuth('base:ossfile:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="storageType"
        header-align="center"
        align="center"
        label="存储类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.storageType === 1" size="small">七牛</el-tag>
          <el-tag v-else-if="scope.row.storageType === 2" size="small">阿里云</el-tag>
          <el-tag v-else-if="scope.row.storageType === 3" size="small">腾讯云</el-tag>
          <el-tag v-else-if="scope.row.storageType === 4" size="small">本地存储</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="groupName"
        header-align="center"
        align="center"
        label="所在组">
      </el-table-column>
      <el-table-column
        prop="fileUrl"
        header-align="center"
        align="center"
        label="资源">
          <template slot-scope="scope">
            <img v-if="scope.row.uploadType === 2" :src="scope.row.fileUrl" min-width="60" height="60" @click="handleImgView(scope.$index, scope.row.fileUrl)"/>
            <span v-else>
              <a :href="scope.row.fileUrl"
                target="_blank"
                class="buttonText">{{scope.row.fileUrl}}</a>
            </span>
          </template>
      </el-table-column>
      <el-table-column
        prop="fileName"
        header-align="center"
        align="center"
        label="原名">
      </el-table-column>
      <el-table-column
        prop="fileType"
        header-align="center"
        align="center"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="fileSize"
        header-align="center"
        align="center"
        label="大小M">
      </el-table-column>
      <el-table-column
        prop="archiveName"
        header-align="center"
        align="center"
        label="存档名">
      </el-table-column>
      <el-table-column
        prop="systemId"
        header-align="center"
        align="center"
        label="所属系统">
        <template slot-scope="scope">
          <span>{{transSystem(scope.row.systemId)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="clentId"
        header-align="center"
        align="center"
        label="所属客户">
        <template slot-scope="scope">
          <span>{{transClent(scope.row.clentId)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('base:ossfile:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('base:ossfile:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm.limit"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 云存储配置 -->
    <config v-if="configVisible" ref="config"></config>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
    <el-dialog :visible.sync="dialogImgVisible" width="410px" height="370px">
      <img width="100%" :src="avatar" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import Config from './ossfile-config'
  import Upload from './ossfile-upload'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          fileUrl: '',
          groupId: ''
        },
        avatar: '',
        dataList: [],
        totalPage: 0,
        selectGroupid: 0,
        dataListSelections: [],
        configVisible: false,
        uploadVisible: false,
        dialogImgVisible: false
      }
    },
    components: {
      Config,
      Upload
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (groupId) {
        this.searchForm.groupId = groupId
        this.$http({
          url: '/base/ossfile/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'fileUrl': this.searchForm.fileUrl,
            'groupId': groupId
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
      // 云存储配置
      configHandle () {
        this.configVisible = true
        this.$nextTick(() => {
          this.$refs.config.init()
        })
      },
      // 上传文件
      uploadHandle () {
        if (this.selectGroupid === null || this.selectGroupid === 0) {
          this.$message({
            message: '请先选择左侧资源组',
            type: 'warning',
            duration: 1500
          })
          return false
        }
        this.uploadVisible = true
        this.$nextTick(() => {
          this.$refs.upload.init(this.selectGroupid)
        })
      },
      showImg (url) {
        this.$alert(`<img src="${url}" style="width: auto">`, '', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭',
          callback: action => {

          }
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
            url: `/base/ossfile/${ids}`,
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
      },
      handleImgView (index, avatar) {
        this.avatar = avatar
        this.dialogImgVisible = true
      }
    }
  }
</script>
