<template>
  <el-dialog
    title="开通系统"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="系统代码" prop="systemId">
        <el-input-number v-model="dataForm.systemId" v-bind:disabled="!isSave" :min="0" :max="100000" label="系统代码"></el-input-number>
      </el-form-item>
      <el-form-item label="系统名称" prop="systemName">
        <el-input v-model="dataForm.systemName" placeholder="系统名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        clentId: '',
        userList: [],
        loading: false,
        dataList: [],
        isSave: true
      }
    },
    methods: {
      init (clentId) {
        this.visible = true
        this.$nextTick(() => {
          this.clentId = clentId || 0
          this.$http({
            url: `/base/system/info/${clentId}`,
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.dataList = this.dataList
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/base/system`,
                method: `${this.isSave ? 'post' : 'put'}`,
                data: this.dataForm
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
            }
          })
      }
    }
  }
</script>
