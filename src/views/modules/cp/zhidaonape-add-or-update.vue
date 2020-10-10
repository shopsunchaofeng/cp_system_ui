<template>
  <el-dialog
    :title="'编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="作业指导书" prop="content">
       <!-- <el-input  type="textarea" maxlength="3000" show-word-limit v-model="dataForm.content" placeholder="作业指导书"></el-input>-->
        <u-editor v-model="dataForm.content"></u-editor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import UEditor from "../../../components/ueditor/index";
  export default {
    components: {UEditor},
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          napeid: '',
          userid: '',
          content: ''},
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (napeid) {
        this.dataForm.napeid = napeid || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.napeid) {
            this.$http({
              url: `/cp/napezhidao/info/${this.dataForm.napeid}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                if (data.data) {
                  this.dataForm = data.data
                }
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/cp/napezhidao`,
                method: `${!this.dataForm.id || 0 ? 'post' : 'put'}`,
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
