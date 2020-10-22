<template>
  <div class="mod-project">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="系统名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('cp:project:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('cp:project:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="systemname" header-align="center" align="center" label="系统名称">
      </el-table-column>
      <el-table-column prop="danweiname" header-align="center" align="center" label="单位名称">
      </el-table-column>
      <el-table-column prop="systemdengji" header-align="center" align="center" label="系统级别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.systemdengji ===2">二级</el-tag>
          <el-tag v-if="scope.row.systemdengji ===3">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="测评机构性质">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type ===1">测评机构</el-tag>
          <el-tag v-if="scope.row.type ===2">非测评机构</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ===0">待挑选不适合项目</el-tag>
          <el-tag v-if="scope.row.status ===1">待分配</el-tag>
          <el-tag v-if="scope.row.status ===11">待编辑测评对象</el-tag>
          <el-tag v-if="scope.row.status ===2 && scope.row.cpuid !== '0'">测评中</el-tag>
          <el-tag v-if="scope.row.status ===3 || (scope.row.cpuid === '0' && scope.row.status !==0 && scope.row.status !==1 && scope.row.status !==4 && scope.row.status !==11)">单元测评完成</el-tag>
          <el-tag v-if="scope.row.status ===4">整体测评完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creattime" header-align="center" align="center" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('cp:project:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('cp:nape:bushihe') && scope.row.status ===0 && scope.row.type ===1" type="text" size="small" @click="bushiheHandle(scope.row.id,scope.row.systemdengji)">挑选不适合项</el-button>
          <el-button v-if="isAuth('cp:nape:fenpei') && scope.row.status ===1 && scope.row.type ===1" type="text" size="small" @click="fenpeiHandle(scope.row.id,scope.row.systemdengji)">分配测评任务</el-button>
          <el-button v-if="isAuth('cp:nape:cprw') && scope.row.status ===2 && scope.row.type ===1" type="text" size="small" @click="cprwHandle(scope.row.id,scope.row.systemdengji)">查看测评任务</el-button>
          <el-button v-if="isAuth('cp:project:cps') && scope.row.status ===2" type="text" size="small" @click="showcpsHandle(scope.row.id)">查看测评师</el-button>
          <el-button v-if="isAuth('cp:project:dycp') && scope.row.status ===2 && scope.row.cpuid !== '0'" type="text" size="small" @click="cpwnapeListHandle(scope.row.id)">单元测评</el-button>
          <!--<el-button v-if="isAuth('cp:project:dycp') && scope.row.status ===2 && !(scope.row.status ===3 || (scope.row.cpuid === '0' && scope.row.status !==0 && scope.row.status !==1 && scope.row.status !==4))" type="text" size="small" @click="cpwnapeListHandle(scope.row.id)">单元测评</el-button>-->
          <el-button v-if="isAuth('cp:project:cpdetail') && scope.row.status ===4" type="text" size="small" @click="cpresultHandle(scope.row.id)"> 查看测评结果</el-button>
          <el-button v-if="isAuth('cp:project:cpdetail')" type="text" size="small" @click="editContentListHandle(scope.row.id)"> 编辑测评对象列表</el-button>
          <!-- <el-button v-if="isAuth('cp:project:cpdetail')" type="text" size="small" @click="editContentHandle(scope.row.id)"> 编辑测评对象</el-button> -->
          <el-button v-if="isAuth('cp:project:ztcp') && showhzFlag && scope.row.status ===3 && scope.row.type ===1" type="text" size="small" @click="ztcpHandle(scope.row.id)">整体测评</el-button>
          <el-button v-if="isAuth('cp:project:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="searchForm.page" :page-sizes="[10, 20, 50, 100]" :page-size="searchForm.limit" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!--分配测评任务-->
    <fenp-nape v-if="fenpnapeVisible" ref="fenpNape" @refreshDataList="getDataList"></fenp-nape>
    <!--挑选不适合项-->
    <bushihe-nape v-if="bushiheVisible" ref="bushiheNape" @refreshDataList="getDataList"></bushihe-nape>
    <!--查看分配的测评师-->
    <project-cpuser v-if="cpuserVisible" ref="projectcpuser" @refreshDataList="getDataList"></project-cpuser>
    <!--查看测评任务-->
    <cprwnape v-if="cprwVisible" ref="cprwnape" @refreshDataList="getDataList"></cprwnape>
    <!--单元测评页面-->
    <cpcontent v-if="dycpVisible" ref="dycp" @refreshDataList="getDataList"></cpcontent>
    <!--单元列表测评页面-->
    <cpwnapeList v-if="cpwnapeListVisible" ref="cpwnapeList" @refreshDataList="getDataList"></cpwnapeList>
    <!-- 整体测评列表 -->
    <cpwnapeListTotal v-if="cpwnapeListTotalVisible" ref="cpwnapeListTotal" @refreshDataList="getDataList"></cpwnapeListTotal>
    <!-- 测评结果 -->
    <cpresult v-if="cpresultVisible" ref="cpresult" @refreshDataList="getDataList"></cpresult>
    <!-- 编辑测评对象列表 -->
    <cpedit-content-list v-if="cpeditContentListVisible" ref="cpeditContentList" @refreshDataList="getDataList"></cpedit-content-list>
    <!-- 编辑测评对象 -->
    <edit-content v-if="editContentVisible" ref="editContent" @refreshDataList="getDataList"></edit-content>
  </div>
