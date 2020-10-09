<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="登录账号" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-dict code="SEX" v-model="dataForm.sex"></el-dict>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="负责人姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobilePhone">
        <el-input v-model="dataForm.mobilePhone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="cpIdcard">
        <el-input v-model="dataForm.cpIdcard" placeholder="负责人身份证号"></el-input>
      </el-form-item>
      <el-form-item label="身份" prop="roleIdList">
        <el-select v-model="dataForm.roleIdList" multiple clearable filterable placeholder="请选择" class="width100">
          <el-option
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleName"
            :value="role.roleId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹窗, 选择文件 -->
    <ossSelect v-show="selectOssVisible" ref="ossSelectRef" @selectData='callbackOss(arguments)' ></ossSelect>
  </el-dialog>
</template>

<script>
  import OssSelect from '../base/ossfile-oss-select'
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
        roleList: [{roleId:15,roleName:'项目经理'},{roleId:16,roleName:'高级测评师'},{roleId:17,roleName:'中级测评师'},{roleId:18,roleName:'初级测评师'}],
        dataForm: {
          orgName: '',
          id: undefined,
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
        imagesArray: [],
        dataRule: {
          userName: [{required: true, message: '登录账号不能为空', trigger: 'blur'}],
          sex: [{required: true, message: '性别不能为空', trigger: 'blur'}],
          realName: [{required: true, message: '姓名不能为空', trigger: 'blur'}]
        }
      }
    },
    components: {
      OssSelect
    },
    methods: {
      // 选择文件
      selectOssHandle () {
        this.selectOssVisible = true
        this.$nextTick(() => {
          this.$refs.ossSelectRef.init(false)
        })
      },
      callbackOss (param) {
        // this.dataForm.imageId = param[0][0]
        this.imagesArray = param[1]
        this.dataForm.images = param[1].join(',')
      },
      init (id) {
        this.dataForm.id = id || undefined
        this.$http({
          url: '/base/role/select',
          method: 'get'
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: `/base/user/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
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
          } else {
            this.dataForm.orgName = ''
          }
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
            message: '身份只能选一种',
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
