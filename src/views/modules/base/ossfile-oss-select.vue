<template>

  <el-dialog
    width="75%"
    :modal-append-to-body="false" :append-to-body="true"
    title="选择文件"
    :close-on-click-modal="false"
    @close="closeHandle"
    :visible.sync="visible">
    <div class="mod-oss-select" style="height:500px;">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>资源组</span>
              <el-button v-if="isAuth('base:ossgroup:save')" style="padding-left: 10px" type="text" @click="addOrUpdateHandle(1)">新增</el-button>
              <el-button v-if="isAuth('base:ossgroup:update')" style="padding: 1px" type="text" @click="addOrUpdateHandle(2)">编辑</el-button>
              <el-button v-if="isAuth('base:ossgroup:remove')" style="padding: 1px" type="text" @click="deleteHandle()">删除</el-button>
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
          <div class="img-list">
              <el-form :inline="true" >
                <el-form-item>
                  <el-button v-if="isAuth('base:ossfile:upload')" type="primary" @click="uploadHandle()">上传文件</el-button>
                </el-form-item>
              </el-form>
              <div class="img-content" v-for="(item,key) in dataList" :key="key">
                  <el-image :src="item.fileUrl" :ref="item.id">
                    <div slot="error" class="image-slot" style="height:160px">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <div class="name">
                      <div >{{ item.fileName }}</div>
                      <!-- <el-button type="text" @click="handleFileName(item,key)">修改名字</el-button> -->
                  </div>
      <!-- 删除icon -->
                  <div class="del">
                      <i @click="deletePictureHandle(item.id)" class="el-icon-delete"></i>
                  </div>
                  <!-- <div class="edit">
                      <i @click="showPicturePreview(item,key)" class="el-icon-edit"></i>
                  </div> -->
                  <div class="view">
                      <i @click="showPicturePreview(item.fileUrl)" class="el-icon-view"></i>
                  </div>
      <!-- 放大icon -->
                  <div class="layer" :style="selectIds.indexOf(item.id) > -1?layerClass:''" @click="checkPicture(item,key)">
                      <i class="el-icon-check"></i>
                  </div>
              </div>
          </div>
          <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="searchForm.page"
              :page-sizes="[9, 18, 27, 81]"
              :page-size="searchForm.limit"
              :total="totalPage"
              layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
          <!-- <ul class="el-upload-list el-upload-list--picture-card images-list__input">
            <li tabindex="0" class="el-upload-list__item" v-for="(item, index) in dataList" :key="index">
              <el-image :src="item.fileUrl" class="el-upload-list__item-thumbnail">
                <div slot="placeholder" class="image-slot" >
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
              <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
              <i class="el-icon-close"></i>
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="showPicturePreview(item.fileUrl)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </li>
          </ul> -->
        </el-col>
      </el-row>
    </div>
    
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="true" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="confirmSelectHandle">确定</el-button>
    </span>
    
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
  </el-dialog>

</template>

