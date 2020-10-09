<template>
  <div class="mod-param">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getParamDataList()">
      <el-form-item>
        <el-input v-model="searchForm.paramName" placeholder="字典名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getParamDataList()">查询</el-button>
        <el-button v-if="isAuth('base:param:save')" type="primary" @click="addOrUpdateParamHandle()">新增</el-button>
        <el-button v-if="isAuth('base:param:remove')" type="danger" @click="deleteParamHandle()"
                   :disabled="dictDataListSelections.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dictDataList"
      border
      @selection-change="selectionChangeDictHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="groupCode"
        header-align="center"
        align="center"
        label="分组编码" width="100">
      </el-table-column>
      <el-table-column
        prop="groupName"
        header-align="center"
        align="center"
        label="分组名称" width="150">
      </el-table-column>
      <el-table-column
        prop="paramName"
        header-align="center"
        align="center"
        label="字典名称"  width="200">
      </el-table-column>
      <el-table-column
        prop="paramValue"
        header-align="center"
        align="center"
        label="字典值" width="150">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="说明">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态"  width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else-if="scope.row.status === 1" size="small" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('base:param:update')" type="text" size="small"
                     @click="addOrUpdateParamHandle(scope.row.id)">修改
          </el-button>
          <el-button v-if="isAuth('base:param:remove')" type="text" size="small" @click="deleteParamHandle(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeDictHandle"
      @current-change="currentChangeDictHandle"
      :current-page="dictPageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="dictPageSize"
      :total="dictTotalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <param-add-or-update v-if="dictVisible" ref="paramAddOrUpdate"
                        @refreshDataList="getParamDataList"></param-add-or-update>
  </div>
</template>

<script>
  import ParamAddOrUpdate from './param-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          paramName: ''
        },
        dictDataList: [],
        dictPageIndex: 1,
        dictPageSize: 10,
        dictTotalPage: 0,
        dictDataListSelections: [],
        dictVisible: false,
        groupId: '',
        groupCode: ''
      }
    },
    components: {
      ParamAddOrUpdate
    },
    activated () {
      this.getParamDataList()
    },
    methods: {
      // 获取数据列表
      getParamDataList (groupId, groupCode) {
        this.groupId = groupId
        this.groupCode = groupCode
        this.$http({
          url: '/base/param/list',
          method: 'get',
          params: {
            'page': this.dictPageIndex,
            'limit': this.dictPageSize,
            'paramName': this.searchForm.paramName,
            'groupId': this.groupId,
            'groupCode': this.groupCode
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dictDataList = data.page.records
            this.dictTotalPage = data.page.total
          } else {
            this.dictDataList = []
            this.dictTotalPage = 0
          }
        })
      },
      // 每页数
      sizeChangeDictHandle (val) {
        this.dictPageSize = val
        this.dictPageIndex = 1
        this.getParamDataList()
      },
      // 当前页
      currentChangeDictHandle (val) {
        this.dictPageIndex = val
        this.getParamDataList()
      },
      // 多选
      selectionChangeDictHandle (val) {
        this.dictDataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateParamHandle (id) {
        this.dictVisible = true
        this.$nextTick(() => {
          this.$refs.paramAddOrUpdate.init(id, this.groupId)
        })
      },
      // 删除
      deleteParamHandle (id) {
        let ids = id ? [id] : this.dictDataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/base/param/${ids}`,
            method: 'delete'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getParamDataList()
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
