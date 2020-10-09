<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="系统名称" prop="systemname">
        <el-input v-model="dataForm.systemname" placeholder="系统名称"></el-input>
      </el-form-item>
      <el-form-item label="单位名称" prop="danweiname">
        <el-input v-model="dataForm.danweiname" placeholder="单位名称"></el-input>
      </el-form-item>
      <el-form-item label="系统级别" prop="systemdengji" v-if="dataForm.status===0">
        <el-select v-model="dataForm.systemdengji" placeholder="系统级别">
          <el-option
            v-for="store in jibieList"
            :key="store.jibie"
            :label="store.jibieName"
            :value="store.jibie">
          </el-option>
        </el-select>
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
        jibie:2,
        dataForm: {
          id: 0,
          systemname: '',
          danweiname: '',
          systemdengji: '',
          type: '',
          status: '',
          creattime: '',
          creatuserid: '',
          jigoucode: '',
          bushihe: ''},
        jibieList: [{jibie:2,jibieName:"二级"},{jibie:3,jibieName:"三级"}],
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: `/cp/project/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
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
                url: `/cp/project`,
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