<script>
  import AddOrUpdate from './ossgroup-add-or-update'
  import Ossfile from './ossfile'
  import Upload from './ossfile-upload'

  export default {
    data () {
      return {
        searchTreeForm: {
          name: ''
        },
        searchForm: {
          page: 1,
          limit: 12,
          name: ''
        },
        visible: false,
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
        },
        multipleSelection: false,
        selectIds: [],
        activeUrls: [],
        layerClass: 'opacity: 1',
        dialogVisible: false,
        uploadVisible: false,
        dialogImageUrl: ''
      }
    },
    components: {
      AddOrUpdate, Ossfile, Upload
    },
    activated () {
      this.getTreeList()
    },
    methods: {
      // 上传文件
      uploadHandle () {
        if (this.ossgroupId === null || this.ossgroupId === 0) {
          this.$message({
            message: '请先选择左侧资源组',
            type: 'warning',
            duration: 1500
          })
          return false
        }
        this.uploadVisible = true
        this.$nextTick(() => {
          this.$refs.upload.init(this.ossgroupId)
        })
      },
      deletePictureHandle (id) {
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/base/ossfile/${id}`,
            method: 'DELETE'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList(this.ossgroupId)
            }
          })
        }).catch(() => {
        })
      },
      showPicturePreview (url) {
        let lastName = url.substring(url.lastIndexOf('.'), url.length).toLowerCase()
        if (lastName === '.jpg' || lastName === '.jpeg' || lastName === '.png' || lastName === '.gif') {
          this.dialogImageUrl = url
          this.dialogVisible = true
        } else {
          window.open(url)
        }
      },
      checkPicture (file, key) {
        if (this.selectIds.indexOf(file.id) > -1) {
          this.selectIds.splice(this.selectIds.indexOf(file.id), 1)
          return
        }
        if (!this.multipleSelection) {
          this.selectIds = []
        }
        this.selectIds.push(file.id)
      },
      init (multipleSelection) {
        this.selectIds = []
        this.selectUrls = []
        this.multipleSelection = multipleSelection
        this.getTreeList()
        this.getDataList()
        this.visible = true
      },
      clickOssgroup (data) {
        this.ossgroupId = data.id
        if (data.parentId === 0) {
          this.ossgroupId = 0
          this.getDataList(0)
        } else {
          this.getDataList(this.ossgroupId)
        }
      },
      // 每页数
      sizeChangeHandle (val) {
        this.searchForm.limit = val
        this.searchForm.page = 1
        this.getDataList(this.ossgroupId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.searchForm.page = val
        this.getDataList(this.ossgroupId)
      },
      // 获取数据列表
      getDataList (groupId) {
        if (!groupId) {
          this.searchForm.groupId = this.ossgroupId
        } else {
          this.searchForm.groupId = groupId
        }
        this.$http({
          url: '/base/ossfile/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'fileUrl': this.searchForm.fileUrl,
            'groupId': this.searchForm.groupId
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
            url: `/base/ossgroup/${ids}`,
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
      // 确认选择
      confirmSelectHandle () {
        this.selectIds.forEach(id => {
          this.selectUrls.push(this.$refs[id][0].src)
        })
        this.$emit('selectData', this.selectIds, this.selectUrls)
        this.visible = false
      },
      // 弹窗关闭时
      closeHandle () {
      }
    }
  }
</script>

<style lang="scss">
  *{
    box-sizing: border-box;
}
.img-list{
    overflow:hidden;
    width:100%;
}
.img-list .img-content{
    // float:left;
    position:relative;
    display:inline-block;
    width:200px;
    height:230px;
    padding:5px;
    margin:5px 10px 10px 0;
    border:1px solid #d1dbe5;
    border-radius:4px;
    transition:all .3s;
    box-shadow:0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
.img-list .img-content img{
    display:block;
    width:100%;
    height:160px;
    margin:0 auto;
    border-radius:4px;
}
.img-list .img-content .name{
    margin-top:10px;
}
.img-list .img-content .name>div{
    width:90%;
    text-overflow:ellipsis;
    overflow:hidden;
    height:25px;
    line-height:25px;
}

.img-list .img-content:hover .del,
.img-list .img-content:hover .edit,
.img-list .img-content:hover .view{
  opacity:1;
}
.img-list .img-content .del,
.img-list .img-content .edit,
.img-list .img-content .view,
.img-list .img-content .layer{
    opacity:0;
    transition:all .3s;
}
.img-list .img-content .del{
    position:absolute;
    bottom:5px;
    right:35px;
    color:#8492a6;
    cursor:pointer;
    font-size:1.5em;
}
.img-list .img-content .edit{
    position:absolute;
    bottom:5px;
    right:60px;
    color:#8492a6;
    cursor:pointer;
    font-size:1.5em;
}
.img-list .img-content .view{
    position:absolute;
    bottom:5px;
    right:5px;
    color:#8492a6;
    cursor:pointer;
    font-size:1.5em;
}
.img-list .img-content .layer{
    position:absolute;
    left:0;
    right:0;
    top:0;
    height:200px;
    color:#fff;
    text-align:center;
    z-index:5;
    background-color:rgba(0,0,0,.4);
}
.img-list .img-content .layer i{
    font-size:1.6em;
    margin-top:80px;
}
</style>
