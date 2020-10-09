<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="dataForm.dictName" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="上级节点" prop="parentId">
        <el-input v-model="dataForm.parentId" placeholder="上级节点"></el-input>
      </el-form-item>
      <el-form-item label="该节点级别" prop="level">
        <el-input v-model="dataForm.level" placeholder="该节点级别"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input v-model="dataForm.orderNum" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="是否为系统保留，1是，0否" prop="isSystem">
        <el-input v-model="dataForm.isSystem" placeholder="是否为系统保留，1是，0否"></el-input>
      </el-form-item>
      <el-form-item label="系统编号" prop="systemId">
        <el-input v-model="dataForm.systemId" placeholder="系统编号"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="clentId">
        <el-input v-model="dataForm.clentId" placeholder="客户编号"></el-input>
      </el-form-item>
      <el-form-item label="操作时间" prop="crtTime">
        <el-input v-model="dataForm.crtTime" placeholder="操作时间"></el-input>
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
        dataForm: {
          dictId: 0,
          dictName: '',
          parentId: '',
          level: '',
          orderNum: '',
          isSystem: '',
          systemId: '',
          clentId: '',
          crtTime: ''},
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
              url: `/base/dict/info/${this.dataForm.id}`,
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
                url: `/base/dict`,
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
