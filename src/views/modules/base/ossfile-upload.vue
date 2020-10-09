<template>
  <el-dialog
    :modal-append-to-body="false" :append-to-body="true"
    title="上传文件"
    :close-on-click-modal="false"
    @close="closeHandle"
    :visible.sync="visible">
    <el-upload
      drag
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      multiple
      :file-list="fileList"
      style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">{{tipMsg}}</div>
    </el-upload>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        url: '',
        num: 0,
        tipMsg: '',
        uploadType: 1,
        successNum: 0,
        fileList: []
      }
    },
    methods: {
      init (groupId) {
        // 修改
        this.$http({
          url: `/base/ossgroup/info/${groupId}`,
          method: 'get'
        }).then(({data}) => {
          if (data.data.uploadType === 1) {  // 可上传所有类型的资源文件
            this.tipMsg = '支持所有类型的文件上传！'
          } else if (data.data.uploadType === 2) { // 只可上传图片
            this.tipMsg = '只支持jpg、jpeg、png、gif格式的图片文件！'
          } else if (data.data.uploadType === 3) { // 视频
            this.tipMsg = '只支持avi、mov、rmvb、mp4格式的视频文件！'
          } else if (data.data.uploadType === 4) { // 文件
            this.tipMsg = '只支持doc、xls、pdf、txt、xml格式的文件！'
          }
          this.uploadType = data.data.uploadType
          this.url = this.$http.BASE_URL + `/base/ossfile/upload?token=${this.$cookie.get('token')}&groupId=` + groupId
          this.visible = true
        })
      },
      // 上传之前
      beforeUploadHandle (file) {
        let bo = false
        if (this.uploadType === 1) { // 支持所有类型
          bo = true
        }
        if (this.uploadType === 2) { // 只可上传图片
          if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
            bo = true
          }
        } else if (this.uploadType === 3) { // 视频
          if (file.type === 'video/avi' || file.type === 'video/mov' || file.type === 'video/rmvb' || file.type === 'video/mp4') {
            bo = true
          }
        } else if (this.uploadType === 4) { // 文件
          let fileName = file.name
          let lastName = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
          if (lastName.toLowerCase() === '.doc' || lastName.toLowerCase() === '.docx' || lastName.toLowerCase() === '.xls' || lastName.toLowerCase() === '.xlsx' || lastName.toLowerCase() === '.txt' || lastName.toLowerCase() === '.xml') {
            bo = true
          }
        }
        if (!bo) {
          this.$message.error(this.tipMsg)
          return false
        }
        this.num++
      },
      // 上传成功
      successHandle (response, file, fileList) {
        this.fileList = fileList
        this.successNum++
        if (response && response.code === 200) {
          if (this.num === this.successNum) {
            this.$confirm('操作成功, 是否继续操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(() => {
              this.visible = false
            })
          }
        } else {
          this.$message.error(response.msg)
        }
      },
      // 弹窗关闭时
      closeHandle () {
        this.fileList = []
        this.$emit('refreshDataList')
      }
    }
  }
</script>
