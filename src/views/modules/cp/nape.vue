<template>
  <div class="mod-nape">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="searchForm.jibie" placeholder="请选择等级">
        <el-option
          v-for="store in jibieList"
          :key="store.jibie"
          :label="store.jibieName"
          :value="store.jibie">
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
        <el-button v-if="isAuth('cp:nape:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('cp:nape:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
     <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>-->
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
        prop="xa"
        header-align="center"
        align="center"
        label="a项">
      </el-table-column>
      <el-table-column
        prop="xb"
        header-align="center"
        align="center"
        label="b项">
      </el-table-column>
      <el-table-column
        prop="xc"
        header-align="center"
        align="center"
        label="c项">
      </el-table-column>
      <el-table-column
        prop="xd"
        header-align="center"
        align="center"
        label="d项">
      </el-table-column>
      <el-table-column
        prop="isteshu"
        header-align="center"
        align="center"
        label="是否是特殊">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isteshu ===0">否</el-tag>
          <el-tag v-if="scope.row.isteshu ===1">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="xx1"
        header-align="center"
        align="center"
        label="选项1">
      </el-table-column>
      <el-table-column
        prop="xx2"
        header-align="center"
        align="center"
        label="选项2">
      </el-table-column>
      <el-table-column
        prop="xx3"
        header-align="center"
        align="center"
        label="选项3">
      </el-table-column>
      <el-table-column
        prop="xx4"
        header-align="center"
        align="center"
        label="选项4">
      </el-table-column>
      <el-table-column
        prop="xx5"
        header-align="center"
        align="center"
        label="选项5">
      </el-table-column>
      <el-table-column
        prop="xx6"
        header-align="center"
        align="center"
        label="选项6">
      </el-table-column>
      <el-table-column
        prop="xx7"
        header-align="center"
        align="center"
        label="选项7">
      </el-table-column>
      <el-table-column
        prop="xx8"
        header-align="center"
        align="center"
        label="选项8">
      </el-table-column>
      <el-table-column
        prop="xx9"
        header-align="center"
        align="center"
        label="选项9">
      </el-table-column>
      <el-table-column
        prop="xx10"
        header-align="center"
        align="center"
        label="选项10">
      </el-table-column>
      <el-table-column
        prop="xx11"
        header-align="center"
        align="center"
        label="选项11">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('cp:nape:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('cp:nape:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './nape-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          jibie: -1,
          yiceng: '',
          erceng: '',
          sanceng: '',
          siceng: '',
          page: 1,
          limit: 10,
          name: ''
        },
        dataList: [],
        jibieList: [{jibie:-1,jibieName:"全部"},{jibie:2,jibieName:"二级"},{jibie:3,jibieName:"三级"}],
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
          url: '/cp/nape/list',
          method: 'get',
          params: {
            'jibie': this.searchForm.jibie,
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
            url: `/cp/nape/${ids}`,
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
