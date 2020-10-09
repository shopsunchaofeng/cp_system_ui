<template>
  <div class="mod-clent">
    <split-pane :min-percent="10" :default-percent="20" split="vertical">
      <template slot="paneL">
        <el-scrollbar :style="contentStyle">
          <el-card class="box-card">
            <el-input v-model="filterText" placeholder="输入关键字进行过滤"/>
            <el-tree
              ref="areaTree"
              :data="areaTreeData"
              :props="areaTreeProps"
              :filter-node-method="treeFilterNode"
              :expand-on-click-node="true"
              :load="loadTreeNode"
              lazy
              class="filter-tree"
              node-key="id"
              highlight-current
              @node-click="getDataList"
            />
          </el-card>
        </el-scrollbar>
      </template>
      <template slot="paneR" >
        <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
              <el-form-item>
                <el-input v-model="searchForm.clentName" placeholder="客户名称" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('base:clent:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-if="isAuth('base:clent:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
                prop="clientCode"
                header-align="center"
                align="center"
                label="客户编号">
              </el-table-column>
              <el-table-column
                prop="clentName"
                header-align="center"
                align="center"
                label="客户名称">
              </el-table-column>
              <el-table-column
                prop="contactPhone"
                header-align="center"
                align="center"
                label="电话">
              </el-table-column>
              <el-table-column
                prop="contactName"
                header-align="center"
                align="center"
                label="联系人">
              </el-table-column>
              <el-table-column
                prop="locationProvinceId"
                header-align="center"
                align="center"
                label="所在地">
              </el-table-column>
              <el-table-column
                prop="status"
                header-align="center"
                align="center"
                label="状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status === 0" size="small" type="danger">无效</el-tag>
                  <el-tag v-else-if="scope.row.status === 1" size="small" type="success">有效</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="updTime"
                header-align="center"
                align="center"
                label="创建/更新时间">
              </el-table-column>
              <el-table-column
                prop="updName"
                header-align="center"
                align="center"
                label="创建/更新人">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="isAuth('base:clent:opensystem')" type="text" size="small" @click="openSystemHandle(scope.row.id)">系统开通</el-button>
                  <el-button v-if="isAuth('base:clent:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                  <el-button v-if="isAuth('base:clent:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
      </template>
    </split-pane>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <system-plug-select v-if="addOrUpdateVisible" ref="systemPlugSelect" ></system-plug-select>

    
  </div>
</template>

<script>
  import AddOrUpdate from './clent-add-or-update'
  import SystemPlugSelect from './system-plug-select'
  
  import splitPane from 'vue-splitpane'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          clentName: '',
          locationProvinceId: '',
          locationCityId: '',
          locationCountyId: ''
        },
        dataList: [],
        totalPage: 0,
        contentStyle: {
          height: window.innerHeight - 130 + 'px'
        },
        filterText: '',
        areaTreeData: [],
        areaTreeProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
        },
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    watch: {
      filterText (val) {
        this.$refs.areaTree.filter(val)
      }
    },
    components: {
      AddOrUpdate, splitPane, SystemPlugSelect
    },
    activated () {
      this.getDataList()
    },
    methods: {
      treeFilterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 动态加载树
      loadTreeNode (node, resolve) {
        this.$http({
          url: '/id/region/getTreeByAreaId',
          method: 'get',
          params: {
            'level': node.level,
            'areaId': (!node.data.id) ? 0 : node.data.id
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            resolve(data.data)
          } else {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500
            })
          }
        })
      },
      // 获取数据列表
      getDataList (val) {
        if (val) {
          this.searchForm.locationProvinceId = ''
          this.searchForm.locationCityId = ''
          this.searchForm.locationCountyId = ''
          if (val.level === 1) {
            this.searchForm.locationProvinceId = val.id
          } else if (val.level === 2) {
            this.searchForm.locationCityId = val.id
          } else if (val.level === 3) {
            this.searchForm.locationCountyId = val.id
          }
        }
        this.$http({
          url: '/base/clent/list',
          method: 'get',
          params: this.searchForm
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
      // 开通系统
      openSystemHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.systemPlugSelect.init(id)
        })
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
            url: `/base/clent/${ids}`,
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
