<template>
  <el-dialog :title="`整体测评`" :close-on-click-modal="false" :visible.sync="visible" :modal="false" :width="`1200px`" @close="closeDialog">
    <div class="mod-nape">
      <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-select v-model="searchForm.cpnstatus" placeholder="所有状态">
            <el-option v-for="store in cpnstatusList" :key="store.cpnstatus" :label="store.cpnstatusName" :value="store.cpnstatus">
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
          <!-- <el-button v-if="isAuth('cp:project:dycp')" type="primary" size="small" @click="dycpHandle">开始单元测评</el-button> -->
          <!-- <el-button @click="cpresultHandle" type="success" v-if="showhzFlag">测评汇总</el-button> -->
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column prop="jibie" header-align="center" align="center" label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.jibie ===2">二级</el-tag>
            <el-tag v-if="scope.row.jibie ===3">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="yiceng" header-align="center" align="center" label="第一层">
        </el-table-column>
        <el-table-column prop="erceng" header-align="center" align="center" label="第二层">
        </el-table-column>
        <el-table-column prop="sanceng" header-align="center" align="center" label="第三层">
        </el-table-column>
        <el-table-column prop="siceng" header-align="center" align="center" label="第四层">
        </el-table-column>
        <el-table-column prop="yaoqiu" header-align="center" align="center" label="要求">
        </el-table-column>
        <!-- <el-table-column prop="cpnstatus" header-align="center" align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cpnstatus ==='0'">未测评</el-tag>
            <el-tag v-if="scope.row.cpnstatus ==='1'">已测评</el-tag>
            <el-tag v-if="scope.row.cpnstatus ==='2'">已汇总</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('cp:project:update')&&scope.row.cpnstatus==2" type="text" size="small" @click="ztcpHandle(scope.row.cpuid)">整体测评</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="searchForm.page" :page-sizes="[8, 10, 20, 50, 100]" :page-size="searchForm.limit" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

      <!--单元测评页面-->
      <cpcontent v-if="dycpVisible" ref="dycp" @refreshDataList="getDataList"></cpcontent>

      <!--单元测评汇总页面-->
      <cpresult v-if="cpresultVisible" ref="cpresult" @refreshDataList="getDataList"></cpresult>

      <!-- 整体测评及修改页面 -->
      <cpcontentchange v-if="cpcontentchangeVisible" ref="cpcontentchange" @refreshDataList="getDataList"></cpcontentchange>

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="querentijiao">确认提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AddOrUpdate from './nape-add-or-update'
import Cpcontent from './cpcontent'
import Cpresult from './cpresult'
import Cpcontentchange from './cpcontentchange'

export default {
  data() {
    return {
      searchForm: {
        cpnstatus: 2,
        realName: '',
        yiceng: '',
        erceng: '',
        sanceng: '',
        siceng: '',
        page: 1,
        limit: 8,
        name: ''
      },
      dataList: [],
      cpuserList: [],
      projectid: '',
      cpnstatusList: [{ cpnstatus: 2, cpnstatusName: "未整体测评" }, { cpnstatus: 3, cpnstatusName: "已整体测评" }],
      totalPage: 0,
      dataListSelections: [],
      visible: false,
      dycpVisible: false,
      addOrUpdateVisible: false,
      cpresultVisible: false,
      cpcontentchangeVisible: false,
      showhzFlag: false,
    }
  },
  components: {
    Cpcontent, AddOrUpdate, Cpresult, Cpcontentchange
  },
  methods: {
    // 确认提交
    querentijiao() {
      var that=this;
      console.log('tag', this.projectid)
      this.$http({
        url: `/cp/projectuser/tijiao?projectid=${that.projectid}`,
        method: `get`,
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.visible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
          this.$emit("refreshDataList");
        }
      })
    },

    closeDialog(){
      this.$emit("refreshDataList");
    },
    // 单元测评
    cpresultHandle() {
      this.cpresultVisible = true
      this.$nextTick(() => {
        this.$refs.cpresult.getDataList(this.projectid)
      })
    },
    // 单元测评
    dycpHandle(cpuid) {
      this.dycpVisible = true
      this.$nextTick(() => {
        this.$refs.dycp.getDataList(this.projectid, cpuid, 2)
      })
    },
    // 整体测评
    ztcpHandle(cpuid) {
      this.cpcontentchangeVisible = true
      this.$nextTick(() => {
        this.$refs.cpcontentchange.getDataList(this.projectid, cpuid, 2)
      })
    },
    // 获取数据列表
    getDataList(projectid) {
      this.visible = true
      if (projectid) {
        this.projectid = projectid
      }
      this.getIsCpOK(this.projectid)
      this.$http({
        url: '/cp/nape/dycprwlist',
        method: 'get',
        params: {
          'projectid': this.projectid,
          'realName': this.searchForm.realName,
          'cpnstatus': this.searchForm.cpnstatus,
          'yiceng': this.searchForm.yiceng,
          'erceng': this.searchForm.erceng,
          'sanceng': this.searchForm.sanceng,
          'siceng': this.searchForm.siceng,
          'page': this.searchForm.page,
          'limit': this.searchForm.limit,
          'name': this.searchForm.name,
        }
      }).then(({ data }) => {
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
    sizeChangeHandle(val) {
      this.searchForm.limit = val
      this.searchForm.page = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.searchForm.page = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    //获取是否完成测评
    getIsCpOK(projectid) {
      this.$http({
        url: '/cp/nape/dycprwlist',
        method: 'get',
        params: {
          'projectid': projectid,
          'cpnstatus': 0,
          'page': 1,
          'limit': 1,
        }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          if (data.page.total == 0) {
            this.showhzFlag = true;
          } else {
            this.showhzFlag = false;
          }
        }
      })
    },
  }
}
</script>
