<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="等级" prop="jibie">
        <el-input-number v-model="dataForm.jibie" placeholder="等级(是几就代表级)"></el-input-number>
      </el-form-item>
      <el-form-item label="第一层" prop="yiceng">
        <el-input v-model="dataForm.yiceng" placeholder="第一层"></el-input>
      </el-form-item>
      <el-form-item label="第二层" prop="erceng">
        <el-input v-model="dataForm.erceng" placeholder="第二层"></el-input>
      </el-form-item>
      <el-form-item label="第三层" prop="sanceng">
        <el-input v-model="dataForm.sanceng" placeholder="第三层"></el-input>
      </el-form-item>
      <el-form-item label="第四层" prop="siceng">
        <el-input v-model="dataForm.siceng" placeholder="第四层"></el-input>
      </el-form-item>
      <el-form-item label="要求" prop="yaoqiu">
        <el-input v-model="dataForm.yaoqiu" placeholder="要求"></el-input>
      </el-form-item>
      <el-form-item label="a项" prop="xa">
        <el-input v-model="dataForm.xa" placeholder="a项"></el-input>
      </el-form-item>
      <el-form-item label="b项" prop="xb">
        <el-input v-model="dataForm.xb" placeholder="b项"></el-input>
      </el-form-item>
      <el-form-item label="c项" prop="xc">
        <el-input v-model="dataForm.xc" placeholder="c项"></el-input>
      </el-form-item>
      <el-form-item label="d项" prop="xd">
        <el-input v-model="dataForm.xd" placeholder="d项"></el-input>
      </el-form-item>
      <el-form-item label="是否是特殊" prop="isteshu">
        <el-radio-group v-model="dataForm.isteshu">
          <el-radio-button label="0">否</el-radio-button>
          <el-radio-button label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选项1" prop="xx1">
        <el-input v-model="dataForm.xx1" placeholder="选项1"></el-input>
      </el-form-item>
      <el-form-item label="选项2" prop="xx2">
        <el-input v-model="dataForm.xx2" placeholder="选项2"></el-input>
      </el-form-item>
      <el-form-item label="选项3" prop="xx3">
        <el-input v-model="dataForm.xx3" placeholder="选项3"></el-input>
      </el-form-item>
      <el-form-item label="选项4" prop="xx4">
        <el-input v-model="dataForm.xx4" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="选项5" prop="xx5">
        <el-input v-model="dataForm.xx5" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="选项6" prop="xx6">
        <el-input v-model="dataForm.xx6" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="选项7" prop="xx7">
        <el-input v-model="dataForm.xx7" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="选项8" prop="xx8">
        <el-input v-model="dataForm.xx8" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="选项9" prop="xx9">
        <el-input v-model="dataForm.xx9" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="选项10" prop="xx10">
        <el-input v-model="dataForm.xx10" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="选项11" prop="xx11">
        <el-input v-model="dataForm.xx11" placeholder=""></el-input>
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
          id: 0,
          jibie: '',
          yiceng: '',
          erceng: '',
          sanceng: '',
          siceng: '',
          yaoqiu: '',
          xa: '',
          xb: '',
          xc: '',
          xd: '',
          isteshu: '',
          xx1: '',
          xx2: '',
          xx3: '',
          xx4: '',
          xx5: '',
          xx6: '',
          xx7: '',
          xx8: '',
          xx9: '',
          xx10: '',
          xx11: ''},
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
              url: `/cp/nape/info/${this.dataForm.id}`,
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
                url: `/cp/nape`,
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
