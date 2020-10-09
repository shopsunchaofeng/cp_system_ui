<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="客户id" prop="clentId">
        <el-input v-model="dataForm.clentId" placeholder="客户id"></el-input>
      </el-form-item>
      <el-form-item label="系统编号" prop="systemId">
        <el-input v-model="dataForm.systemId" placeholder="系统编号"></el-input>
      </el-form-item>
      <el-form-item label="所在省ID" prop="locationProvinceId">
        <el-input v-model="dataForm.locationProvinceId" placeholder="所在省ID"></el-input>
      </el-form-item>
      <el-form-item label="所在市ID" prop="locationCityId">
        <el-input v-model="dataForm.locationCityId" placeholder="所在市ID"></el-input>
      </el-form-item>
      <el-form-item label="所在区ID" prop="locationCountyId">
        <el-input v-model="dataForm.locationCountyId" placeholder="所在区ID"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="locationDetail">
        <el-input v-model="dataForm.locationDetail" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="有效期限" prop="validTime">
        <el-input v-model="dataForm.validTime" placeholder="有效期限"></el-input>
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNo">
        <el-input v-model="dataForm.contractNo" placeholder="合同编号"></el-input>
      </el-form-item>
      <el-form-item label="签约人" prop="signUserId">
        <el-input v-model="dataForm.signUserId" placeholder="签约人"></el-input>
      </el-form-item>
      <el-form-item label="签约日期" prop="signTime">
        <el-input v-model="dataForm.signTime" placeholder="签约日期"></el-input>
      </el-form-item>
      <el-form-item label="签约地点" prop="signPlace">
        <el-input v-model="dataForm.signPlace" placeholder="签约地点"></el-input>
      </el-form-item>
      <el-form-item label="代理商id" prop="agentId">
        <el-input v-model="dataForm.agentId" placeholder="代理商id"></el-input>
      </el-form-item>
      <el-form-item label="附件ID，合同编号" prop="annexId">
        <el-input v-model="dataForm.annexId" placeholder="附件ID，合同编号"></el-input>
      </el-form-item>
      <el-form-item label="状态，1有效，0无效" prop="status">
        <el-input v-model="dataForm.status" placeholder="状态，1有效，0无效"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="crtTime">
        <el-input v-model="dataForm.crtTime" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="创建人id" prop="crtUser">
        <el-input v-model="dataForm.crtUser" placeholder="创建人id"></el-input>
      </el-form-item>
      <el-form-item label="创建人名称" prop="crtName">
        <el-input v-model="dataForm.crtName" placeholder="创建人名称"></el-input>
      </el-form-item>
      <el-form-item label="创建IP" prop="crtHost">
        <el-input v-model="dataForm.crtHost" placeholder="创建IP"></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updTime">
        <el-input v-model="dataForm.updTime" placeholder="更新时间"></el-input>
      </el-form-item>
      <el-form-item label="更新人id" prop="updUser">
        <el-input v-model="dataForm.updUser" placeholder="更新人id"></el-input>
      </el-form-item>
      <el-form-item label="更新人名称" prop="updName">
        <el-input v-model="dataForm.updName" placeholder="更新人名称"></el-input>
      </el-form-item>
      <el-form-item label="更新IP" prop="updHost">
        <el-input v-model="dataForm.updHost" placeholder="更新IP"></el-input>
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
          clentId: '',
          systemId: '',
          locationProvinceId: '',
          locationCityId: '',
          locationCountyId: '',
          locationDetail: '',
          validTime: '',
          contractNo: '',
          signUserId: '',
          signTime: '',
          signPlace: '',
          agentId: '',
          annexId: '',
          status: '',
          crtTime: '',
          crtUser: '',
          crtName: '',
          crtHost: '',
          updTime: '',
          updUser: '',
          updName: '',
          updHost: ''},
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
              url: `/base/clentsystem/info/${this.dataForm.id}`,
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
                url: `/base/clentsystem`,
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
