<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="测评项目经理id" prop="xuserid">
        <el-input v-model="dataForm.xuserid" placeholder="测评项目经理id"></el-input>
      </el-form-item>
      <el-form-item label="项目经理测评结果json（如果为空说明项目经整体测评未修改这一项）" prop="xresult">
        <el-input v-model="dataForm.xresult" placeholder="项目经理测评结果json（如果为空说明项目经整体测评未修改这一项）"></el-input>
      </el-form-item>
      <el-form-item label="整体测评分数(默认和测评师测评分数相等)" prop="xscore">
        <el-input v-model="dataForm.xscore" placeholder="整体测评分数(默认和测评师测评分数相等)"></el-input>
      </el-form-item>
      <el-form-item label="测评师id" prop="cpuserid">
        <el-input v-model="dataForm.cpuserid" placeholder="测评师id"></el-input>
      </el-form-item>
      <el-form-item label="测评师的测评结果json" prop="cpresult">
        <el-input v-model="dataForm.cpresult" placeholder="测评师的测评结果json"></el-input>
      </el-form-item>
      <el-form-item label="测评师测评分数" prop="cpscore">
        <el-input v-model="dataForm.cpscore" placeholder="测评师测评分数"></el-input>
      </el-form-item>
      <el-form-item label="测评项目id" prop="projectid">
        <el-input v-model="dataForm.projectid" placeholder="测评项目id"></el-input>
      </el-form-item>
      <el-form-item label="测评单元id" prop="napeid">
        <el-input v-model="dataForm.napeid" placeholder="测评单元id"></el-input>
      </el-form-item>
      <el-form-item label="状态(0，未测评 1，已测评待汇总 2，已汇总)" prop="status">
        <el-input v-model="dataForm.status" placeholder="状态(0，未测评 1，已测评待汇总 2，已汇总)"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="creattime">
        <el-input v-model="dataForm.creattime" placeholder="创建时间"></el-input>
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
          xuserid: '',
          xresult: '',
          xscore: '',
          cpuserid: '',
          cpresult: '',
          cpscore: '',
          projectid: '',
          napeid: '',
          status: '',
          creattime: ''},
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
              url: `/cp/projectuser/info/${this.dataForm.id}`,
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
                url: `/cp/projectuser`,
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
