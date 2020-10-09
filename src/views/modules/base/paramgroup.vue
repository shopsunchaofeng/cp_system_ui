<template>
  <div class="mod-dictgroup">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>参数组</span>
            <el-button v-if="isAuth('base:paramgroup:save')" style="padding-left: 20px" type="text" @click="addOrUpdateHandle(1)">新增</el-button>
            <el-button v-if="isAuth('base:paramgroup:update')" style="padding: 3px" type="text" @click="addOrUpdateHandle(2)">编辑</el-button>
            <el-button v-if="isAuth('base:paramgroup:remove')" style="padding: 3px" type="text" @click="deleteHandle()">删除</el-button>
          </div>
          <el-tree
            ref="paramgroupTree"
            :data="paramgroupTreeData"
            :props="paramgroupTreeProps"
            :expand-on-click-node="false"
            default-expand-all
            class="filter-tree"
            node-key="paramgroupid"
            highlight-current
            @node-click="clickParamgroup">
          </el-tree>
        </el-card>
        
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getTreeList"></add-or-update>
      </el-col>
      <el-col :span="18">
        <Params ref="param"></Params>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AddOrUpdate from './paramgroup-add-or-update'
  import Params from './param'

  export default {
    data () {
      return {
        searchTreeForm: {
          name: ''
        },
        searchForm: {
          groupCode: '',
          name: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false,
        paramgroupTreeData: [],
        paramgroupid: null,
        paramgroupTreeProps: {
          parent: 'parentId', // 父级唯一标识
          value: 'groupId', // 唯一标识
          label: 'name', // 标签显示
          children: 'children' // 子级
        }
      }
    },
    components: {
      AddOrUpdate, Params
    },
    activated () {
      this.getTreeList()
    },
    methods: {
      clickParamgroup (data) {
        this.paramgroupid = data.groupId
        this.$nextTick(() => {
          this.$refs.param.getParamDataList(data.groupId, null)
        })
      },
      // 获取数据列表
      getTreeList () {
        this.$http({
          url: '/base/paramgroup/find',
          method: 'get',
          params: {
            'name': this.searchTreeForm.name
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.paramgroupTreeData = this.treeDataTranslate(data.paramgroupList, 'groupId', 'parentId')
          } else {
            this.paramgroupTreeData = []
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (flag) {
        if (flag === 2) {
          if (this.paramgroupid === null) {
            this.$message({
              message: '请选择要编辑的参数组',
              type: 'warning',
              duration: 1500
            })
            return false
          }
          if (this.paramgroupid === 0) {
            this.$message({
              message: '顶级目录不允许编辑',
              type: 'warning',
              duration: 1500
            })
            return false
          }
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(this.paramgroupid)
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
        if (this.paramgroupid === null) {
          this.$message({
            message: '请选择要删除的参数组',
            type: 'warning',
            duration: 1500
          })
          return false
        }
        if (this.paramgroupid === 0) {
          this.$message({
            message: '顶级目录不允许删除',
            type: 'warning',
            duration: 1500
          })
          return false
        }
        let ids = this.paramgroupid
        this.$confirm(`确定对[id=${ids}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/base/paramgroup/${ids}`,
            method: 'delete'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getTreeList()
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
