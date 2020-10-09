<template>
  <el-dialog
    :title="isSave ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="系统代码" prop="systemId">
        <el-input-number v-model="dataForm.systemId" v-bind:disabled="!isSave" :min="0" :max="100000" label="系统代码" style="width:220px"></el-input-number>
      </el-form-item>
      <el-form-item label="系统名称" prop="systemName">
        <el-input v-model="dataForm.systemName" placeholder="系统名称"></el-input>
      </el-form-item>
      <el-form-item label="系统标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="系统标题"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
        <el-input v-model="dataForm.introduction" placeholder="简介"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="3" v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="支持部署类型" size="mini" prop="deployType">
        <el-radio-group v-model="dataForm.deployType">
          <el-radio :label="1">公有/私有</el-radio>
          <el-radio :label="2">公有</el-radio>
          <el-radio :label="3">私有</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发布时间" prop="releaseTime">
        <el-date-picker
          v-model="dataForm.releaseTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="系统发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="版权信息" prop="copyright">
        <el-input v-model="dataForm.copyright" placeholder="版权信息"></el-input>
      </el-form-item>
      <el-form-item label="初始化方法" prop="initMethod">
        <el-input v-model="dataForm.initMethod" placeholder="初始化方法"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="userId">
        <el-select
          v-model="dataForm.userId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入负责人"
          :remote-method="remoteUserList"
          :loading="loading">
          <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"/>
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
        dataForm: {
          systemId: 0,
          systemName: '',
          title: '',
          introduction: '',
          remark: '',
          deployType: 1,
          releaseTime: '',
          copyright: '',
          userId: '',
          initMethod: ''},
        dataRule: {
          systemId: [
            {required: true, message: '系统代码不能为空', trigger: 'blur'}
          ],
          systemName: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '名称标题为空', trigger: 'blur'}
          ],
          deployType: [
            {required: true, message: '支持部署类型不能为空', trigger: 'blur'}
          ],
          releaseTime: [
            {required: true, message: '系统发布时间不能为空', trigger: 'blur'}
          ]
        },
        userList: [],
        loading: false,
        isSave: true
      }
    },
    methods: {
      init (systemId) {
        if (!systemId) {
          this.isSave = true
          systemId = 0
        } else {
          this.isSave = false
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.systemId = systemId || 0
          if (systemId) {
            this.$http({
              url: `/base/system/info/${systemId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
                this.userList = []
                this.userList.push({ id: this.dataForm.userId, realName: this.transUser(this.dataForm.userId) })
              }
            })
          }
        })
      },
      // 搜索负责人
      remoteUserList (realName) {
        if (realName) {
          this.loading = true
          this.$http({
            url: '/base/user/list',
            method: 'get',
            params: {
              'page': 1,
              'limit': 10,
              'realName': realName
            }
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.loading = false
              this.userList = data.page.records
              this.userList.forEach(item => {
                item.realName = item.realName + ' || ' + item.userName
              })
            } else {
              this.userList = []
            }
          })
        } else {
          this.userList = []
        }
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
