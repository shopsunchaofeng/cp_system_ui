<template>
  <div class="mod-ossgroup">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>资源组</span>
            <el-button v-if="isAuth('base:ossgroup:save')" style="padding-left: 20px" type="text" @click="addOrUpdateHandle(1)">新增</el-button>
            <el-button v-if="isAuth('base:ossgroup:update')" style="padding: 3px" type="text" @click="addOrUpdateHandle(2)">编辑</el-button>
            <el-button v-if="isAuth('base:ossgroup:remove')" style="padding: 3px" type="text" @click="deleteHandle()">删除</el-button>
          </div>
          <el-tree
            ref="ossgroupTree"
            :data="ossgroupTreeData"
            :props="ossgroupTreeProps"
            :expand-on-click-node="false"
            default-expand-all
            class="filter-tree"
            node-key="ossgroupId"
            highlight-current
            @node-click="clickOssgroup">
          </el-tree>
        </el-card>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getTreeList"></add-or-update>
      </el-col>
      <el-col :span="18">
        <Ossfile ref="ossfile"></Ossfile>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AddOrUpdate from './ossgroup-add-or-update'
  import Ossfile from './ossfile'

  export default {
    data () {
      return {
        searchTreeForm: {
          name: ''
        },
        searchForm: {
          page: 1,
          limit: 10,
          name: ''
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false,
        ossgroupTreeData: [],
        ossgroupId: null,
        ossgroupTreeProps: {
          parent: 'parentId', // 父级唯一标识
          value: 'id', // 唯一标识
          label: 'name', // 标签显示
          children: 'children' // 子级
        }
      }
    },
    components: {
      AddOrUpdate, Ossfile
    },
    activated () {
      this.getTreeList()
    },
    methods: {
      clickOssgroup (data) {
        this.ossgroupId = data.id
        if (data.parentId === 0) {
          this.ossgroupId = 0
        }
        this.$nextTick(() => {
          this.$refs.ossfile.getDataList(this.ossgroupId)
          this.$refs.ossfile.selectGroupid = this.ossgroupId
        })
      },
      // 获取数据列表
      getTreeList () {
        this.$http({
          url: '/base/ossgroup/find',
          method: 'get',
          params: {
            'name': this.searchTreeForm.name
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.ossgroupTreeData = this.treeDataTranslate(data.ossgroupList, 'id', 'parentId')
          } else {
            this.ossgroupTreeData = []
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (flag) {
        if (flag === 2) {
          if (this.ossgroupId === null) {
            this.$message({
              message: '请选择要编辑的参数组',
              type: 'warning',
              duration: 1500
            })
            return false
          }
          if (this.ossgroupId === 0) {
            this.$message({
              message: '顶级目录不允许编辑',
              type: 'warning',
              duration: 1500
            })
            return false
          }
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(this.ossgroupId)
          })
        } else {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(null)
          })
        }
      },
      // 删除
      deleteHandle () {
        if (this.ossgroupId === null) {
          this.$message({
            message: '请选择要编辑的参数组',
            type: 'warning',
            duration: 1500
          })
          return false
        }
        this.$confirm(`确定对[id=${this.ossgroupId}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/base/ossgroup/${this.ossgroupId}`,
            method: 'DELETE'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getTreeList()
              this.$refs.ossfile.getDataList(0)
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
