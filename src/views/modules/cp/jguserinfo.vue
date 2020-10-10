<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="机构单位名称" prop="cpDanwei" label-width="110px">
        <el-input v-model="dataForm.cpDanwei" placeholder="机构单位名称" readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="userName" label-width="110px">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" label-width="110px" readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="负责人性别" prop="sex" label-width="110px">
        <el-dict code="SEX" v-model="dataForm.sex" readonly="true" disabled></el-dict>
      </el-form-item>
      <el-form-item label="负责人姓名" prop="realName" label-width="110px">
        <el-input v-model="dataForm.realName" placeholder="负责人姓名" readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="负责人邮箱" prop="email" label-width="110px">
        <el-input v-model="dataForm.email" placeholder="邮箱" readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="负责人手机号" prop="mobilePhone" label-width="110px">
        <el-input v-model="dataForm.mobilePhone" placeholder="手机号" readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="负责人身份证号" prop="cpIdcard" label-width="110px">
        <el-input v-model="dataForm.cpIdcard" placeholder="负责人身份证号" readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="机构logo" prop="cpLogo" label-width="110px">
        <el-image style="width: 100px; height: 100px" :src="dataForm.cpLogo" fit="scale-down"></el-image>
      </el-form-item>
      <el-form-item label="机构性质" prop="roleIdList" label-width="110px">
        <el-select v-model="dataForm.roleIdList" multiple clearable filterable placeholder="请选择" class="width100" readonly="true" disabled>
          <el-option
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleName"
            :value="role.roleId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status" label-width="110px">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0" disabled>禁用</el-radio>
          <el-radio :label="1"disabled>正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        orgNoOptions: this.treeDataTranslate(JSON.parse(sessionStorage.getItem('orgList') || '[]'), 'orgNo', 'parentNo'),
        selectOssVisible: false,
        orgListTreeProps: {
          label: 'orgName',
          children: 'children'
        },
        visible: false,
        roleList: [{roleId:13,roleName:'测评机构'},{roleId:14,roleName:'非测评机构'}],
        dataForm: {
          orgName: '',
          id: -2,
          cpDanwei: '',
          cpIdcard: '',
          cpLogo: '',
          userName: '',
          sex: '',
          realName: '',
          salt: '',
          email: '',
          mobilePhone: '',
          orgNo: '',
          roleIdList: [],
          status: 1
        },
        imagesArray: []
      }
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        debugger
        this.$http({
          url: '/base/role/select',
          method: 'get'
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
            this.$http({
              url: `/base/user/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.cpDanwei = data.user.cpDanwei
                this.dataForm.cpLogo = data.user.cpLogo
                this.dataForm.cpIdcard = data.user.cpIdcard
                this.dataForm.userName = data.user.userName
                this.dataForm.sex = data.user.sex.toString()
                this.dataForm.realName = data.user.realName
                this.dataForm.salt = data.user.salt
                this.dataForm.email = data.user.email
                this.dataForm.mobilePhone = data.user.mobilePhone
                this.dataForm.orgNo = data.user.orgNo
                this.dataForm.orgName = this.transOrg(data.user.orgNo)
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.status = data.user.status
              }
            })
        })
      },
      // 机构树设置当前选中节点
      orgListTreeSetCurrentNode (type) {
        if (type === 'mod') {
          this.$refs.orgListTree.setCurrentKey(this.dataForm.parentNo)
          this.dataForm.parentName = (this.$refs.orgListTree.getCurrentNode() || {})['orgName']
        }
      },
      // 机构树选中
      orgListTreeCurrentChangeHandle (data) {
        this.dataForm.orgNo = data.orgNo
        this.dataForm.orgName = data.orgName
      },
      // 表单提交
      dataFormSubmit () {
        if (this.dataForm.roleIdList.length>1){
          this.$message({
            message: '机构性质只能选一种',
            type: 'error',
            duration: 1500
          })
          return false;
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/base/user`,
              method: `${!this.dataForm.id || 0 ? 'post' : 'put'}`,
              data: this.dataForm
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.visible = false
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .mod-org {

  .org-list__input,
  .icon-list__input {

  > .el-input__inner {
    cursor: pointer;
  }

  }
  &
  __icon-popover {
    max-width: 350px;
  }

  &
  __icon-list {
    max-height: 380px;
    padding: 0;
    margin: -8px 0 0 -8px;

  > .el-button {
    padding: 8px;
    margin: 8px 0 0 8px;

  > span {
    display: inline-block;
    vertical-align: middle;
    width: 18px;
    height: 18px;
    font-size: 18px;
  }

  }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }

  }
</style>
