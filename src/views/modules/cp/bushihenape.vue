<template>
  <el-dialog
    :title="`挑选不适合项`"
    :close-on-click-modal="false"
    :visible.sync="visible"
     :width="`1200px`">
  <div class="mod-nape">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="searchForm.fenp" placeholder="状态">
          <el-option
            v-for="store in fenpList"
            :key="store.fenp"
            :label="store.fenpStatus"
            :value="store.fenp">
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
        <el-button v-if="isAuth('cp:nape:bushihe')" type="danger" @click="bushiheHandle()" :disabled="dataListSelections.length <= 0">不适合</el-button>
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
        prop="isshihe"
        header-align="center"
        align="center"
        label="是否适合">
        <template slot-scope="scope">
          <span v-if="scope.row.isshihe ==='-1'" style="color: green">适合</span>
          <span v-if="scope.row.isshihe !=='-1'" style="color: red">不适合</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('cp:nape:bushihe') && scope.row.isshihe ==='-1'" type="text" size="small" @click="bushiheHandle(scope.row.id)">不适合</el-button>
          <el-button v-if="isAuth('cp:nape:bushihe') && scope.row.isshihe !=='-1'" type="text" size="small" @click="shiheHandle(scope.row.id)">适合</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="searchForm.page"
        :page-sizes="[8, 10, 20, 50, 100]"
        :page-size="searchForm.limit"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="querenHandle()">确认提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import AddOrUpdate from './nape-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          jibie: -1,
          fenp: 2,
          yiceng: '',
          erceng: '',
          sanceng: '',
          siceng: '',
          page: 1,
          limit: 8,
          name: ''
        },
        dataList: [],
        projectid: '',
        fenpList: [{fenp:-1,fenpStatus:"全部"},{fenp:2,fenpStatus:"适合"},{fenp:3,fenpStatus:"不适合"}],
        totalPage: 0,
        dataListSelections: [],
        visible:false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    methods: {
      // 获取数据列表
      getDataList (projectid,systemdengji) {
        this.visible=true
        if (projectid){
          this.projectid=projectid
          this.searchForm.jibie=systemdengji
        }
        this.$http({
          url: '/cp/nape/bushihelist',
          method: 'get',
          params: {
            'projectid': this.projectid,
            'fenp': this.searchForm.fenp,
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
      //不适合项确认
      querenHandle() {
        this.$http({
          url: `/cp/nape/queren?projectid=${this.projectid}`,
          method: 'GET'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
      },

     //适合
      shiheHandle(id) {
        this.$http({
          url: `/cp/nape/shihe/${id}?projectid=${this.projectid}`,
          method: 'GET'
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
      },
      // 挑选不适合项
      bushiheHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定为不适合项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/cp/nape/bushihe/${ids}?projectid=${this.projectid}`,
            method: 'GET'
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