</template>
·
<script>
import AddOrUpdate from './project-add-or-update'
import FenpNape from './fepnape'
import BushiheNape from './bushihenape'
import ProjectCpuser from './projectcpuser'
import Cprwnape from './cprwnape'
import Cpcontent from './cpcontent'
import CpwnapeList from './cpwnapeList'
import CpwnapeListTotal from './cpwnapeListTotal'
import Cpresult from './cpresult'
import EditContent from './editContent'
import CpeditContentList from './cpeditContentList'

export default {
  data() {
    return {
      searchForm: {
        page: 1,
        limit: 10,
        name: ''
      },
      dataList: [],
      totalPage: 0,
      dataListSelections: [],
      fenpnapeVisible: false,
      bushiheVisible: false,
      cpuserVisible: false,
      cprwVisible: false,
      dycpVisible: false,
      addOrUpdateVisible: false,
      cpwnapeListVisible: false,
      cpwnapeListTotalVisible: false,
      cpresultVisible: false,
      cpeditContentListVisible: false,
      editContentVisible: false,
      showhzFlag: false,
    }
  },
  components: {
    AddOrUpdate, FenpNape, BushiheNape, ProjectCpuser, Cprwnape, Cpcontent, CpwnapeList, CpwnapeListTotal, Cpresult, EditContent, CpeditContentList
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.getIsCpOK();
      this.$http({
        url: '/cp/project/list',
        method: 'get',
        params: {
          'page': this.searchForm.page,
          'limit': this.searchForm.limit,
          'name': this.searchForm.name
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
    //是否显示整体测评
    getIsCpOK() {
      this.$http({
        url: '/cp/projectuser/ishuizong',
        method: 'get',
        params: {
        }
      }).then(({ data }) => {
        console.log('show', data)
        if (data && data.code === 200) {
          if (data.data.ishuizong == 1) {
            this.showhzFlag = true;
          } else {
            this.showhzFlag = false;
          }
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
    // 分配测评任务
    bushiheHandle(id, systemdengji) {
      this.bushiheVisible = true
      this.$nextTick(() => {
        this.$refs.bushiheNape.getDataList(id, systemdengji)
      })
    },
    // 查看测评任务
    cprwHandle(id, systemdengji) {
      this.cprwVisible = true
      this.$nextTick(() => {
        this.$refs.cprwnape.getDataList(id, systemdengji)
      })
    },
    // 分配测评任务
    fenpeiHandle(id, systemdengji) {
      this.fenpnapeVisible = true
      this.$nextTick(() => {
        this.$refs.fenpNape.getDataList(id, systemdengji)
      })
    },
    // 查看测评师
    showcpsHandle(projectid) {
      this.cpuserVisible = true
      this.$nextTick(() => {
        this.$refs.projectcpuser.getDataList(projectid)
      })
    },
    // 编辑测评对象列表
    editContentListHandle(projectid) {
      this.cpeditContentListVisible = true
      this.$nextTick(() => {
        this.$refs.cpeditContentList.getDataList(projectid)
      })
    },
    // 编辑测评对象
    editContentHandle(projectid) {
      this.editContentVisible = true
      this.$nextTick(() => {
        this.$refs.editContent.getDataList(projectid)
      })
    },
    // 整体测评列表
    ztcpHandle(projectid) {
      this.cpwnapeListTotalVisible = true
      this.$nextTick(() => {
        this.$refs.cpwnapeListTotal.getDataList(projectid)
      })
    },
    // 单元测评结果
    cpresultHandle(projectid) {
      this.cpresultVisible = true
      this.$nextTick(() => {
        this.$refs.cpresult.getDataList(projectid)
      })
    },
    // 单元测评列表
    cpwnapeListHandle(projectid) {
      this.cpwnapeListVisible = true
      this.$nextTick(() => {
        this.$refs.cpwnapeList.getDataList(projectid)
      })
    },
    // 单元测评
    dycpHandle(projectid) {
      this.dycpVisible = true
      this.$nextTick(() => {
        this.$refs.dycp.getDataList(projectid)
      })
    },
    // 删除
    deleteHandle(id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: `/cp/project/${ids}`,
          method: 'DELETE'
        }).then(({ data }) => {
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
