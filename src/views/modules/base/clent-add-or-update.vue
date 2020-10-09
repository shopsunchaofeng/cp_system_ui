<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="客户编号" prop="clientCode">
        <el-input-number v-model="dataForm.clientCode" :min="0" :max="9999999999" label="客户编号"></el-input-number>
      </el-form-item>
      <el-form-item label="客户名称" prop="clentName">
        <el-input v-model="dataForm.clentName" placeholder="客户名称"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input v-model="dataForm.contactName" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="contactPhone">
        <el-input v-model="dataForm.contactPhone" placeholder="联系人电话"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
        <el-input v-model="dataForm.introduction" placeholder="简介"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="所在地" prop="location">
        <el-cascader v-model="dataForm.location" :options="locationData" :props="locationProps" placeholder="省/市/区" style="width:100%"/>
      </el-form-item>
      <el-form-item label="详细地址" prop="locationDetail">
        <el-input v-model="dataForm.locationDetail" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">无效</el-radio>
          <el-radio :label="1">有效</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户LOGO" prop="logoId">
        <el-input v-model="dataForm.logoId" placeholder="客户LOGO"></el-input>
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
          clientCode: '',
          clentName: '',
          contactPhone: '',
          contactName: '',
          introduction: '',
          remark: '',
          location: [],
          locationProvinceId: '',
          locationCityId: '',
          locationCountyId: '',
          locationDetail: '',
          status: 1,
          logoId: '',
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
          ],
          clientCode: [
            {required: true, message: '客户编号为空', trigger: 'blur'}
          ],
          clentName: [
            {required: true, message: '客户名称不能为空', trigger: 'blur'}
          ],
          contactName: [
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
          contactPhone: [
            {required: true, message: '电话不能为空', trigger: 'blur'}
          ]
        },
        locationData: [],
        locationProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        }
      }
    },
    methods: {
      init (id) {
        let that = this
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.getAreaTree(0).then(function (data) {
            that.locationData = data
          })
          if (this.dataForm.id) {
            this.$http({
              url: `/base/clent/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
                this.dataForm.location = [this.dataForm.locationProvinceId, this.dataForm.locationCityId, this.dataForm.locationCountyId]
              }
            })
          }
        })
      },
      // 动态加载树
      getAreaTree (val) {
        let that = this
        return new Promise(function (resolve, reject) {
          that.$http({
            url: '/id/region/getTree',
            method: 'get',
            params: {
            }
          }).then(({data}) => {
            if (data && data.code === 200) {
              resolve(data.data)
            } else {
              reject(data.msg)
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              if (this.dataForm.location && this.dataForm.location.length === 3) {
                this.dataForm.locationProvinceId = this.dataForm.location[0]
                this.dataForm.locationCityId = this.dataForm.location[1]
                this.dataForm.locationCountyId = this.dataForm.location[2]
              }
              this.$http({
                url: `/base/clent`,
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
